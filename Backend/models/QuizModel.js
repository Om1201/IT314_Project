import mongoose from "mongoose";

const quizeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    roadmapId: {
        type: String,
        required: true,
    },
    chapterId: {
        type: String,
        required: true,
    },
    subtopicId: {
        type: String,
        required: true,
    },
    quiz: {
        type: Object,
        required: true,
    }
})

const QuizModel = mongoose.model("Quiz", quizeSchema);
export default QuizModel;