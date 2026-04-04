import { NextResponse } from "next/server";
import { defiGuardianGraph } from "@/agent/graph";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const threadId = body.threadId || "hackathon-session-1";
    const config = { configurable: { thread_id: threadId } };
    
    console.log(`⚡ [API] Resuming LangGraph Thread [${threadId}] for Cryptographic SignIntent...`);

    // Submitting a null invocation unblocks the saved execution state perfectly.
    const result = await defiGuardianGraph.invoke(null, config);

    // After resuming, the signature node natively signs using `viem` the final transaction intent.
    return NextResponse.json({
      success: true,
      signature: result.finalSignature
    });
  } catch (error: any) {
    console.error("🔥 [API] Re-Entry Fault:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
