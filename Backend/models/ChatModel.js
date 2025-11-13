import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    roadmapId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Roadmap" 
    },
    moduleId: {
        type: String,
    },
    title: {
        type: String,
        required: true
    },
    messages: {
        type: Array,
        default: []
    }
}, { timestamps: true })

const ChatModel = mongoose.model("Chat", ChatSchema);
export default ChatModel;