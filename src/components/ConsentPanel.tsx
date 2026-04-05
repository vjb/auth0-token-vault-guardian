import React from "react";
import { ShieldAlert, CheckCircle, XCircle, Key, SmartphoneNfc } from "lucide-react";

interface ConsentPanelProps {
  status: "SAFE" | "PENDING" | "APPROVED" | "DENIED";
  onRevoke: () => void;
}

export function ConsentPanel({ status, onRevoke }: ConsentPanelProps) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-2xl flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-slate-700 pb-4">
        <div className="flex items-center gap-3">
          <Key className="text-blue-400" size={24} />
          <h2 className="text-xl font-bold tracking-tight text-white">Auth0 Token Vault</h2>
        </div>
        {status === "PENDING" && <SmartphoneNfc className="text-amber-500 animate-pulse" size={24} />}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Requested Scopes</p>
        <div className="flex gap-2 flex-wrap">
          <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-full font-mono">openid</span>
          <span className="px-3 py-1 bg-blue-900/50 text-blue-300 border border-blue-800 text-xs rounded-full font-mono">execute_transfer</span>
          <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-full font-mono">read:portfolio</span>
        </div>
      </div>

      <div className="bg-slate-950 rounded-lg p-4 flex flex-col gap-3">
        <span className="text-sm text-slate-400">Vault Security Check:</span>
        <div className="flex items-center gap-3">
          {status === "SAFE" && <><CheckCircle className="text-emerald-500" /> <span className="text-emerald-500 font-semibold">Monitoring Active</span></>}
          {status === "PENDING" && <><ShieldAlert className="text-amber-500 animate-pulse" /> <span className="text-amber-500 font-semibold">Awaiting Owner Mobile App Approval (CIBA)</span></>}
          {status === "APPROVED" && <><CheckCircle className="text-blue-500" /> <span className="text-blue-500 font-semibold">Vault Unlocked (Thread Unblocked)</span></>}
          {status === "DENIED" && <><XCircle className="text-red-500" /> <span className="text-red-500 font-semibold">Consent Denied / Aborted</span></>}
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <button 
          onClick={onRevoke}
          disabled={status === "SAFE" || status === "DENIED"}
          className="w-full bg-transparent hover:bg-red-950 text-red-500 border border-red-900 disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-3 rounded-lg transition-all"
        >
          Revoke Agent Thread Access
        </button>
      </div>
      
      <p className="text-xs text-slate-500 text-center">
        Secured implicitly by Auth0 Asynchronous Authorization
      </p>
    </div>
  );
}
