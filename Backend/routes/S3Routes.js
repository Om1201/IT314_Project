import express from 'express';
import { loadProjectFiles, saveToS3, deleteS3File, renameS3File } from '../controllers/S3Controller.js';

const S3Routes = express.Router();

S3Routes.post('/load', loadProjectFiles);
S3Routes.post('/save', saveToS3);
S3Routes.post('/delete', deleteS3File);
S3Routes.post('/rename', renameS3File);

export default S3Routes;
