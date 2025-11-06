import ChatModel from "../models/ChatModel.js";
import { generateWithGemini } from "../utils/generate.js";
import { getTitlePrompt } from "../utils/prompt.js";


export const createChat = async (req, res) => {
    try {
        const { email, roadmapId, moduleId, userMessage } = req.body;

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
            messages: [{ role: "user", content: userMessage }]
        });
        newChat.messages.push({ role: "ai", content: JSON.stringify(json_rsp) });
        await newChat.save();
        console.log("Generated Chat Title JSON:", json_rsp);
        res.status(201).json({ message: "Chat created successfully", data: json_rsp });
        
    } catch (error) {
        res.status(500).json({ message: "Error creating chat", error });
    }
};

export const getResponse = async (req, res) => {
    try {
        const { email, roadmapId, moduleId, userMessage } = req.body;
        const response = await generateWithGemini(userMessage);

        const chat = await ChatModel.findOne({ email, roadmapId, moduleId });
        if(!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        chat.messages.push({ role: "user", content: userMessage });
        chat.messages.push({ role: "ai", content: response });
        await chat.save();

        res.status(200).json({ message: "AI response generated", data: response });
    } catch (error) {
        res.status(500).json({ message: "Error generating AI response", error });
    }
}
