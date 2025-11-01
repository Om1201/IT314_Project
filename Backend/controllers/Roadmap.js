import { GoogleGenAI } from '@google/genai';
import RoadmapModel from '../models/RoadmapModel.js';
import UserModel from '../models/UserModel.js';
import { getRoadmapPrompt } from '../utils/prompt.js';
import { getArticles } from '../utils/search.js';
import { getVideos } from '../utils/search.js';
import NoteModel from '../models/NoteModel.js';

const genAI = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

export const geminiModel = genAI.models.generateContent.bind(genAI.models);

export async function generateWithGemini(prompt, model = 'gemini-2.0-flash-001') {
    try {
        const response = await genAI.models.generateContent({
            model,
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw new Error('Failed to generate content with Gemini');
    }
}

export const generateRoadmap = async (req, res) => {
    try {
        const { userDescription, userLevel } = req.validatedData;
        const userId = req.userId;

        const initTime = new Date().toLocaleString();
        console.log(
            `Generating roadmap for userDescription: ${userDescription}, userLevel: ${userLevel} - ${initTime}`
        );

        // Use the utility function and incorporate userLevel into the prompt
        const basePrompt = getRoadmapPrompt(userDescription);
        const prompt = `${basePrompt}\n\nAdditionally, tailor the roadmap for a ${userLevel} level learner. Adjust the difficulty, depth, and pace accordingly.`;

        const responseText = await generateWithGemini(prompt);
        console.log('Response size:', responseText.length);

        // Parse the JSON response
        let roadmapData;
        try {
            const cleanedText = responseText
                .trim()
                .replace(/^```json\s*|\s*```$/g, '')
                .trim();
            roadmapData = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            return res.status(500).json({
                success: false,
                message: 'Failed to parse roadmap response. The AI response was not valid JSON.',
            });
        }

        console.log(`Fetching articles... ${new Date().toLocaleString()}`);
        const articles = await getArticles(roadmapData);
        roadmapData.articles = articles;

        console.log(`Fetching videos... ${new Date().toLocaleString()}`);
        const videos = await getVideos(roadmapData);
        roadmapData.videos = videos;

        // Save to database
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const newRoadmap = new RoadmapModel({
            email: user.email,
            roadmapData: roadmapData,
        });
        await newRoadmap.save();

        console.log('Roadmap generated successfully');
        const endTime = new Date().toLocaleString();
        console.log(`Total time: ${endTime} - ${initTime}`);

        return res.status(200).json({
            success: true,
            data: newRoadmap,
            message: 'Roadmap generated successfully',
        });
    } catch (error) {
        console.error('Error in generateRoadmap:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserRoadmaps = async (req, res) => {
    try {
        const { email } = req;
        const roadmaps = await RoadmapModel.find({ email }).sort({ createdAt: -1 });

        return res
            .status(200)
            .json({ success: true, data: roadmaps, message: 'Roadmaps fetched successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteRoadmap = async (req, res) => {
    try {
        const { roadmapId } = req.body;
        console.log('Deleting roadmap with ID:', roadmapId);

        const roadmap = await RoadmapModel.findOne({ _id: roadmapId });

        if (!roadmap) {
            return res.status(404).json({ success: false, message: 'Roadmap not found' });
        }

        await RoadmapModel.deleteOne({ _id: roadmapId });

        return res.status(200).json({ success: true, message: 'Roadmap deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getRoadmapById = async (req, res) => {
    try {
        const { roadmapId } = req.body;

        const roadmap = await RoadmapModel.findOne({ _id: roadmapId });

        if (!roadmap) {
            return res.status(404).json({ success: false, message: 'Roadmap not found' });
        }

        return res
            .status(200)
            .json({ success: true, data: roadmap, message: 'Roadmap fetched successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getNotesForRoadmap = async (req, res) => {
    try {
        const { roadmapId } = req.params;
        const userId = req.userId;

        const notes = await NoteModel.find({ userId, roadmapId });

        const notesMap = notes.reduce((acc, note) => {
            const key = `${note.contextType}:${note.contextId}`;
            acc[key] = note.content;
            return acc;
        }, {});

        return res.status(200).json({ success: true, data: notesMap });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const saveNote = async (req, res) => {
    try {
        const { roadmapId, contextId, contextType, content } = req.body;
        const userId = req.userId;

        const updatedNote = await NoteModel.findOneAndUpdate(
            { userId, roadmapId, contextId, contextType },
            { userId, roadmapId, contextId, contextType, content },
            { new: true, upsert: true }
        );

        return res.status(200).json({ success: true, data: updatedNote, message: 'Note saved' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
