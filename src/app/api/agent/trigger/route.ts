import { NextResponse } from "next/server";
import { defiGuardianGraph } from "@/agent/graph";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const config = { configurable: { thread_id: "hackathon-session-1" } };
    
    console.log("⚡ [API] Triggering True LangGraph Workflow...");

    // Invoke the graph authentically on the backend.
    // This will synchronously BLOCK inside the RequestAuth0Consent node,
    // actively polling the Auth0 CIBA endpoint waiting for the mobile push approval.
    const result = await defiGuardianGraph.invoke(
      { portfolioDrop: body.portfolioDrop },
      config
    );

    // After CIBA token is vaulted successfully, the graph hits `interruptBefore: ["SignIntent"]`
    // and correctly yields back to this HTTP handler.
    const state = await defiGuardianGraph.getState(config);
    const isPaused = state.next && state.next.length > 0;

    return NextResponse.json({
      success: true,
      authStatus: result.authStatus,
      isPaused: isPaused
    });
  } catch (error: any) {
    console.error("🔥 [API] Trace Fault:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
