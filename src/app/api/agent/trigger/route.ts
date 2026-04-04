import { NextResponse } from "next/server";
import { defiGuardianGraph } from "@/agent/graph";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Explicitly derive thread ID from the frontend to allow infinite safe demo resets!
    const threadId = body.threadId || "hackathon-session-1";
    const config = { configurable: { thread_id: threadId } };
    
    console.log(`⚡ [API] Triggering True LangGraph Workflow on thread: ${threadId}`);

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
      isPaused: isPaused,
      threadId: threadId
    });
  } catch (error: any) {
    console.error("🔥 [API] Trace Fault:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
