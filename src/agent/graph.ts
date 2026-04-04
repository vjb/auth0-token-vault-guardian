import { StateGraph, Annotation, MemorySaver } from "@langchain/langgraph/web";
import { requestAsynchronousVaultConsent } from "../lib/auth0";
import { Web3CryptographyManager } from "../lib/web3";
import { tool } from "@langchain/core/tools";

// 1. Define the internal Agent State
export const GraphState = Annotation.Root({
  portfolioDrop: Annotation<number>(), // Keep for backward compatibility, but representing 'amount' in UI
  actionRequired: Annotation<string>(),
  authStatus: Annotation<string>(),
  finalSignature: Annotation<string | null>(),
  error: Annotation<string | null>(),
});

// 2. Node: Analyze Intent
const MonitorRisk = async (state: typeof GraphState.State) => {
  console.log("📊 [AGENT] Analyzing transaction intent...");
  
  // If the transfer amount is large, mandate Auth0 Vault verification
  if (state.portfolioDrop >= 15) {
    return { actionRequired: "EXECUTE_HIGH_VALUE_TRANSFER", authStatus: "PENDING" };
  }
  return { actionRequired: "HOLD", authStatus: "SAFE" };
};

// 3. Node: Auth0 CIBA Wrap (Token Vault)
const RequestAuth0Consent = async (state: typeof GraphState.State, config?: any) => {
  console.log("🔒 [AGENT] Initiating Auth0 Token Vault execution wrap...");
  
  // FIXED BUG: Must be a strict LangChain tool to prevent .bind errors in the SDK!
  const executeTransferTool = tool(
    async () => "Transaction mathematically valid.",
    { 
      name: "execute_transfer", 
      description: "Executes a heavily restricted web3 token transfer" 
    }
  );
  
  const vaultProtectedHook = requestAsynchronousVaultConsent(executeTransferTool);
  
  try {
    // This will securely request mobile push authorization from the tenant owner.
    // IMPERATIVE: We MUST pass "config" downward so the @auth0/ai-langchain 
    // SDK attaches to the LangGraph physical thread execution loop.
    await vaultProtectedHook.invoke({ 
      action: state.actionRequired, 
      threshold: state.portfolioDrop 
    }, config);
    return { authStatus: "APPROVED" };
  } catch (error: any) {
    return { authStatus: "DENIED", error: error.message };
  }
};

// 4. Node: Sign the Web3 Execute Intent (Viem)
const SignIntent = async (state: typeof GraphState.State) => {
  if (state.authStatus !== "APPROVED") {
    throw new Error("Critical Security Fault: Token Vault scope missing.");
  }
  
  console.log("🚀 [AGENT] Connecting to Web3 to sign Authorized Intent...");
  
  console.log(`🔑 [DEBUG] Vault Token Acquired: ${String(state.authStatus)}...`);
  
  const web3 = new Web3CryptographyManager();
  const timestamp = BigInt(Math.floor(Date.now() / 1000));
  const threshold = BigInt(Math.floor(state.portfolioDrop));

  const signature = await web3.signTradeIntent(state.actionRequired, threshold, timestamp);
  
  return { finalSignature: signature };
};

// 5. Edges Routing
const shouldRequestConsentRoute = (state: typeof GraphState.State) => {
  if (state.actionRequired === "EXECUTE_HIGH_VALUE_TRANSFER") {
    return "RequestAuth0Consent"; // Enter the Human-in-the-loop stage
  }
  return "__end__";
};

// 6. Graph Assembly
const workflow = new StateGraph(GraphState)
  .addNode("MonitorRisk", MonitorRisk)
  .addNode("RequestAuth0Consent", RequestAuth0Consent)
  .addNode("SignIntent", SignIntent)
  
  .addEdge("__start__", "MonitorRisk")
  .addConditionalEdges("MonitorRisk", shouldRequestConsentRoute)
  .addEdge("RequestAuth0Consent", "SignIntent")
  .addEdge("SignIntent", "__end__");

// Initialize memory specifically to hold the paused thread state across client reloads.
// We bind it to globalThis so Next.js Hot Module Replacement (HMR) doesn't wipe the execution thread!
const globalAny = globalThis as any;
if (!globalAny.__langgraphMemory) {
  globalAny.__langgraphMemory = new MemorySaver();
}
const memory = globalAny.__langgraphMemory;

// 7. Compile the Graph
// HUMAN IN THE LOOP: Breakpoint before signing the intent!
export const defiGuardianGraph = workflow.compile({
  checkpointer: memory,
  interruptBefore: ["SignIntent"], 
});
