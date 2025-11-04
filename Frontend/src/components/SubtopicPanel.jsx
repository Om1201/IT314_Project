import { Save, CheckCircle2, Circle } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';
import MarkdownRenderer from './MarkdownRenderer';

const tabs = [
    { id: 'explanation', label: 'Explanation' },
    { id: 'quiz', label: 'Quiz' },
    { id: 'notes', label: 'Notes' },
    { id: 'videos', label: 'Videos' },
    { id: 'articles', label: 'Articles' },
];

export default function SubtopicPanel({
    subtopic,
    chapterId,
    allArticles,
    allVideos,
    selectedTab,
    onTabChange,
    noteContent,
    explanationContent,
    onSaveNote,
    onRequestExplanation,
}) {
    const [editingNote, setEditingNote] = useState(noteContent || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const editorRef = useRef(null);

    useEffect(() => {
        setEditingNote(noteContent || '');
    }, [noteContent]);

    useEffect(() => {
        const onKey = e => {
            if (e.ctrlKey && e.key.toLowerCase() === 's') {
                if (isFocused) {
                    e.preventDefault();
                    handleSaveNote();
                }
            }
            if (e.key === 'Escape') {
                if (isFocused) {
                    e.preventDefault();
                    setIsFocused(false);
                }
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isFocused, editingNote]);

    const handleSaveNote = async () => {
        setIsSaving(true);
        try {
            await onSaveNote(editingNote);
        } catch (err) {
            console.error('Save note failed', err);
        }
        setIsSaving(false);
    };

    const renderContent = () => {
        console.log('Looking for articles/videos:', { chapterId, subtopicId: subtopic.id });
        console.log('Available articles:', allArticles);
        console.log('Available videos:', allVideos);

        const articleSet = allArticles?.find(
            a => a.chapterId === chapterId && a.subtopicId === subtopic.id
        );
        const articles = articleSet ? articleSet.articles : [];

        const videoSet = allVideos?.find(
            v => v.chapterId === chapterId && v.subtopicId === subtopic.id
        );
        const videos = videoSet ? videoSet.videos : [];

        console.log('Found articles:', articles);
        console.log('Found videos:', videos);

        switch (selectedTab) {
            case 'explanation':
                return (
                    <div className="text-slate-300 leading-relaxed">
                        {explanationContent != '' && (
                            <MDEditor.Markdown
                                className="px-8 py-5"
                                source={
                                    `${explanationContent.slice(6, -3)}` ||
                                    '_No explanation available yet._'
                                }
                            />
                        )}
                        {explanationContent == '' && (
                            <button
                                className="mt- px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                onClick={onRequestExplanation}
                            >
                                request Explanation
                            </button>
                        )}
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
                    <div className="space-y-4" data-color-mode="dark">
                        {isFocused ? (
                            <div>
                                <MDEditor
                                    ref={editorRef}
                                    value={editingNote}
                                    onChange={val => setEditingNote(val ?? '')}
                                    height={320}
                                    preview={`${isFocused ? 'live' : 'preview'}`}
                                    textareaProps={{
                                        placeholder: 'Write your markdown notes here...',
                                        onFocus: () => setIsFocused(true),
                                    }}
                                />

                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={handleSaveNote}
                                        disabled={isSaving}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        <Save className="h-4 w-4" />
                                        {isSaving ? 'Saving...' : 'Save Notes'}
                                    </button>

                                    <button
                                        onClick={() => {
                                            setIsFocused(false);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 text-slate-200 rounded-lg hover:bg-slate-700/60"
                                    >
                                        Preview
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="prose prose-invert max-w-none bg-slate-900/50 rounded-xl border border-slate-500 overflow-hidden  cursor-text"
                                onClick={() => setIsFocused(true)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setIsFocused(true);
                                    }
                                }}
                            >
                                <MDEditor.Markdown
                                    className="px-8 py-5"
                                    source={editingNote || '_No notes yet — click to add._'}
                                />
                            </div>
                        )}
                    </div>
                );

            case 'videos':
                return (
                    <div className="space-y-4">
                        <p className="text-slate-300">Video resources for: {subtopic.title}</p>
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-blue-500/20">
                            {videos.length > 0 ? (
                                <ul className="list-disc list-inside space-y-2">
                                    {videos.map((videoUrl, index) => (
                                        <li key={index}>
                                            <a
                                                href={videoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-300 hover:underline"
                                            >
                                                {videoUrl}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-slate-400">
                                    No video resources found for this subtopic.
                                </p>
                            )}
                        </div>
                    </div>
                );

            case 'articles':
                return (
                    <div className="space-y-4">
                        <p className="text-slate-300">Article resources for: {subtopic.title}</p>
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-blue-500/20">
                            {articles.length > 0 ? (
                                <ul className="list-disc list-inside space-y-2">
                                    {articles.map((articleUrl, index) => (
                                        <li key={index}>
                                            <a
                                                href={articleUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-300 hover:underline"
                                            >
                                                {articleUrl}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-slate-400">
                                    No articles found for this subtopic.
                                </p>
                            )}
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

            <div className="bg-slate-800/20 rounded-lg p-2 border border-slate-700/30">
                {renderContent()}
            </div>
        </div>
    );
}
