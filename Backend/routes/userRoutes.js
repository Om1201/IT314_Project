import express from "express";
import { getProfile, getStats, getUserRoadmaps, changePassword, updateProfile, uploadAvatar, getAllNotes, purgeUserData } from "../controllers/UserController.js";
import userAuth from "../middlewares/userAuth.js";

const router = express.Router();

router.get("/profile", userAuth, getProfile);
router.get("/stats", userAuth, getStats);
router.get("/roadmaps", userAuth, getUserRoadmaps);
router.post("/change-password", userAuth, changePassword);
router.put("/profile", userAuth, updateProfile);
router.post("/avatar", userAuth, uploadAvatar);
router.get('/notes', userAuth, getAllNotes);
router.post('/purge', userAuth, purgeUserData);

export default router;
