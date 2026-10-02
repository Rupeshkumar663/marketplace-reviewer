import fs from "fs";
import path from "path";
import { runDeterministicValidation } from "../services/validator.js";
import { analyzeListingWithAI } from "../services/aiService.js";

let reviewHistory=[];

export async function processSingleListing(req, res){
  try {
    const listing=req.body;
    if(!listing) return res.status(400).json({ error: "Missing listing payload" });

    const existingTitles=reviewHistory.map(r=>r.original.title);
    const deterministicIssues=runDeterministicValidation(listing, existingTitles);
    const aiResult=await analyzeListingWithAI(listing);

    const mergedFindings=[...deterministicIssues, ...aiResult.issues];

    const record={
      id: "rev-"+Math.random().toString(36).substring(2, 8),
      timestamp: new Date().toISOString(),
      original: listing,
      revised: aiResult.revised,
      findings: mergedFindings,
      status: "pending",
      fieldDecisions: {},
      source: aiResult.source,
      notes: ""
    };

    reviewHistory.unshift(record);
    return res.status(200).json({ success: true, data: record });
  } catch(error){
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function processBatchListings(req, res){
  try {
    const batchPath=path.resolve("src/data/sampleBatch.json");
    const raw=fs.readFileSync(batchPath, "utf-8");
    const listings=JSON.parse(raw);

    const processed=[];
    for(const item of listings){
      const existingTitles=reviewHistory.map(r=>r.original.title);
      const detIssues=runDeterministicValidation(item, existingTitles);
      const aiRes=await analyzeListingWithAI(item);

      const record={
        id: "batch-"+Math.random().toString(36).substring(2, 8),
        timestamp: new Date().toISOString(),
        original: item,
        revised: aiRes.revised,
        findings: [...detIssues, ...aiRes.issues],
        status: "pending",
        fieldDecisions: {},
        source: aiRes.source,
        notes: ""
      };

      reviewHistory.unshift(record);
      processed.push(record);
    }

    return res.status(200).json({ success: true, count: processed.length, data: processed });
  } catch(error){
    return res.status(500).json({ success: false, error: error.message });
  }
}

export function getHistory(req, res){
  return res.status(200).json({ success: true, data: reviewHistory });
}

export function updateDecision(req, res){
  const { id }=req.params;
  const { revised, status, fieldDecisions, notes }=req.body;

  const item=reviewHistory.find(r=>r.id===id);
  if(!item){
    return res.status(404).json({ success: false, error: "Record not found" });
  }

  if(revised) item.revised=revised;
  if(status) item.status=status;
  if(fieldDecisions) item.fieldDecisions=fieldDecisions;
  if(notes!==undefined) item.notes=notes;

  return res.status(200).json({ success: true, data: item });
}