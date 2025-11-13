import ChatModel from "../models/ChatModel.js";
import { generateWithGemini } from "../utils/generate.js";
import { getResponsePrompt, getTitlePrompt } from "../utils/prompt.js";


export const createChat = async (req, res) => {
    try {
        const {email} = req
        const { roadmapId, moduleId, userMessage } = req.body;

        const response = await generateWithGemini(getTitlePrompt(userMessage));
        let json_rsp;
        try {
            const cleanedText = response
                .trim()
                .replace(/^```json\s*|\s*```$/g, '')
                .trim();
            json_rsp = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            return res.status(500).json({
                success: false,
                message: 'Failed to parse roadmap response. The AI response was not valid JSON.',
            });
        }

        const newChat = new ChatModel({
            email,
            roadmapId,
            moduleId,
            title: json_rsp.title,
            messages: [{ role: "user", content: userMessage, time: Date.now() }],
        });
        newChat.messages.push({ role: "ai", content:json_rsp.response, time: Date.now() });
        await newChat.save();
        res.status(201).json({ message: "Chat created successfully", data: json_rsp, chatId: newChat._id });
        
    } catch (error) {
        res.status(500).json({ message: "Error creating chat", error });
    }
};

export const getResponse = async (req, res) => {
    try {
        const { chatId, userMessage } = req.body;
        const chat = await ChatModel.findOne({ _id: chatId });
        
        if(!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        const context = chat.messages.slice(-8).map(m => `${m.role}: ${m.content}`).join("\n");

        const response = await generateWithGemini(getResponsePrompt(userMessage, context));

        chat.messages.push({ role: "user", content: userMessage, time: Date.now() });
        chat.messages.push({ role: "ai", content: response, time: Date.now() });
        await chat.save();

        res.status(200).json({ message: "AI response generated", data: response });
    } catch (error) {
        res.status(500).json({ message: "Error generating AI response", error });
    }
}


export const getChats = async (req, res) => {
    try {
        const { email } = req;
        const { roadmapId, moduleId } = req.body;
        const chats = await ChatModel.find({ email, roadmapId, moduleId });
        res.status(200).json({ message: "Chats retrieved successfully", data: chats });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving chats", error });
    }
};

export const getChat = async (req, res) => {
    try {
        const { chatId } = req.body;
        const chat = await ChatModel.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        res.status(200).json({ message: "Chat retrieved successfully", data: chat });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving chat", error });
    }   
};

export const deleteChat = async (req, res) => {
    try {
        const { chatId } = req.body;
        const chat = await ChatModel.findByIdAndDelete(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        res.status(200).json({ message: "Chat deleted successfully", data: chat });
    } catch (error) {
        res.status(500).json({ message: "Error deleting chat", error });
    }
};

export const renameChat = async (req, res) => {
    try {
        const { chatId, newTitle } = req.body;
        const chat = await ChatModel.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        chat.title = newTitle;
        await chat.save();
        res.status(200).json({ message: "Chat renamed successfully", data: chat });
    } catch (error) {
        res.status(500).json({ message: "Error renaming chat", error });
    }
};
