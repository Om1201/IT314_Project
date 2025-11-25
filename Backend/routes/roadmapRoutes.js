import express from 'express';
import {
    deleteRoadmap,
    generateRoadmap,
    getRoadmapById,
    getUserRoadmaps,
    getNotesForRoadmap,
    saveNote,
    generateQuiz,
    generateSubtopicSummary,
    saveProgress,
    fetchProgress,
    fetchSubtopicExplanation,
    searchRoadmaps,
    togglePinRoadmap,
    downloadNotesByRoadmapId,
    getQuizzes,  // Add this import
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
router.post('/notes/save', userAuth, saveNote);
router.post('/generate-quiz', userAuth, generateQuiz);
router.post('/get-quizzes', userAuth, getQuizzes);
router.post('/save-progress', userAuth, saveProgress);
router.post('/fetch-progress', userAuth, fetchProgress);

router.post('/generate-subtopic-summary', userAuth, generateSubtopicSummary);
router.post('/fetch-subtopic-summary', userAuth, fetchSubtopicExplanation);
router.get('/search', userAuth, searchRoadmaps);
router.post('/toggle-pin', userAuth, togglePinRoadmap);
router.get('/notes/download/:roadmapId', userAuth, downloadNotesByRoadmapId);

export default router;
