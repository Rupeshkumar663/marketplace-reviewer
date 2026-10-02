import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateActiveFieldDecision, saveDecision, clearActiveReview } from "../store/reviewSlice";
import { 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  ShieldAlert, 
  CornerDownLeft, 
  AlertTriangle, 
  FileText,
  Save
} from "lucide-react";

export function DiffViewer({ review }){
  const dispatch=useDispatch();
  const [editingField, setEditingField]=useState(null);
  const [notes, setNotes]=useState(review.notes||"");

  const handleFieldAction=(field, decision)=>{
    dispatch(updateActiveFieldDecision({ field, decision }));
  };

  const handleCustomTextChange=(field, text)=>{
    dispatch(updateActiveFieldDecision({ field, decision: "custom", value: text }));
  };

  const submitFinalDecision=(status)=>{
    dispatch(saveDecision({
      id: review.id,
      updatePayload: {
        revised: review.revised,
        fieldDecisions: review.fieldDecisions,
        status,
        notes
      }
    }));
  };

  const fields=["title", "description", "price", "category"];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-6">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/40">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Remediation Workspace</h2>
            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
              review.source==="llama-3.3-70b-versatile"||review.source==="llm"
                ? "bg-purple-50 text-purple-700 border-purple-200" 
                : "bg-blue-50 text-blue-700 border-blue-200"
            }`}>
              {review.source}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review suggested changes field-by-field. Approve, customize, or reject individual revisions.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={()=>submitFinalDecision("approved")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition active:scale-95 shadow-sm shadow-emerald-100"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Approve All
          </button>
          <button
            onClick={()=>submitFinalDecision("modified")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition active:scale-95 shadow-sm shadow-indigo-100"
          >
            <Save className="w-3.5 h-3.5" /> Save Decisions
          </button>
          <button
            onClick={()=>submitFinalDecision("rejected")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition active:scale-95"
          >
            <XCircle className="w-3.5 h-3.5" /> Reject Listing
          </button>
          <button
            onClick={()=>dispatch(clearActiveReview())}
            className="inline-flex items-center gap-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            <CornerDownLeft className="w-3.5 h-3.5" /> Back
          </button>
        </div>
      </div>

      <div className="px-6 space-y-6">
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            Policy Violations & Brand Guidance Findings ({review.findings.length})
          </h3>

          {review.findings.length===0 ? (
            <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Full compliance verified. No deterministic or semantic violations identified.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {review.findings.map((f, idx)=>(
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                    f.severity==="critical"
                      ? "bg-rose-50/50 border-rose-200 text-rose-900"
                      : "bg-amber-50/50 border-amber-200 text-amber-900"
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className={`w-3.5 h-3.5 ${f.severity==="critical" ? "text-rose-600" : "text-amber-600"}`} />
                      {f.ruleTitle}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                      f.severity==="critical" 
                        ? "bg-rose-100 text-rose-700 border-rose-300/50" 
                        : "bg-amber-100 text-amber-700 border-amber-300/50"
                    }`}>
                      {f.severity}
                    </span>
                  </div>

                  <div className="font-mono text-[11px] text-slate-500 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-slate-400" />
                    <span>Cited: {f.policySection}</span>
                  </div>

                  <p className="text-slate-700">{f.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Field-by-Field Side-by-Side Review
          </h3>

          <div className="space-y-4">
            {fields.map(field=>{
              const originalVal=String(review.original[field]||"");
              const revisedVal=String(review.revised[field]||"");
              const isChanged=originalVal!==revisedVal;
              const decision=review.fieldDecisions?.[field]||"pending";

              return (
                <div 
                  key={field} 
                  className={`border rounded-xl p-4 transition ${
                    isChanged ? "border-indigo-200 bg-indigo-50/20" : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">{field}</span>
                      {isChanged&&(
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                          Remediation Proposed
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize border ${
                        decision==="approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        decision==="rejected" ? "bg-rose-50 text-rose-700 border-rose-200" :
                        decision==="custom" ? "bg-purple-50 text-purple-700 border-purple-200" :
                        "bg-slate-100 text-slate-600 border-slate-200"
                      }`}>
                        {decision}
                      </span>

                      <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                        <button
                          type="button"
                          onClick={()=>handleFieldAction(field, "approved")}
                          className={`p-1.5 rounded-md transition ${decision==="approved" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-emerald-600"}`}
                          title="Accept Proposed Revision"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={()=>setEditingField(editingField===field ? null : field)}
                          className={`p-1.5 rounded-md transition ${editingField===field ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-indigo-600"}`}
                          title="Custom Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={()=>handleFieldAction(field, "rejected")}
                          className={`p-1.5 rounded-md transition ${decision==="rejected" ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-rose-600"}`}
                          title="Reject Revision"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/80">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Original Content
                      </div>
                      <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                        {originalVal}
                      </div>
                    </div>

                    <div className={`p-3.5 rounded-xl border transition ${
                      isChanged ? "border-emerald-200 bg-emerald-50/40" : "border-slate-200 bg-slate-50/40"
                    }`}>
                      <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>Proposed Remediation</span>
                        {editingField===field&&<span className="text-[10px] text-indigo-600">Editing...</span>}
                      </div>

                      {editingField===field ? (
                        <textarea
                          rows={2}
                          value={revisedVal}
                          onChange={e=>handleCustomTextChange(field, e.target.value)}
                          className="w-full p-2 text-xs border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                          autoFocus
                        />
                      ) : (
                        <div className="text-xs text-slate-900 leading-relaxed font-medium whitespace-pre-wrap">
                          {revisedVal}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pb-6">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Reviewer Audit Decision Remarks
          </label>
          <input
            type="text"
            value={notes}
            onChange={e=>setNotes(e.target.value)}
            placeholder="Add comments on why changes were accepted or rejected..."
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
          />
        </div>
      </div>
    </div>
  );
}