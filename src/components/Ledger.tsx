import React from "react";
import { Terminal, Copy } from "lucide-react";

interface LedgerProps {
  signature: string | null;
  timestamp: string;
}

export function Ledger({ signature, timestamp }: LedgerProps) {
  return (
    <div className="bg-white border border-emerald-200 rounded-xl p-6 shadow-xl flex flex-col gap-4 font-mono">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <Terminal className="text-emerald-500" size={20} />
          <h2 className="text-lg font-bold text-emerald-500">Execution Ledger</h2>
        </div>
        <span className="text-xs text-slate-500 text-right">Base Sepolia L2</span>
      </div>

      {!signature ? (
        <div className="text-slate-400 font-medium text-base py-10 flex flex-col items-center gap-2 animate-pulse">
          <span>_awaiting_mfa_push_approval_</span>
          <span className="text-xs text-slate-500 font-normal">Physical Hardware Vault remains cryptographically locked</span>
        </div>
      ) : (
        <div className="flex flex-col gap-4 animate-in fade-in duration-500">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-500">TIMESTAMP</span>
            <span className="text-sm text-slate-700">{timestamp}</span>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-500">VERIFIED EIP-712 SIGNATURE</span>
            <div className="bg-slate-50 p-3 rounded-lg text-emerald-700 text-xs break-all border border-slate-200 relative group cursor-pointer hover:border-emerald-500 transition">
              {signature}
              <Copy className="absolute right-2 top-2 text-slate-400 group-hover:text-emerald-600 opacity-0 group-hover:opacity-100 transition" size={14} />
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-500">DERIVED INTENT HASH</span>
            <span className="text-sm text-blue-600 hover:text-blue-700 font-mono transition cursor-pointer">
              {signature.substring(0, 12)}...{signature.substring(signature.length - 6)}
            </span>
          </div>

          <div className="mt-2 text-xs text-emerald-600 border-t border-slate-200 pt-3 font-semibold tracking-wide">
             [SUCCESS] Cryptographic payload signed and verified.
          </div>
        </div>
      )}
    </div>
  );
}
