import { Save, CheckCircle2, Circle } from 'lucide-react';
import { useState } from 'react';

const tabs = [
    { id: 'explanation', label: 'Explanation' },
    { id: 'quiz', label: 'Quiz' },
    { id: 'notes', label: 'Notes' },
    { id: 'videos', label: 'Videos' },
    { id: 'articles', label: 'Articles' },
];
export default function SubtopicPanel({
    subtopic,
    selectedTab,
    onTabChange,
    noteContent,
    onSaveNote,
}) {
    const [editingNote, setEditingNote] = useState(noteContent);
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveNote = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 300));
        onSaveNote(editingNote);
        setIsSaving(false);
    };

    const renderContent = () => {
        switch (selectedTab) {
            case 'explanation':
                return (
                    <div className="text-slate-300 leading-relaxed">
                        {subtopic.detailedExplanation}
                    </div>
                );
            case 'quiz':
                return (
                    <div className="space-y-4">
                        <p className="text-slate-300">Quiz content for: {subtopic.title}</p>
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-blue-500/20">
                            <p className="text-sm text-slate-400">
                                Quiz questions would be displayed here
                            </p>
                        </div>
                    </div>
                );
            case 'notes':
                return (
                    <div className="space-y-4">
                        <textarea
                            value={editingNote}
                            onChange={e => setEditingNote(e.target.value)}
                            placeholder="Add your notes here..."
                            className="w-full h-80 bg-slate-800/50 border border-blue-500/20 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400/50 resize-none"
                        />
                        <button
                            onClick={handleSaveNote}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            {isSaving ? 'Saving...' : 'Save Notes'}
                        </button>
                    </div>
                );
            case 'videos':
                return (
                    <div className="space-y-4">
                        <p className="text-slate-300">Video resources for: {subtopic.title}</p>
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-blue-500/20">
                            <p className="text-sm text-slate-400">
                                Related videos would be displayed here
                            </p>
                        </div>
                    </div>
                );
            case 'articles':
                return (
                    <div className="space-y-4">
                        <p className="text-slate-300">Article resources for: {subtopic.title}</p>
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-blue-500/20">
                            <p className="text-sm text-slate-400">
                                Related articles would be displayed here
                            </p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="mt-4 bg-gradient-to-br from-slate-900/60 to-purple-900/30 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 border-l-4 border-l-purple-500">
            <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-white">{subtopic.title}</h3>
                    </div>
                    <p className="text-slate-300 text-sm">{subtopic.estimatedTime}</p>
                </div>
            </div>

            <div className="flex gap-2 mb-6 border-b border-blue-500/20 pb-3 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`px-4 py-2 text-sm font-semibold whitespace-nowrap rounded-lg transition-all ${
                            selectedTab === tab.id
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-slate-800/20 rounded-lg p-6 border border-slate-700/30">
                {renderContent()}
            </div>
        </div>
    );
}
