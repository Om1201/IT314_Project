import express from 'express';
import { createChat, deleteChat, getChat, getChats, getResponse, renameChat } from '../controllers/ChatController.js';
import userAuth from "../middlewares/userAuth.js"
const chatRoutes = express.Router();

chatRoutes.post('/create-chat', userAuth, createChat);
chatRoutes.post('/get-response', userAuth, getResponse);
chatRoutes.post('/get-chats', userAuth, getChats);
chatRoutes.post('/get-chat', userAuth, getChat);
chatRoutes.post('/delete-chat', userAuth, deleteChat);
chatRoutes.post('/rename-chat', userAuth, renameChat);

export default chatRoutes;