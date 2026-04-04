"use client";

import React, { useState } from "react";
import { ConsentPanel } from "@/components/ConsentPanel";
import { Ledger } from "@/components/Ledger";
import { Activity } from "lucide-react";

export default function Home() {
  const [dropSimulated, setDropSimulated] = useState(false);
  const [authStatus, setAuthStatus] = useState<"SAFE" | "PENDING" | "APPROVED" | "DENIED">("SAFE");
  const [signature, setSignature] = useState<string | null>(null);

  // Mocking the LangGraph trigger for the UI demonstration
  const handleMarketCrash = () => {
    setDropSimulated(true);
    setAuthStatus("PENDING");
    // Under the hood, this simulates hitting the `interruptBefore: ["SignIntent"]`
    console.log("Graph paused for Human-in-the-loop");
  };

  const handleGrantPermission = () => {
    setAuthStatus("APPROVED");
    // Simulating the unblocking of the LangGraph state
    setTimeout(() => {
      // Mocking the generated viem EIP-712 signature hash
      setSignature("0xea91924b74aee2d99d3dc747ec3a24683cb0d0db73db3bb0d744b8eeed121acb0c511394f92d2424b45508a3d5eecbeed4a9bfe15d186c3dbf923c8a98dddbdf1b");
    }, 1500);
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
                <h3 className="text-xl font-bold">Strykr PRISM Data</h3>
                <span className="px-3 py-1 bg-slate-800 text-xs rounded text-blue-400 font-mono">Live Sync</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-slate-950 rounded-lg flex flex-col">
                  <span className="text-xs text-slate-500 font-semibold tracking-wider">AUM BALANCE</span>
                  <span className={`text-2xl font-bold font-mono mt-1 ${dropSimulated ? 'text-red-500' : 'text-slate-200'}`}>
                    ${dropSimulated ? '7,240,000.00' : '10,000,000.00'}
                  </span>
                </div>
                <div className="p-4 bg-slate-950 rounded-lg flex flex-col">
                  <span className="text-xs text-slate-500 font-semibold tracking-wider">DRAWDOWN</span>
                  <span className={`text-2xl font-bold font-mono mt-1 ${dropSimulated ? 'text-red-500' : 'text-emerald-500'}`}>
                    {dropSimulated ? '-27.6%' : '+1.4%'}
                  </span>
                </div>
              </div>

              <button 
                onClick={handleMarketCrash}
                disabled={dropSimulated}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-4 rounded-xl border border-slate-700 transition"
              >
                {dropSimulated ? "Market Crash Simulated" : "Trigger Market Crash Simulation (-25%)"}
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
