import express from 'express';
import {
    deleteRoadmap,
    generateRoadmap,
    getRoadmapById,
    getUserRoadmaps,
    getNotesForRoadmap,
    saveNote,
} from '../controllers/Roadmap.js';
import userAuth from '../middlewares/userAuth.js';
import { validate } from '../middlewares/validate.js';
import { generationSchema } from '../validators/roadmapValidators.js';

const router = express.Router();

router.post('/generate', validate(generationSchema), userAuth, generateRoadmap);
router.get('/get-roadmaps', userAuth, getUserRoadmaps);
router.post('/delete-roadmap', userAuth, deleteRoadmap);
router.post('/get-roadmap-by-id', userAuth, getRoadmapById);

router.get('/notes/:roadmapId', userAuth, getNotesForRoadmap);
// Save/update a single note
router.post('/notes/save', userAuth, saveNote);
export default router;
