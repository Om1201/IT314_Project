import RoadmapModel from '../models/RoadmapModel.js';
import UserModel from '../models/UserModel.js';
import { getRoadmapPrompt } from '../utils/prompt.js';
import {quizPrompt} from '../utils/prompt.js';
import { getArticles } from '../utils/search.js';
import { getVideos } from '../utils/search.js';
import NoteModel from '../models/NoteModel.js';
import { getSubtopicSummaryPrompt, getTopicGuardPrompt} from '../utils/prompt.js';
import { generateWithGemini } from '../utils/generate.js';

export const generateRoadmap = async (req, res) => {
    try {
        const { userDescription, userLevel } = req.validatedData;
        const userId = req.userId;

        
        console.log(`Validating topic: ${userDescription}`);
        const guardPrompt = getTopicGuardPrompt(userDescription);
        const validationResponse = await generateWithGemini(guardPrompt);
        const isValid = validationResponse.trim().toLowerCase() === 'true';

        if (!isValid) {
            console.warn(`Invalid topic rejected: ${userDescription}`);
            return res.status(400).json({
                success: false,
                message: 'The requested topic does not seem to be related to programming or technology.',
            });
        }
        

        const initTime = new Date().toLocaleString();
        console.log(
            `Generating roadmap for userDescription: ${userDescription}, userLevel: ${userLevel} - ${initTime}`
        );

        const basePrompt = getRoadmapPrompt(userDescription);
        const prompt = `${basePrompt}\n\nAdditionally, tailor the roadmap for a ${userLevel} level learner. Adjust the difficulty, depth, and pace accordingly.`;

        const responseText = await generateWithGemini(prompt);
        console.log('Response size:', responseText.length);

   
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
        // const articles = await getArticles(roadmapData);
        const articles = [];
        roadmapData.articles = articles;

        console.log(`Fetching videos... ${new Date().toLocaleString()}`);
        // const videos = await getVideos(roadmapData);
        const videos = [];
        roadmapData.videos = videos;

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const newRoadmap = new RoadmapModel({
            email: user.email,
            roadmapData: roadmapData,
            roadmapPhoto: Math.floor(Math.random() * 5) + 1,
        });
        await newRoadmap.save();

        console.log('Roadmap generated successfully');
        const endTime = new Date().toLocaleString();
        console.log("total time ", new Date(endTime) - new Date(initTime));

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
        const roadmaps = await RoadmapModel.find({ email })
            .sort({ isPinned: -1, createdAt: -1 });  // Sort by pinned first, then by creation date

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
        await NoteModel.deleteMany({ roadmapId: roadmapId });
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

        const { roadmapId, subtopicId, chapterId , personalization } = req.body;

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
        if(chapterIdNum > roadmap.roadmapData.chapters.length){
            return res.status(404).json({ success: false, message: 'Chapter not found' });
        }
        if(subtopicIdNum > roadmap.roadmapData.chapters[chapterIdNum - 1].subtopics.length){
            return res.status(404).json({ success: false, message: 'Subtopic not found' });
        }

        const chapterTitle = roadmap.roadmapData.chapters[chapterIdNum - 1].title;
        const subtopicTitle = roadmap.roadmapData.chapters[chapterIdNum - 1].subtopics[subtopicIdNum - 1].title;
    const prompt = getSubtopicSummaryPrompt(subtopicTitle, roadmapTitle, chapterTitle, personalization);
    const summaryText = await generateWithGemini(prompt);


        roadmap.roadmapData.chapters[chapterIdNum - 1].subtopics[subtopicIdNum - 1].detailedExplanation = summaryText;

        roadmap.markModified('roadmapData');
        await roadmap.save();

        return res.status(200).json({
            success: true,
            summary: summaryText,
            message: 'Subtopic summary generated and saved successfully',
        });

    } catch (error) {
        console.error('Error in generateSubtopicSummary:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const saveProgress = async (req, res) => {
    try {
        const { roadmapId, chapterId, subtopicId } = req.body;

        const roadmap = await RoadmapModel.findOne({ _id: roadmapId })
        const roadmapData = roadmap.roadmapData;
        const no_of_chapters = roadmapData.chapters.length;
        if(no_of_chapters < chapterId){
            return res.status(400).json({ success: false, message: 'Invalid chapterId' });
        }
        const no_of_subtopics = roadmapData.chapters[chapterId - 1].subtopics.length;
        if(no_of_subtopics < subtopicId){
            return res.status(400).json({ success: false, message: 'Invalid subtopicId' });
        }
        console.log("Current completion status:", roadmapData.chapters[chapterId - 1].subtopics[subtopicId - 1].completed)
        const current = roadmapData.chapters[chapterId - 1].subtopics[subtopicId - 1].completed;
        roadmapData.chapters[chapterId - 1].subtopics[subtopicId - 1].completed = !current;
        roadmap.markModified('roadmapData');
        await roadmap.save();

        return res.status(200).json({ success: true, data: roadmap, message: 'Progress saved successfully' });
    } catch (error) {
        console.error('Error saving progress:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const fetchProgress = async (req, res) => {
    try {
        const { roadmapId } = req.body;

        const roadmap = await RoadmapModel.findOne({ _id: roadmapId });
        const progressData = new Set();
        for (const chapter of roadmap.roadmapData.chapters) {
            for (const subtopic of chapter.subtopics) {
                if (subtopic.completed) {
                    progressData.add(`${chapter.id}:${subtopic.id}`);
                }
            }
        }
        console.log("Fetched progress data:", progressData);
        return res.status(200).json({ success: true, data: Array.from(progressData) });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const fetchSubtopicExplanation = async (req, res) => {
    try {
        const { roadmapId } = req.body;
        const roadmap = await RoadmapModel.findOne({ _id: roadmapId });

        const subtopicExplanation = {};
        for (const chapter of roadmap.roadmapData.chapters) {
            for (const subtopic of chapter.subtopics) {
                subtopicExplanation[`${chapter.id}:${subtopic.id}`] = subtopic.detailedExplanation || '';
            }
        }
        return res.status(200).json({ success: true, data: subtopicExplanation });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const searchRoadmaps = async (req, res) => {
    try {
        const q = (req.query.q || '').toString().trim();
        const page = Math.max(1, parseInt(req.query.page || '1', 10));
        const pageSize = Math.min(25, Math.max(5, parseInt(req.query.pageSize || '10', 10)));

        if (!q) {
            return res.status(400).json({ success: false, message: 'Query cannot be empty' });
        }

        const email = req.email;
        const userId = req.userId;

        // Fetch user's roadmaps
        const roadmaps = await RoadmapModel.find({ email }).select({ roadmapData: 1 }).lean();

        const term = q.toLowerCase();
        const results = {
            roadmaps: [],
            chapters: [],
            subtopics: [],
            notes: [],
        };

        for (const r of roadmaps) {
            const rm = r.roadmapData || {};
            const roadmapId = r._id;
            const roadmapTitle = (rm.title || '').toString();
            if (roadmapTitle.toLowerCase().includes(term)) {
                results.roadmaps.push({ roadmapId, title: roadmapTitle });
            }

            const chapters = Array.isArray(rm.chapters) ? rm.chapters : [];
            for (const ch of chapters) {
                const chTitle = (ch.title || '').toString();
                const chId = ch.id;
                if (chTitle.toLowerCase().includes(term)) {
                    results.chapters.push({
                        roadmapId,
                        title: chTitle,
                        chapterId: chId,
                        roadmapTitle,
                    });
                }
                const subs = Array.isArray(ch.subtopics) ? ch.subtopics : [];
                for (const st of subs) {
                    const stTitle = (st.title || '').toString();
                    if (stTitle.toLowerCase().includes(term)) {
                        results.subtopics.push({
                            roadmapId,
                            title: stTitle,
                            chapterId: ch.id,
                            subtopicId: st.id,
                            roadmapTitle,
                            chapterTitle: chTitle,
                        });
                    }
                }
            }
        }


        const noteMatches = await NoteModel.find({
            userId,
            content: { $regex: q, $options: 'i' },
        })
            .select({ roadmapId: 1, moduleId: 1, subtopicId: 1, content: 1 })
            .lean();

        const makeSnippet = (content, term) => {
            if (!content) return '';
            const idx = content.toLowerCase().indexOf(term);
            if (idx === -1) return content.slice(0, 120);
            const start = Math.max(0, idx - 40);
            const end = Math.min(content.length, idx + term.length + 40);
            const prefix = start > 0 ? '…' : '';
            const suffix = end < content.length ? '…' : '';
            return prefix + content.slice(start, end) + suffix;
        };

        for (const n of noteMatches) {
            results.notes.push({
                roadmapId: n.roadmapId,
                moduleId: n.moduleId,
                subtopicId: n.subtopicId,
                snippet: makeSnippet(n.content || '', term),
            });
        }

        // Simple pagination on combined items: return counts for each group and per-group page slices
        const paginate = arr => ({
            total: arr.length,
            items: arr.slice((page - 1) * pageSize, page * pageSize),
        });

        return res.status(200).json({
            success: true,
            data: {
                query: q,
                page,
                pageSize,
                roadmaps: paginate(results.roadmaps),
                chapters: paginate(results.chapters),
                subtopics: paginate(results.subtopics),
                notes: paginate(results.notes),
            },
        });
    } catch (error) {
        console.error('Error in searchRoadmaps:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const togglePinRoadmap = async (req, res) => {
    try {
        const { roadmapId } = req.body;
        const { email } = req;

        const roadmap = await RoadmapModel.findOne({ _id: roadmapId, email });

        if (!roadmap) {
            return res.status(404).json({ success: false, message: 'Roadmap not found' });
        }

        roadmap.isPinned = !roadmap.isPinned;
        await roadmap.save();

        return res.status(200).json({
            success: true,
            data: roadmap,
            message: `Roadmap ${roadmap.isPinned ? 'pinned' : 'unpinned'} successfully`
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};