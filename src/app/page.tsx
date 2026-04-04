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

  // Triggers the true LangGraph executing on the server
  const handleMarketCrash = async () => {
    setDropSimulated(true);
    setAuthStatus("PENDING");
    setIsLoading(true);

    try {
      // This fetch securely connects to the Next.js API. 
      // The API initiates LangGraph, which pauses execution to ping Auth0 CIBA.
      // Once Auth0 explicitly confirms User Mobile Consent, the API yields `isPaused: true`.
      const res = await fetch("/api/agent/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolioDrop: 25.0 }),
      });
      const data = await res.json();
      
      if (data.isPaused) {
        setAuthStatus("APPROVED");
      } else {
        setAuthStatus("DENIED");
      }
    } catch (e) {
      console.error(e);
      setAuthStatus("DENIED");
    } finally {
      setIsLoading(false);
    }
  };

  // Resumes the suspended LangGraph thread
  const handleGrantPermission = async () => {
    try {
      setIsLoading(true);
      // Calls the execution endpoint which explicitly passes control back to 
      // the node engine to formally calculate the Viem Web3 signature.
      const res = await fetch("/api/agent/resume", {
        method: "POST",
      });
      const data = await res.json();
      
      if (data.signature) {
        setSignature(data.signature);
      }
    } catch (e) {
      console.error("Signature bridging failed:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeAccess = () => {
    setAuthStatus("DENIED");
    setSignature(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-8 md:p-16">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        
        <header className="flex items-center gap-4 border-b border-slate-800 pb-6">
          <div className="bg-blue-600 p-3 rounded-xl">
            <Activity className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">DeFi Guardian</h1>
            <p className="text-slate-400 font-medium">Institutional Risk Management Engine</p>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Metrics & Graph State */}
          <div className="md:col-span-8 flex flex-col gap-8">
            <section className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Agent Intent Engine</h3>
                <span className="px-3 py-1 bg-slate-800 text-xs rounded text-blue-400 font-mono">Monitoring</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-slate-950 rounded-lg flex flex-col">
                  <span className="text-xs text-slate-500 font-semibold tracking-wider">TREASURY AUM</span>
                  <span className={`text-2xl font-bold font-mono mt-1 ${dropSimulated ? 'text-amber-500' : 'text-slate-200'}`}>
                    ${dropSimulated ? '9,800,000.00' : '10,000,000.00'}
                  </span>
                </div>
                <div className="p-4 bg-slate-950 rounded-lg flex flex-col">
                  <span className="text-xs text-slate-500 font-semibold tracking-wider">TARGET REBALANCE (USDC)</span>
                  <span className={`text-2xl font-bold font-mono mt-1 ${dropSimulated ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {dropSimulated ? '200,000.00' : '0.00'}
                  </span>
                </div>
              </div>

              <button 
                onClick={handleMarketCrash}
                disabled={dropSimulated || isLoading}
                className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-medium py-4 rounded-xl border border-slate-700 transition"
              >
                {isLoading ? "Negotiating Secure Bounds..." : dropSimulated ? "Transaction Intent Registered" : "Initialize High-Value Rebalance"}
              </button>
            </section>

            <Ledger signature={signature} timestamp={new Date().toISOString()} />
          </div>

          {/* Right Column: User Control */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <ConsentPanel 
              status={authStatus} 
              onApprove={handleGrantPermission} 
              onRevoke={handleRevokeAccess} 
            />
          </div>

        </main>
      </div>
    </div>
  );
}
