import { NextResponse } from "next/server";
import { defiGuardianGraph } from "@/agent/graph";

export async function POST() {
  try {
    const config = { configurable: { thread_id: "hackathon-session-1" } };
    
    console.log("⚡ [API] Resuming LangGraph Thread for Cryptographic SignIntent...");

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
