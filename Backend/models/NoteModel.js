import mongoose from 'mongoose';
const { Schema } = mongoose;

const noteSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        roadmapId: {
            type: Schema.Types.ObjectId,
            ref: 'Roadmap',
            required: true,
        },
        subtopicId: {
            type: String,
            required: true,
        },
        moduleId: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);


const NoteModel = mongoose.model('Note', noteSchema);
export default NoteModel;
