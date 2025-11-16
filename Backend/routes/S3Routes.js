import express from 'express';
import { loadProjectFiles, saveToS3, deleteS3File, renameS3File, deleteS3Folder, renameS3Folder, updateFile } from '../controllers/S3Controller.js';
import userAuth from '../middlewares/userAuth.js';
import {validate} from '../middlewares/validate.js';
import { renameSchema, saveSchema } from '../validators/ideValidators.js';

const S3Routes = express.Router();

S3Routes.post('/load', userAuth, loadProjectFiles);
S3Routes.post('/save', userAuth, validate(saveSchema), saveToS3);
S3Routes.post('/delete-file', userAuth, deleteS3File);
S3Routes.post('/rename-file', userAuth, validate(renameSchema), renameS3File);
S3Routes.post('/rename-folder', userAuth, validate(renameSchema), renameS3Folder);
S3Routes.post('/delete-folder', userAuth, deleteS3Folder);
S3Routes.post('/file-update', userAuth, updateFile);


export default S3Routes;
