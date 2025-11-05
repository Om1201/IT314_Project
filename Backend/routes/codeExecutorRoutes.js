import express from 'express';
import { executeCode } from '../controllers/CodeExecutor.js';
import { validate } from '../middlewares/validate.js';
import { codeExecutionSchema } from '../validators/codeExecutorValidators.js';
import userAuth from '../middlewares/userAuth.js';

const router = express.Router();

router.post('/execute', userAuth, validate(codeExecutionSchema), executeCode);

export default router;
