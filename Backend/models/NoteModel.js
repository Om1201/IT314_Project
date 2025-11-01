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
        contextId: {
            type: String,
            required: true,
        },
        contextType: {
            type: String,
            enum: ['chapter', 'subtopic'],
            required: true,
        },
        content: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

noteSchema.index({ userId: 1, roadmapId: 1, contextType: 1, contextId: 1 }, { unique: true });

const NoteModel = mongoose.model('Note', noteSchema);
export default NoteModel;
