import { configureStore } from "@reduxjs/toolkit";
import reviewReducer from "./reviewSlice.js";

export const store=configureStore({
  reducer: {
    review: reviewReducer
  }
});