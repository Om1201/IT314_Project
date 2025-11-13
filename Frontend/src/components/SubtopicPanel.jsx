import { Save, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { useSelector } from 'react-redux';

const tabs = [
    { id: 'explanation', label: 'Explanation' },
    { id: 'quiz', label: 'Quiz' },
    { id: 'notes', label: 'Notes' },
    { id: 'videos', label: 'Videos' },
    { id: 'articles', label: 'Articles' },
];

export default function SubtopicPanel({
                                          subtopic,
                                          selectedTab = 'explanation',
                                          onTabChange = () => {},
                                          noteContent = '',
                                          onSaveNote = () => {},
                                          onRequestExplanation = () => {},
                                          onRequestQuiz = () => {},
                                          quizContent = [],
                                          quizLoading = [],
                                          chapterId, // <-- important: must be provided by parent (ModuleCard)
                                      }) {
    const { explanation_loading } = useSelector(state => state.roadmap || {});
    const [editingNote, setEditingNote] = useState(noteContent || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const editorRef = useRef(null);

    const modalRef = useRef(null);
    const [userAnswers, setUserAnswers] = useState({});

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

    // defensive helper for quiz loading state
    const isQuizGenerating = () =>
        Array.isArray(quizLoading) && chapterId !== undefined
            ? quizLoading.includes(`${chapterId}:${subtopic.id}`)
            : false;

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
                        <p className="text-slate-300">Quiz for: {subtopic.title}</p>

                        {Array.isArray(quizContent) && quizContent.length > 0 ? (
                            <div className="space-y-4 bg-slate-800/50 rounded-lg p-4 border border-blue-500/20">

                                {quizContent.map((q, i) => {
                                    const qKey = `${q.questionId ?? i}`;
                                    const selected = userAnswers[qKey]?.selected;
                                    const isSubmitted = userAnswers[qKey]?.submitted;
                                    const isCorrect = selected === q.correctAnswer;

                                    return (
                                        <div
                                            key={qKey}
                                            className="p-4 bg-slate-900/50 rounded-xl space-y-3 border border-slate-700"
                                        >
                                            {/* Question */}
                                            <p className="font-semibold text-blue-300">
                                                Q{i + 1}: {q.question}
                                            </p>

                                            {/* Options (radio buttons) */}
                                            <div className="space-y-2">
                                                {Object.entries(q.options || {}).map(([optKey, text]) => {
                                                    const isSelected = selected === optKey;
                                                    const isCorrectOption =
                                                        isSubmitted && optKey === q.correctAnswer;
                                                    const isWrongOption =
                                                        isSubmitted &&
                                                        isSelected &&
                                                        optKey !== q.correctAnswer;

                                                    return (
                                                        <label
                                                            key={optKey}
                                                            className={`
                                                                flex items-center gap-3 cursor-pointer p-2 rounded-lg 
                                                                border transition 
                                                                ${
                                                                isCorrectOption
                                                                    ? 'border-green-500 bg-green-500/20'
                                                                    : isWrongOption
                                                                        ? 'border-red-500 bg-red-500/20'
                                                                        : 'border-slate-600 hover:bg-slate-700/40'
                                                            }
                                                            `}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name={`q-${qKey}`}
                                                                value={optKey}
                                                                checked={isSelected}
                                                                disabled={isSubmitted}
                                                                onChange={() =>
                                                                    setUserAnswers(prev => ({
                                                                        ...prev,
                                                                        [qKey]: {
                                                                            selected: optKey,
                                                                            submitted: false,
                                                                        },
                                                                    }))
                                                                }
                                                            />
                                                            <span className="text-slate-300">
                                                                <span className="text-blue-400 font-semibold">
                                                                    {optKey.toUpperCase()}:
                                                                </span>{' '}
                                                                {text}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>

                                            {/* Submit Button */}
                                            {!isSubmitted && (
                                                <button
                                                    onClick={() =>
                                                        setUserAnswers(prev => ({
                                                            ...prev,
                                                            [qKey]: {
                                                                selected,
                                                                submitted: true,
                                                            },
                                                        }))
                                                    }
                                                    disabled={!selected}
                                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:bg-slate-600 disabled:cursor-not-allowed"
                                                >
                                                    Submit Answer
                                                </button>
                                            )}

                                            {/* Result + Explanation */}
                                            {isSubmitted && (
                                                <div className="space-y-2">
                                                    <p
                                                        className={`font-semibold ${
                                                            isCorrect ? 'text-green-400' : 'text-red-400'
                                                        }`}
                                                    >
                                                        {isCorrect ? 'Correct!' : 'Incorrect!'}
                                                    </p>

                                                    <p className="text-slate-300 text-sm">
                                                        <span className="text-blue-400 font-semibold">
                                                            Explanation:
                                                        </span>{' '}
                                                        {q.explanation}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                            </div>
                        ) : (
                            <button
                                className="cursor-pointer disabled:cursor-not-allowed px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                onClick={() => {
                                    // call parent request; parent may expect (moduleId, subtopicId) or no args
                                    try {
                                        // try sending both ids (if parent handles them)
                                        onRequestQuiz(chapterId, subtopic.id);
                                    } catch (err) {
                                        // fallback
                                        onRequestQuiz();
                                    }
                                }}
                                disabled={isQuizGenerating()}
                            >
                                {isQuizGenerating() ? (
                                    <div className="flex gap-2 justify-center items-center">
                                        <Loader2 className="animate-spin" /> Generating quiz...
                                    </div>
                                ) : (
                                    `Generate Quiz`
                                )}
                            </button>
                        )}
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

            <div className="bg-slate-800/20 rounded-lg p-2 border border-slate-700/30">
                {renderContent()}
            </div>
        </div>
    );
}
