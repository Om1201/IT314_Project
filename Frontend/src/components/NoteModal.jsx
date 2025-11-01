import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { saveNote, updateNoteInState } from '../features/roadmapSlicer';
import { X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NoteModal({
    roadmapId,
    contextId,
    contextType,
    title,
    initialContent,
    onClose,
}) {
    const dispatch = useDispatch();
    const [content, setContent] = useState(initialContent || '');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setContent(initialContent || '');
    }, [initialContent, contextId]);

    const handleSave = async () => {
        setIsSaving(true);
        // Save to backend
        const result = await dispatch(
            saveNote({
                roadmapId,
                contextId,
                contextType,
                content,
            })
        );

        if (saveNote.fulfilled.match(result)) {
            toast.success('Note saved!');
        } else {
            toast.error('Failed to save note.');
        }

        setIsSaving(false);
        onClose();
    };

    const handleLocalChange = e => {
        setContent(e.target.value);
        dispatch(updateNoteInState({ contextId, contextType, content: e.target.value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 border border-blue-500/30 rounded-2xl p-6 max-w-2xl w-full shadow-2xl shadow-blue-500/20">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">
                        Notes for: <span className="text-blue-300">{title}</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <textarea
                    value={content}
                    onChange={handleLocalChange}
                    placeholder="Write your notes here..."
                    className="w-full h-64 bg-slate-950/50 border border-slate-700 rounded-lg p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg font-semibold text-white shadow-lg shadow-blue-900/30 transition-all duration-300 flex items-center gap-2"
                    >
                        {isSaving ? (
                            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                        ) : (
                            <Save className="h-5 w-5" />
                        )}
                        {isSaving ? 'Saving...' : 'Save and Close'}
                    </button>
                </div>
            </div>
        </div>
    );
}
