import express from "express";
import { generateRoadmap } from "../controllers/Roadmap.js";

const router = express.Router();

// Generate a roadmap based on user description and level
// POST /api/roadmap/generate
router.post('/generate', generateRoadmap);

export default router;
