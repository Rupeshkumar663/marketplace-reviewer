import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();

const app=express();
const PORT=process.env.PORT||5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res)=>{
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.use("/api", reviewRoutes);

app.listen(PORT, ()=>{
  console.log(`Backend running on http://localhost:${PORT}`);
});