import React, { useState } from "react";
import { Sparkles, RefreshCw, AlertCircle } from "lucide-react";

export function ListingForm({ onSubmit, isProcessing }){
  const [formData, setFormData]=useState({
    title: "SUPER SLIM CASE 100% UNBEATABLE PROTECTION EVER",
    description: "This phone case is the world's best miracle cure for drops. Guaranteed to never break under any pressure.",
    category: "Electronics",
    price: "19.99",
    seller: "Apex Gadgets"
  });

  const loadPreset=(preset)=>{
    if(preset==="violations"){
      setFormData({
        title: "SUPER SLIM CASE 100% UNBEATABLE PROTECTION EVER",
        description: "This phone case is the world's best miracle cure for drops. Guaranteed to never break under any pressure.",
        category: "Electronics",
        price: "-12.00",
        seller: "Apex Gadgets"
      });
    } else if(preset==="clean"){
      setFormData({
        title: "Ergonomic Memory Foam Lumbar Support Cushion",
        description: "High-density ventilated memory foam cushion designed to support lower back posture in office chairs.",
        category: "Home & Kitchen",
        price: "29.99",
        seller: "PostureCraft Co."
      });
    }
  };

  const handleChange=(e)=>{
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit=(e)=>{
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Listing Submission & Inspection</h2>
          <p className="text-xs text-slate-500">Provide product data for deterministic and AI policy compliance checks.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Test Presets:</span>
          <button
            type="button"
            onClick={()=>loadPreset("violations")}
            className="text-xs font-medium px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 transition border border-rose-200/50"
          >
            Violations Preset
          </button>
          <button
            type="button"
            onClick={()=>loadPreset("clean")}
            className="text-xs font-medium px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition border border-emerald-200/50"
          >
            Clean Preset
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-8">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Product Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              required
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            >
              <option>Electronics</option>
              <option>Home & Kitchen</option>
              <option>Fashion & Apparel</option>
              <option>Beauty & Personal Care</option>
              <option>Books & Stationery</option>
              <option>Sports & Fitness</option>
              <option>Unauthorized Generic</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-8">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition resize-none"
              required
            />
          </div>

          <div className="md:col-span-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Price ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Seller Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="seller"
                value={formData.seller}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Deterministic checks run instantly before LLM semantic analysis.</span>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition shadow-sm shadow-indigo-100 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Running Checks...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Run Policy Review</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}