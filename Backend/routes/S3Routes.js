import express from 'express';
import { loadProjectFiles, saveToS3, deleteS3File, renameS3File, deleteS3Folder, renameS3Folder } from '../controllers/S3Controller.js';

const S3Routes = express.Router();

S3Routes.post('/load', loadProjectFiles);
S3Routes.post('/save', saveToS3);
S3Routes.post('/delete-file', deleteS3File);
S3Routes.post('/rename-file', renameS3File);
S3Routes.post('/rename-folder', renameS3Folder);
S3Routes.post('/delete-folder', deleteS3Folder);


export default S3Routes;
