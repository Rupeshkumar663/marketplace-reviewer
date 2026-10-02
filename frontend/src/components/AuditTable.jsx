import React from "react";
import { History, Eye, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

export function AuditTable({ history, onInspect }){
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-600" />
          <h2 className="text-base font-semibold text-slate-900">Audit & Decision History</h2>
        </div>
        <span className="text-xs text-slate-500">
          Showing <strong>{history.length}</strong> evaluated listings
        </span>
      </div>

      {history.length===0 ? (
        <div className="py-12 text-center space-y-2">
          <Clock className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-sm font-medium text-slate-600">No review logs available</p>
          <p className="text-xs text-slate-400">
            Submit a listing or click &quot;Process Sample Batch&quot; in the header.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-6">Product Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Violations</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Engine</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {history.map((item)=>(
                <tr key={item.id} className="hover:bg-slate-50/80 transition group">
                  <td className="py-3.5 px-6 font-medium text-slate-900 max-w-xs truncate">
                    {item.original.title}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/60 font-medium">
                      {item.original.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                    ${Number(item.original.price||0).toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    {item.findings.length>0 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-medium">
                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                        {item.findings.length} findings
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        Clean
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${
                      item.status==="approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      item.status==="rejected" ? "bg-rose-50 text-rose-700 border-rose-200" :
                      item.status==="modified" ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                      "bg-slate-100 text-slate-600 border-slate-200"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                    {item.source}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={()=>onInspect(item)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Diff</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}