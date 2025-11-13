import { GoogleGenAI } from '@google/genai';
import RoadmapModel from '../models/RoadmapModel.js';
import UserModel from '../models/UserModel.js';
import { getRoadmapPrompt } from '../utils/prompt.js';
import {quizPrompt} from '../utils/prompt.js';
import { getArticles } from '../utils/search.js';
import { getVideos } from '../utils/search.js';
import NoteModel from '../models/NoteModel.js';
import { getSubtopicSummaryPrompt } from '../utils/prompt.js';

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

export const generateQuiz = async (req, res) => {
    try {
        const {roadMapId, chapterId, subtopicId=null } = req.body;
        console.log(req.body);
        if(!roadMapId ||  !chapterId){
            res.status(400).json({ success: false, message: "Invalid request" });
        }
        const roadMap = await RoadmapModel.findById(roadMapId);
        if(!roadMap) {
            return res.status(404).json({ success: false, message: "Roadmap not found" });
        }
        
        const prompt = quizPrompt(roadMap, chapterId, subtopicId);
        const quiz = await generateWithGemini(prompt);

        const cleaned = quiz
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        let quizJson;

        try {
            quizJson = JSON.parse(cleaned);
        } catch (err) {
            console.log("Cleaned Gemini output:", cleaned);
            throw new Error("AI returned invalid JSON");
        }

        console.log("Quiz generated: ", quizJson); 

        return res.status(200).json({ success: true, data: quizJson, message: "Quiz generated successfully" });

    }catch(error) {
        console.log("Error while generating quiz: ", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

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
            const key = `${note.moduleId}:${note.subtopicId}`;
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
        const { roadmapId, subtopicId, moduleId, content } = req.body;
        const userId = req.userId;

        const updatedNote = await NoteModel.findOneAndUpdate(
            { userId, roadmapId, subtopicId, moduleId },
            { userId, roadmapId, subtopicId, moduleId, content },
            { new: true, upsert: true }
        );

        return res.status(200).json({ success: true, data: updatedNote, message: 'Note saved' });
    } catch (error) {
        console.error('Error saving note:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const generateSubtopicSummary = async (req, res) => {
  try {

    const { roadmapId, subtopicId, chapterId } = req.body;

    if (!roadmapId || !subtopicId || !chapterId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide roadmapId, subtopicId, and chapterId.',
      });
    }

    const roadmap = await RoadmapModel.findById(roadmapId);

    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }

    const roadmapTitle = roadmap.roadmapData.title;
    const chapterIdNum = parseInt(chapterId);
    const subtopicIdNum = parseInt(subtopicId);
    
    console.log('Looking for chapter:', chapterIdNum, 'Available chapters:', roadmap.roadmapData.chapters.map(ch => ch.id));
    
    const chapter = roadmap.roadmapData.chapters.find(ch => ch.id === chapterIdNum);
    
    if (!chapter) {
      return res.status(404).json({ 
        success: false, 
        message: 'Chapter not found',
        availableChapters: roadmap.roadmapData.chapters.map(ch => ({ id: ch.id, title: ch.title }))
      });
    }
    
    const chapterTitle = chapter.title;
    const subtopic = chapter.subtopics.find(st => st.id === subtopicIdNum);

    if (!subtopic) {
      return res.status(404).json({ success: false, message: 'Subtopic not found' });
    }

    const prompt = getSubtopicSummaryPrompt(subtopic.title, roadmapTitle, chapterTitle);
    const summaryText = await generateWithGemini(prompt);
    subtopic.detailedExplanation = summaryText;
    
    roadmap.markModified('roadmapData');
    await roadmap.save();

    return res.status(200).json({
      success: true,
      summary: summaryText,
      roadmapId: roadmapId,
      chapterId: chapterId,
      subtopicId: subtopicId,
      message: 'Subtopic summary generated and saved successfully',
    });

  } catch (error) {
    console.error('Error in generateSubtopicSummary:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};