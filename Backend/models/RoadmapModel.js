import mongoose from 'mongoose';

const RoadmapSchema = new mongoose.Schema({
    email: { type: String, required: true },
    isPinned: {type: Boolean, default: false},
    roadmapData: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now },
});

const RoadmapModel = mongoose.model('Roadmap', RoadmapSchema);
export default RoadmapModel;
