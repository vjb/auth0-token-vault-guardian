"use client";

import React, { useState } from "react";
import { ConsentPanel } from "@/components/ConsentPanel";
import { Ledger } from "@/components/Ledger";
import { Activity } from "lucide-react";

export default function Home() {
  const [dropSimulated, setDropSimulated] = useState(false);
  const [authStatus, setAuthStatus] = useState<"SAFE" | "PENDING" | "APPROVED" | "DENIED">("SAFE");
  const [signature, setSignature] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>("");

  // Triggers the true LangGraph executing on the server
  const handleMarketCrash = async () => {
    setDropSimulated(true);
    setAuthStatus("PENDING");
    setIsLoading(true);

    try {
      const activeSession = `demo_${Date.now()}`;
      setSessionId(activeSession);
      
      const pRetry = (await import('p-retry')).default;
      const res = await pRetry(
        async () => {
          const response = await fetch("/api/agent/trigger", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ portfolioDrop: 25.0, threadId: activeSession }),
          });
          if (!response.ok) throw new Error(response.statusText);
          return response;
        },
        { 
          retries: 3,
          onFailedAttempt: error => console.warn(`Trigger fetch failed. Retrying... (${error.retriesLeft} left)`)
        }
      );
      const data = await res.json();
      
      if (data.isPaused && data.authStatus === "APPROVED") {
        setAuthStatus("APPROVED");
      } else {
        // Fallback or explicit Auth0 CIBA error/rejection
        setAuthStatus("DENIED");
        console.warn("Auth0 Token Vault hook returned DENIED or timed out.");
      }
    } catch (e: any) {
      console.error(e);
      setAuthStatus("DENIED");
      setResumeError("Trigger Fault: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Resumes the suspended LangGraph thread
  const handleSignAndBroadcast = async () => {
    try {
      setIsSigning(true);
      // Calls the execution endpoint which explicitly passes control back to 
      // the node engine to formally calculate the Viem Web3 signature.
      const pRetry = (await import('p-retry')).default;
      const res = await pRetry(
        async () => {
          const response = await fetch("/api/agent/resume", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ threadId: sessionId }),
          });
          if (!response.ok) throw new Error(response.statusText);
          return response;
        },
        { 
          retries: 3,
          onFailedAttempt: error => console.warn(`Resume fetch failed. Retrying... (${error.retriesLeft} left)`)
        }
      );
      const data = await res.json();
      
      if (data.signature) {
        setSignature(data.signature);
        setResumeError(null);
      } else {
        setResumeError(data.error || "Unknown server fault during signing");
      }
    } catch (e: any) {
      console.error("Signature bridging failed:", e);
      setResumeError(e.message || "Failed to reach backend");
    } finally {
      setIsSigning(false);
    }
  };

  const handleRevokeAccess = () => {
    setAuthStatus("DENIED");
    setSignature(null);
    setDropSimulated(false);
    // Realistically this would hit an abort webhook `/api/agent/abort` to clear the LangGraph thread state
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-8 md:p-16">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        
        <header className="flex items-center gap-4 border-b border-slate-200 pb-6">
          <div className="bg-blue-600 p-3 rounded-xl">
            <Activity className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">TokenVault Guardian</h1>
            <p className="text-slate-600 font-medium">Institutional Risk Management Engine</p>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Metrics & Graph State */}
          <div className="md:col-span-8 flex flex-col gap-8">
            <section className="bg-white border border-slate-200 p-8 rounded-2xl shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Agent Intent Engine</h3>
                <span className="px-3 py-1 bg-slate-100 text-xs rounded text-blue-600 font-mono">Monitoring</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-slate-50 rounded-lg flex flex-col border border-slate-100">
                  <span className="text-xs text-slate-500 font-semibold tracking-wider">TREASURY AUM</span>
                  <span className={`text-2xl font-bold font-mono mt-1 ${dropSimulated ? 'text-amber-600' : 'text-slate-900'}`}>
                    ${dropSimulated ? '9,800,000.00' : '10,000,000.00'}
                  </span>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg flex flex-col border border-slate-100">
                  <span className="text-xs text-slate-500 font-semibold tracking-wider">TARGET REBALANCE (USDC)</span>
                  <span className={`text-2xl font-bold font-mono mt-1 ${dropSimulated ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {dropSimulated ? '200,000.00' : '0.00'}
                  </span>
                </div>
              </div>

              <button 
                onClick={handleMarketCrash}
                disabled={dropSimulated || isLoading}
                className="w-full bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-900 font-bold py-4 rounded-xl border border-slate-200 transition shadow-sm"
              >
                {isLoading ? "Negotiating Secure Bounds..." : dropSimulated ? "Transaction Intent Registered" : "Initialize High-Value Rebalance"}
              </button>
            </section>

            {authStatus === "APPROVED" && (
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl flex items-center justify-between animate-in fade-in zoom-in duration-500">
                <div>
                  <h4 className="text-blue-700 font-bold mb-1">Auth0 Vault Unlocked</h4>
                  <p className="text-sm text-blue-600">The LangGraph thread has successfully acquired the requested execution scopes.</p>
                </div>
                <button 
                  onClick={handleSignAndBroadcast}
                  disabled={isSigning}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-md"
                >
                  {isSigning ? "Signing Payload..." : "Sign & Broadcast Intent"}
                </button>
              </div>
            )}

            {resumeError && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-xl mt-4">
                <span className="text-red-600 font-mono text-sm break-words">Backend Fault: {resumeError}</span>
              </div>
            )}

            <Ledger signature={signature} timestamp={new Date().toISOString()} />
          </div>

          {/* Right Column: User Control */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <ConsentPanel 
              status={authStatus} 
              onRevoke={handleRevokeAccess} 
            />
          </div>

        </main>
      </div>
    </div>
  );
}
