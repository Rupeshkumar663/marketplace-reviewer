import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE="http://localhost:5000/api";

export const fetchHistory=createAsyncThunk("review/fetchHistory", async ()=>{
  const res=await fetch(`${API_BASE}/history`);
  const json=await res.json();
  return json.data||[];
});

export const submitReview=createAsyncThunk("review/submitReview", async (listingData)=>{
  const res=await fetch(`${API_BASE}/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(listingData)
  });
  const json=await res.json();
  return json.data;
});

export const processBatch=createAsyncThunk("review/processBatch", async ()=>{
  const res=await fetch(`${API_BASE}/batch`, { method: "POST" });
  const json=await res.json();
  return json.data||[];
});

export const saveDecision=createAsyncThunk(
  "review/saveDecision",
  async ({ id, updatePayload })=>{
    const res=await fetch(`${API_BASE}/review/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatePayload)
    });
    const json=await res.json();
    return json.data;
  }
);

const reviewSlice=createSlice({
  name: "review",
  initialState: {
    history: [],
    activeReview: null,
    isProcessing: false,
    error: null
  },
  reducers: {
    setActiveReview: (state, action)=>{
      state.activeReview=action.payload;
    },
    clearActiveReview: (state)=>{
      state.activeReview=null;
    },
    updateActiveFieldDecision: (state, action)=>{
      const { field, decision, value }=action.payload;
      if(!state.activeReview) return;

      state.activeReview.fieldDecisions[field]=decision;
      if(decision==="rejected"){
        state.activeReview.revised[field]=state.activeReview.original[field];
      } else if(value!==undefined){
        state.activeReview.revised[field]=value;
      }
    }
  },
  extraReducers: (builder)=>{
    builder
      .addCase(fetchHistory.fulfilled, (state, action)=>{
        state.history=action.payload;
      })
      .addCase(submitReview.pending, (state)=>{
        state.isProcessing=true;
        state.error=null;
      })
      .addCase(submitReview.fulfilled, (state, action)=>{
        state.isProcessing=false;
        state.activeReview=action.payload;
        state.history.unshift(action.payload);
      })
      .addCase(submitReview.rejected, (state, action)=>{
        state.isProcessing=false;
        state.error=action.error.message;
      })
      .addCase(processBatch.pending, (state)=>{
        state.isProcessing=true;
      })
      .addCase(processBatch.fulfilled, (state, action)=>{
        state.isProcessing=false;
        state.history=[...action.payload, ...state.history];
        if(action.payload.length>0){
          state.activeReview=action.payload[0];
        }
      })
      .addCase(saveDecision.fulfilled, (state, action)=>{
        const idx=state.history.findIndex(item=>item.id===action.payload.id);
        if(idx!==-1) state.history[idx]=action.payload;
        state.activeReview=null;
      });
  }
});

export const { setActiveReview, clearActiveReview, updateActiveFieldDecision }=reviewSlice.actions;
export default reviewSlice.reducer;