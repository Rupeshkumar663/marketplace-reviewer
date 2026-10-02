import express from "express";
import {
  processSingleListing,
  processBatchListings,
  getHistory,
  updateDecision
} from "../controllers/reviewController.js";

const router=express.Router();

router.post("/review", processSingleListing);
router.post("/batch", processBatchListings);
router.get("/history", getHistory);
router.patch("/review/:id", updateDecision);

export default router;