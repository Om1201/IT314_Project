import express from 'express';
import { generateRoadmap } from '../controllers/Roadmap.js';
import userAuth from '../middlewares/userAuth.js';
import { validate } from '../middlewares/validate.js';
import { generationSchema } from '../validators/roadmapValidators.js';

const router = express.Router();

router.post('/generate', validate(generationSchema), userAuth, generateRoadmap);

export default router;
