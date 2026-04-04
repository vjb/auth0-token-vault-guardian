import React from "react";
import { ShieldAlert, CheckCircle, XCircle, Key } from "lucide-react";

interface ConsentPanelProps {
  status: "SAFE" | "PENDING" | "APPROVED" | "DENIED";
  onApprove: () => void;
  onRevoke: () => void;
}

export function ConsentPanel({ status, onApprove, onRevoke }: ConsentPanelProps) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-2xl flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
        <Key className="text-blue-400" size={24} />
        <h2 className="text-xl font-bold tracking-tight text-white">Auth0 Token Vault</h2>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Requested Scopes</p>
        <div className="flex gap-2 flex-wrap">
          <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-full font-mono">openid</span>
          <span className="px-3 py-1 bg-blue-900/50 text-blue-300 border border-blue-800 text-xs rounded-full font-mono">execute:liquidate</span>
          <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-full font-mono">read:portfolio</span>
        </div>
      </div>

      <div className="bg-slate-950 rounded-lg p-4 flex flex-col gap-3">
        <span className="text-sm text-slate-400">Vault Connection Status:</span>
        <div className="flex items-center gap-3">
          {status === "SAFE" && <><CheckCircle className="text-emerald-500" /> <span className="text-emerald-500 font-semibold">Watching Portfolio</span></>}
          {status === "PENDING" && <><ShieldAlert className="text-amber-500 animate-pulse" /> <span className="text-amber-500 font-semibold">Awaiting Owner Consent</span></>}
          {status === "APPROVED" && <><CheckCircle className="text-blue-500" /> <span className="text-blue-500 font-semibold">Vault Unlocked (Active)</span></>}
          {status === "DENIED" && <><XCircle className="text-red-500" /> <span className="text-red-500 font-semibold">Consent Revoked</span></>}
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <button 
          onClick={onApprove}
          disabled={status !== "PENDING"}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all"
        >
          Grant Permission
        </button>
        <button 
          onClick={onRevoke}
          disabled={status === "SAFE" || status === "DENIED"}
          className="w-full bg-transparent hover:bg-red-950 text-red-500 border border-red-900 font-semibold py-3 rounded-lg transition-all"
        >
          Revoke Agent Access
        </button>
      </div>
      
      <p className="text-xs text-slate-500 text-center">
        Secured by Auth0 CIBA (Asynchronous Authorization)
      </p>
    </div>
  );
}
