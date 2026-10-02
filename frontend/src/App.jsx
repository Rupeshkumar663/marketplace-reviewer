import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchHistory, submitReview, processBatch, setActiveReview } from "./store/reviewSlice";
import { Navbar } from "./components/Navbar";
import { ListingForm } from "./components/ListingForm";
import { DiffViewer } from "./components/DiffViewer";
import { AuditTable } from "./components/AuditTable";

export default function App(){
  const dispatch=useDispatch();
  const { history, activeReview, isProcessing }=useSelector((state)=>state.review);

  useEffect(()=>{
    dispatch(fetchHistory());
  }, [dispatch]);

  const handleSingleSubmit=(listingData)=>{
    dispatch(submitReview(listingData));
  };

  const handleBatchProcess=()=>{
    dispatch(processBatch());
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <Navbar
        onBatchProcess={handleBatchProcess}
        isProcessing={isProcessing}
        totalReviews={history.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {activeReview ? (
          <DiffViewer review={activeReview} />
        ) : (
          <ListingForm onSubmit={handleSingleSubmit} isProcessing={isProcessing} />
        )}

        <AuditTable
          history={history}
          onInspect={(item)=>dispatch(setActiveReview(item))}
        />
      </main>
    </div>
  );
}