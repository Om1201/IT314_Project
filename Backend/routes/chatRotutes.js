import express from 'express';
import { createChat, getResponse } from '../controllers/ChatController.js';

const chatRoutes = express.Router();

chatRoutes.post('/create-chat', createChat);
chatRoutes.post('/get-response', getResponse);

export default chatRoutes;