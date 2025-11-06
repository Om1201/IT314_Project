import express from 'express';
import { executeCode } from '../controllers/CodeController.js';
import { validate } from '../middlewares/validate.js';
import { codeExecutionSchema } from '../validators/codeExecutorValidators.js';
import {codeStructureSchema} from '../validators/codeStructureValidator.js';
import { analyse } from '../controllers/CodeController.js';
import userAuth from '../middlewares/userAuth.js';

const router = express.Router();

router.post('/execute', userAuth, validate(codeExecutionSchema), executeCode);
router.post('/analyse',userAuth, validate(codeStructureSchema), analyse);

export default router;