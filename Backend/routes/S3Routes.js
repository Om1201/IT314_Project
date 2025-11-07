import express from 'express';
import { createFolder, fetchS3Folder, saveToS3 } from '../controllers/S3Controller.js';

const S3Routes = express.Router();

S3Routes.post('/save-file', saveToS3);
S3Routes.post('/fetch-folder', fetchS3Folder);

export default S3Routes;
