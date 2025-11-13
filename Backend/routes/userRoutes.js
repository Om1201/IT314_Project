import express from "express";
import { getProfile, getStats, getUserRoadmaps, changePassword } from "../controllers/UserController.js";
import userAuth from "../middlewares/userAuth.js";

const router = express.Router();

router.get("/profile", userAuth, getProfile);
router.get("/stats", userAuth, getStats);
router.get("/roadmaps", userAuth, getUserRoadmaps);
router.post("/change-password", userAuth, changePassword);

export default router;
