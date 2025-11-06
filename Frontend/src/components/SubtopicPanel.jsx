import { Save, CheckCircle2, Circle, X, Maximize2, Minimize2, Loader2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';
import MarkdownRenderer from './MarkdownRenderer';
import { useSelector, useDispatch } from 'react-redux';
import YoutubeThumbnail from './youtube';
import ReactDOM from 'react-dom';
const tabs = [
    { id: 'explanation', label: 'Explanation' },
    { id: 'videos', label: 'Videos' },
    { id: 'articles', label: 'Articles' },
    { id: 'notes', label: 'Notes' },
    { id: 'quiz', label: 'Quiz' },
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
    const { explanation_loading } = useSelector(state => state.roadmap);
    const [editingNote, setEditingNote] = useState(noteContent || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTab, setModalTab] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const editorRef = useRef(null);
    const modalRef = useRef(null);

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
                if (isModalOpen) {
                    e.preventDefault();
                    setIsModalOpen(false);
                    setModalTab(null);
                }
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isFocused, editingNote, isModalOpen]);

    // Handle click outside modal
    useEffect(() => {
        const handleClickOutside = event => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setIsModalOpen(false);
                setModalTab(null);
            }
        };

        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden'; // Prevent body scroll when modal is open
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

    const handleSaveNote = async () => {
        setIsSaving(true);
        try {
            await onSaveNote(editingNote);
        } catch (err) {
            console.error('Save note failed', err);
        }
        setIsSaving(false);
    };

    const handleTabClick = tabId => {
        setModalTab(tabId);
        setIsModalOpen(true);
        onTabChange(tabId);
    };

    const handleCloseModal = () => {
        // Exit fullscreen if active
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(err => {
                console.error('Error exiting fullscreen:', err);
            });
        }
        setIsModalOpen(false);
        setModalTab(null);
        setIsFullscreen(false);
    };

    const toggleFullscreen = async () => {
        if (!modalRef.current) return;

        try {
            if (!document.fullscreenElement) {
                // Enter fullscreen
                await modalRef.current.requestFullscreen();
                setIsFullscreen(true);
            } else {
                // Exit fullscreen
                await document.exitFullscreen();
                setIsFullscreen(false);
            }
        } catch (err) {
            console.error('Error toggling fullscreen:', err);
        }
    };

    // Listen for fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const renderContent = tabId => {
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

        switch (tabId) {
            case 'explanation':
                return (
                    <div className="text-slate-300 leading-relaxed">
                        {explanationContent != '' && (
                            <MDEditor.Markdown
                                className="px-8 py-5"
                                source={
                                    `${explanationContent[4] == 'd' ? explanationContent.slice(6, -3) : explanationContent.slice(11, -3)}` ||
                                    '_No explanation available yet._'
                                }
                            />
                        )}
                        {explanationContent == '' && (
                            <button
                                className="cursor-pointer disabled:cursor-not-allowed px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                onClick={() => {
                                    console.log(
                                        'This is is is is ',
                                        explanation_loading.includes(`${chapterId}:${subtopic.id}`)
                                    );
                                    onRequestExplanation();
                                }}
                                disabled={explanation_loading.includes(
                                    `${chapterId}:${subtopic.id}`
                                )}
                            >
                                {explanation_loading.includes(`${chapterId}:${subtopic.id}`) ? (
                                    <div className="flex gap-2 justify-center items-center">
                                        <Loader2 className="animate-spin" /> Generating
                                        explanation...
                                    </div>
                                ) : (
                                    `Generate explanation`
                                )}
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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {videos.map((videoUrl, index) => {
                                        console.log(`Rendering video ${index}:`, videoUrl);
                                        return (
                                            <div key={index} className="flex justify-center w-full">
                                                <YoutubeThumbnail url={videoUrl} />
                                            </div>
                                        );
                                    })}
                                </div>
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
        <div
                id={`subtopic-${chapterId}-${subtopic.id}`}
        className="mt-4 bg-gradient-to-br from-slate-900/60 to-purple-900/30 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 border-l-4 border-l-purple-500">
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
                        onClick={() => handleTabClick(tab.id)}
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

            {/* Modal Popup */}
            {isModalOpen &&
                modalTab &&
                ReactDOM.createPortal(
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[99998]"
                            onClick={handleCloseModal}
                        />
                        <div
                            ref={modalRef}
                            className={`relative bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col w-full max-w-4xl max-h-[90vh] ${isFullscreen ? 'rounded-none' : ''} z-[99999]`}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
                                <h2 className="text-lg font-semibold text-white">
                                    {tabs.find(t => t.id === modalTab)?.label || 'Content'}
                                </h2>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={toggleFullscreen}
                                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                        aria-label={
                                            isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'
                                        }
                                    >
                                        {isFullscreen ? (
                                            <Minimize2 className="h-5 w-5" />
                                        ) : (
                                            <Maximize2 className="h-5 w-5" />
                                        )}
                                    </button>
                                    <button
                                        onClick={handleCloseModal}
                                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                        aria-label="Close modal"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4">
                                {renderContent(modalTab)}
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
}
