import React from "react";
import { ShieldCheck, UploadCloud, RefreshCw, CheckCircle2 } from "lucide-react";

export function Navbar({ onBatchProcess, isProcessing, totalReviews }){
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-100 ring-4 ring-indigo-50">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">InspectFlow</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                Compliance AI
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Marketplace Listing Quality & Policy Reviewer</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium text-slate-600">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Audited: <strong>{totalReviews}</strong></span>
          </div>

          <button
            onClick={onBatchProcess}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-xl transition duration-150 shadow-sm disabled:opacity-50"
          >
            {isProcessing ? (
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
            ) : (
              <UploadCloud className="w-4 h-4 text-slate-300" />
            )}
            <span>Process Sample Batch</span>
          </button>
        </div>
      </div>
    </header>
  );
}