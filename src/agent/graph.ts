import { StateGraph, Annotation, MemorySaver } from "@langchain/langgraph/web";
import { requestAsynchronousVaultConsent } from "../lib/auth0";
import { Web3CryptographyManager } from "../lib/web3";

// 1. Define the internal Agent State
export const GraphState = Annotation.Root({
  portfolioDrop: Annotation<number>(),
  actionRequired: Annotation<string>(),
  authStatus: Annotation<string>(),
  finalSignature: Annotation<string | null>(),
  error: Annotation<string | null>(),
});

// 2. Node: Monitor the PRISM Risk Oracle
const MonitorRisk = async (state: typeof GraphState.State) => {
  console.log("📊 [AGENT] Scanning portfolio risk...");
  
  // If the drop is worse than 15%, we mandate a liquidation circuit breaker
  if (state.portfolioDrop >= 15) {
    return { actionRequired: "LIQUIDATE_ALL", authStatus: "PENDING" };
  }
  return { actionRequired: "HOLD", authStatus: "SAFE" };
};

// 3. Node: Auth0 CIBA Wrap (Token Vault)
const RequestAuth0Consent = async (state: typeof GraphState.State) => {
  console.log("🔒 [AGENT] Initiating Auth0 Token Vault execution wrap...");
  
  // Create a minimal executable hook that uses the official CIBA intercept wrapper
  const executeLiquidationHook = async () => true; 
  const vaultProtectedHook = requestAsynchronousVaultConsent(executeLiquidationHook as any);
  
  try {
    // This will pause the thread until the mobile push is clicked
    await vaultProtectedHook({ 
      action: state.actionRequired, 
      threshold: state.portfolioDrop 
    });
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
  
  const web3 = new Web3CryptographyManager();
  const timestamp = BigInt(Math.floor(Date.now() / 1000));
  const threshold = BigInt(Math.floor(state.portfolioDrop));

  const signature = await web3.signTradeIntent(state.actionRequired, threshold, timestamp);
  
  return { finalSignature: signature };
};

// 5. Edges Routing
const shouldRequestConsentRoute = (state: typeof GraphState.State) => {
  if (state.actionRequired === "LIQUIDATE_ALL") {
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

// Initialize memory specifically to hold the paused thread state across client reloads
const memory = new MemorySaver();

// 7. Compile the Graph
// HUMAN IN THE LOOP: Breakpoint before signing the intent!
export const defiGuardianGraph = workflow.compile({
  checkpointer: memory,
  interruptBefore: ["SignIntent"], 
});
