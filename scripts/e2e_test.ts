import { defiGuardianGraph } from "../src/agent/graph";

async function runInteractiveTest() {
  console.log("\n=======================================================");
  console.log("🤖 [TEST SUITE] Auth0 Token Vault End-to-End Execution");
  console.log("=======================================================\n");
  
  const testSessionId = `e2e_test_${Date.now()}`;
  const config = { configurable: { thread_id: testSessionId } };

  console.log("🚀 [Phase 1] Initiating headless LangGraph agent...");
  console.log("📉 [Phase 1] Evaluating Agent Intent for a High-Value Web3 Transfer...");

  try {
    console.log("\n🔒 [AUTH0] Triggering Token Vault. AWAITING MOBILE PUSH APPROVAL...");
    console.log("👉 ACTION REQUIRED: Please check your Auth0 Guardian app right now!");
    
    // Initiate the Graph. This natively delegates to the Auth0 CIBA Hook.
    const result = await defiGuardianGraph.invoke({ portfolioDrop: 200000 }, config);
    
    // Check if the graph successfully paused at our interrupt boundary
    const state = await defiGuardianGraph.getState(config);
    const isPaused = state.next && state.next.length > 0;

    if (!isPaused || result.authStatus === "DENIED") {
      console.log("\n❌ [FAIL] Auth0 Token Vault physically blocked the payload.");
      console.log(`❌ Reason: The backend returned Auth Status [${result.authStatus}]`);
      console.log("Make sure you approved the mobile push, or that your CIBA Tenant is fully configured.");
      process.exit(1);
    }

    console.log("\n✅ [Phase 1] Auth0 Token Vault Consent Explicitly Acquired!");
    console.log("✅ [Phase 1] Graph securely intercepted at SignIntent execution boundary.");
    
    console.log("\n🚀 [Phase 2] Resuming LangGraph Thread for Viem Execution...");
    // Passing null resumes the interrupt safely
    const finalResult = await defiGuardianGraph.invoke(null, config);

    console.log("\n=======================================================");
    console.log("🎉 [SUCCESS] Native Web3 Payload Generated Successfully!");
    console.log("=======================================================\n");
    console.log("EIP-712 Cryptographic Signature:");
    console.log(finalResult.finalSignature);
    console.log("\n");
    
    process.exit(0);

  } catch (error: any) {
    console.log("\n❌ [CRITICAL FAULT] The execution engine threw a hard native error:");
    console.error(error);
    process.exit(1);
  }
}

runInteractiveTest();
