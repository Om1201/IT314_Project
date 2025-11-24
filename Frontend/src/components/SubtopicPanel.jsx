import {
    Save,
    X,
    Maximize2,
    Minimize2,
    Loader2,
    Upload
} from 'lucide-react';

import { useEffect, useState, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { useSelector } from 'react-redux';
import YoutubeThumbnail from './youtube';
import ReactDOM from 'react-dom';
import { fetchQuizzes } from '../features/roadmapSlicer';
import toast from 'react-hot-toast';

const tabs = [
    { id: 'explanation', label: 'Explanation' },
    { id: 'videos', label: 'Videos' },
    { id: 'articles', label: 'Articles' },
    { id: 'notes', label: 'Notes' },
    { id: 'quiz', label: 'Quiz' },
];

export default function SubtopicPanel({
                                          subtopic,
                                          selectedTab = 'explanation',
                                          onTabChange = () => {},
                                          noteContent = '',
                                          onSaveNote = () => {},
                                          onRequestExplanation = () => {}, // <-- This prop will now be called with an argument
                                          onRequestQuiz = () => {},
                                          handleFetchquizzes = () => {},
                                          quizContent = [],
                                          quizLoading = [],
                                          chapterId,

                                          // These now come correctly from ModuleCard
                                          allArticles = [],
                                          allVideos = [],
                                          explanationContent = "",
                                      }) {
    const { explanation_loading, is_quiz_fetching, curr_quizzes } = useSelector(state => state.roadmap || {});

    const [editingNote, setEditingNote] = useState(noteContent || "");
    const [isSaving, setIsSaving] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTab, setModalTab] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const editorRef = useRef(null);
    const modalRef = useRef(null);
    const fileInputRef = useRef(null);
    const [userAnswers, setUserAnswers] = useState({});
    const [personalizationInput, setPersonalizationInput] = useState("");
    const [activeTab, setActiveTab] = useState('generate');
    const [activePastQuizTab, setActivePastQuizTab] = useState(0);
    const [isImporting, setIsImporting] = useState(false);

    /** Update note content when parent changes it */
    useEffect(() => {
        setEditingNote(noteContent || "");
    }, [noteContent]);

    /** global shortcuts */
    useEffect(() => {
        const onKey = e => {
            if (e.ctrlKey && e.key.toLowerCase() === 's') {
                if (isFocused) {
                    e.preventDefault();
                    handleSaveNote();
                }
            }
            if (e.key === "Escape") {
                if (isFocused) setIsFocused(false);
                if (isModalOpen) {
                    setIsModalOpen(false);
                    setModalTab(null);
                }
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isFocused, editingNote, isModalOpen]);

    /** close modal when clicking outside */
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setIsModalOpen(false);
                setModalTab(null);
            }
        };

        if (isModalOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "unset";
        };
    }, [isModalOpen]);

    const persistNote = async (value, {
        successMessage = 'Notes saved',
        errorMessage = 'Failed to save notes',
    } = {}) => {
        setIsSaving(true);
        try {
            await Promise.resolve(onSaveNote(value));
            toast.success(successMessage);
        } catch (err) {
            console.error('Note persistence failed', err);
            toast.error(errorMessage);
            throw err;
        } finally {
            setIsSaving(false);
        }
    };

    /** Save note */
    const handleSaveNote = async () => {
        await persistNote(editingNote);
    };

    const triggerImportDialog = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
            fileInputRef.current.click();
        }
    };

    const handleImportFile = event => {
        const file = event.target.files?.[0];
        if (!file) return;

        const MAX_SIZE_BYTES = 1 * 1024 * 1024; // 1 MB
        if (file.size > MAX_SIZE_BYTES) {
            toast.error('Please select a file smaller than 1MB.');
            event.target.value = '';
            return;
        }

        const reader = new FileReader();
        setIsImporting(true);

        reader.onload = async () => {
            const text = typeof reader.result === 'string' ? reader.result : '';
            setEditingNote(text);
            setIsFocused(true);
            try {
                await persistNote(text, {
                    successMessage: `Imported ${file.name}`,
                    errorMessage: 'Failed to import notes',
                });
            } catch {
                // persistNote already handled toast/logging
            } finally {
                setIsImporting(false);
            }
        };

        reader.onerror = () => {
            setIsImporting(false);
            toast.error('Unable to read the selected file.');
        };

        reader.readAsText(file);
    };

    /** quiz loading helper */
    const isQuizGenerating = () =>
        Array.isArray(quizLoading) &&
        quizLoading.includes(`${chapterId}:${subtopic.id}`);

    /** tab click handler */
    const handleTabClick = (tabId) => {
        setModalTab(tabId);
        setIsModalOpen(true);
        onTabChange(tabId);
    };

    /** modal close */
    const handleCloseModal = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(err => console.error(err));
        }
        setIsModalOpen(false);
        setModalTab(null);
        setIsFullscreen(false);
    };

    /** fullscreen toggle */
    const toggleFullscreen = async () => {
        if (!modalRef.current) return;

        try {
            if (!document.fullscreenElement) {
                await modalRef.current.requestFullscreen();
                setIsFullscreen(true);
            } else {
                await document.exitFullscreen();
                setIsFullscreen(false);
            }
        } catch (err) {
            console.error("Fullscreen toggle error:", err);
        }
    };

    /** fullscreen listener */
    useEffect(() => {
        const handleChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleChange);
        return () => document.removeEventListener("fullscreenchange", handleChange);
    }, []);

    /** content renderer */
    const renderContent = (tabId) => {
        const articleSet = allArticles?.find(
            a => a.chapterId === chapterId && a.subtopicId === subtopic.id
        );
        const articles = articleSet?.articles || [];

        const videoSet = allVideos?.find(
            v => v.chapterId === chapterId && v.subtopicId === subtopic.id
        );
        const videos = videoSet?.videos || [];

        switch (tabId) {

            /* EXPLANATION TAB -------------------------------------------------- */
            case "explanation":
                return (
                    <div className="text-slate-300 leading-relaxed">
                        {explanationContent ? (
                            <MDEditor.Markdown
                                className="px-8 py-5"
                                source={explanationContent.slice(3, 11)==="markdown" ? explanationContent.slice(11) : (explanationContent.slice(3, 5)==="md" ? explanationContent.slice(5) : explanationContent)}
                            />
                        ) : (
                            <div className="space-y-4 p-4">
                                <p className="text-sm text-slate-400">
                                    Click generate to get an AI-powered explanation for: {subtopic.title}
                                </p>

                                <div>
                                    <label htmlFor={`personalization-${subtopic.id}`} className="block text-sm font-medium text-slate-300 mb-2">
                                        Personalize (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        id={`personalization-${subtopic.id}`}
                                        value={personalizationInput}
                                        onChange={(e) => setPersonalizationInput(e.target.value)}
                                        placeholder="e.g., 'explain like I'm 10' or 'focus on Python examples'"
                                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                
                                <button
                                    className="cursor-pointer disabled:cursor-not-allowed px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors w-full"
                                    onClick={() => onRequestExplanation(personalizationInput)} 
                                    disabled={explanation_loading.includes(`${chapterId}:${subtopic.id}`)}
                                >
                                    {explanation_loading.includes(`${chapterId}:${subtopic.id}`) ? (
                                        <div className="flex gap-2 justify-center items-center">
                                            <Loader2 className="animate-spin" /> Generating explanation...
                                        </div>
                                    ) : (
                                        "Generate Explanation"
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                );

            /* QUIZ TAB --------------------------------------------------------- */
            case "quiz":
              
return (
    <div className="space-y-4">
      <p className="text-slate-300">Quiz for: {subtopic.title}</p>

      <div className="flex gap-2 border-b border-slate-700">
        <button
          onClick={() => setActiveTab('generate')}
          className={`px-4 py-2 cursor-pointer font-semibold transition-colors ${
            activeTab === 'generate'
              ? 'text-blue-400 border-b-2 border-blue-500'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          Generate Quiz
        </button>
        <button
          onClick={() => {
            setActiveTab('past')
            handleFetchquizzes();
        }}
          className={`px-4 py-2 cursor-pointer font-semibold transition-colors ${
            activeTab === 'past'
              ? 'text-blue-400 border-b-2 border-blue-500'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          Past Quizzes
        </button>
      </div>

      {activeTab === 'generate' ? (
        // Generate Quiz Tab
        <>
          {quizContent.length > 0 ? (
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
                    <p className="font-semibold text-blue-300">
                      Q{i + 1}: {q.question}
                    </p>

                    <div className="space-y-2">
                      {Object.entries(q.options || {}).map(([optKey, text]) => {
                        const isSelected = selected === optKey;
                        const correctOption =
                          isSubmitted && optKey === q.correctAnswer;
                        const wrongOption =
                          isSubmitted && isSelected && optKey !== q.correctAnswer;

                        return (
                          <label
                            key={optKey}
                            className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg border transition ${
                              correctOption
                                ? 'border-green-500 bg-green-500/20'
                                : wrongOption
                                  ? 'border-red-500 bg-red-500/20'
                                  : 'border-slate-600 hover:bg-slate-700/40'
                            }`}
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
                        className="px-3 py-1 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:bg-slate-600 disabled:cursor-not-allowed"
                      >
                        Submit Answer
                      </button>
                    )}

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
              <button
              className="cursor-pointer disabled:cursor-not-allowed px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              onClick={() => onRequestQuiz()}
              disabled={isQuizGenerating()}
            >
              {isQuizGenerating() ? (
                <div className="flex gap-2 justify-center items-center">
                  <Loader2 className="animate-spin" /> Generating quiz...
                </div>
              ) : (
                'Generate New quiz'
              )}
            </button>
            </div>
          ) : (
            <button
              className="cursor-pointer disabled:cursor-not-allowed px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              onClick={() => onRequestQuiz()}
              disabled={isQuizGenerating()}
            >
              {isQuizGenerating() ? (
                <div className="flex gap-2 justify-center items-center">
                  <Loader2 className="animate-spin" /> Generating quiz...
                </div>
              ) : (
                'Generate Quiz'
              )}
            </button>
          )}
        </>
      ) : (
        // Past Quizzes Tab
        <div className="space-y-4">
          {is_quiz_fetching ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="animate-spin text-blue-400" size={32} />
            </div>
          ) : curr_quizzes && curr_quizzes.length > 0 ? (
            <>
              <div className="flex gap-2 border-b border-slate-700 overflow-x-auto">
                {curr_quizzes.map((_, quizIndex) => (
                  <button
                    key={quizIndex}
                    onClick={() => setActivePastQuizTab(quizIndex)}
                    className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
                      activePastQuizTab === quizIndex
                        ? 'text-blue-400 border-b-2 border-blue-500'
                        : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    Quiz {quizIndex + 1}
                  </button>
                ))}
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 border border-blue-500/20 space-y-4">
                {curr_quizzes[activePastQuizTab]?.map((q, qIndex) => {
                  const qKey = `past-${activePastQuizTab}-${q.questionId ?? qIndex}`;
                  const selected = userAnswers[qKey]?.selected;
                  const isSubmitted = userAnswers[qKey]?.submitted;
                  const isCorrect = selected === q.correctAnswer;

                  return (
                    <div
                      key={qKey}
                      className="p-4 bg-slate-900/50 rounded-xl space-y-3 border border-slate-700"
                    >
                      <p className="font-semibold text-blue-300">
                        Q{qIndex + 1}: {q.question}
                      </p>

                      <div className="space-y-2">
                        {Object.entries(q.options || {}).map(
                          ([optKey, text]) => {
                            const isSelected = selected === optKey;
                            const correctOption =
                              isSubmitted && optKey === q.correctAnswer;
                            const wrongOption =
                              isSubmitted &&
                              isSelected &&
                              optKey !== q.correctAnswer;

                            return (
                              <label
                                key={optKey}
                                className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg border transition ${
                                  correctOption
                                    ? 'border-green-500 bg-green-500/20'
                                    : wrongOption
                                      ? 'border-red-500 bg-red-500/20'
                                      : 'border-slate-600 hover:bg-slate-700/40'
                                }`}
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
                          }
                        )}
                      </div>

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
            </>
          ) : (
            <p className="text-slate-400 text-center py-8">
              No past quizzes available
            </p>
          )}
        </div>
      )}
    </div>
  );

            /* NOTES TAB -------------------------------------------------------- */
            case "notes":
                return (
                    <div className="space-y-4" data-color-mode="dark">
                        <div className="flex justify-end">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".md,.markdown,.txt,.json"
                                className="hidden"
                                onChange={handleImportFile}
                            />
                            <button
                                onClick={triggerImportDialog}
                                disabled={isSaving || isImporting}
                                className="flex items-center gap-2 px-4 py-2 border border-slate-600 text-slate-200 rounded-lg hover:bg-slate-800/60 transition disabled:opacity-50"
                            >
                                {isImporting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Importing...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-4 w-4" />
                                        Import Notes
                                    </>
                                )}
                            </button>
                        </div>
                        {isFocused ? (
                            <div>
                                <MDEditor
                                    ref={editorRef}
                                    value={editingNote}
                                    onChange={val => setEditingNote(val ?? "")}
                                    height={320}
                                    preview="live"
                                />

                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={handleSaveNote}
                                        disabled={isSaving}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        <Save className="h-4 w-4" />
                                        {isSaving ? "Saving..." : "Save Notes"}
                                    </button>

                                    <button
                                        onClick={() => setIsFocused(false)}
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 text-slate-200 rounded-lg hover:bg-slate-700/60"
                                    >
                                        Preview
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="prose prose-invert max-w-none bg-slate-900/50 rounded-xl border border-slate-500 overflow-hidden cursor-text"
                                onClick={() => setIsFocused(true)}
                                role="button"
                                tabIndex={0}
                            >
                                <MDEditor.Markdown
                                    className="px-8 py-5"
                                    source={editingNote || "_No notes yet — click to add._"}
                                />
                            </div>
                        )}
                    </div>
                );

            /* VIDEOS TAB ------------------------------------------------------- */
            case "videos":
                return (
                    <div className="space-y-4">
                        <p className="text-slate-300">Video resources for: {subtopic.title}</p>
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-blue-500/20">
                            {videos.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {videos.map((url, index) => (
                                        <div key={index} className="flex justify-center w-full">
                                            <YoutubeThumbnail url={url} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400">
                                    No video resources found for this subtopic.
                                </p>
                            )}
                        </div>
                    </div>
                );

            /* ARTICLES TAB ----------------------------------------------------- */
            case "articles":
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
                                                className="text-blue-400 hover:underline"
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
            className="mt-4 bg-gradient-to-br from-slate-900/60 to-purple-900/30 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 border-l-4 border-l-purple-500"
        >
            <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white">{subtopic.title}</h3>
                    <p className="text-slate-300 text-sm">{subtopic.estimatedTime}</p>
                </div>
            </div>

            <div className="flex gap-2 mb-6 border-b border-blue-500/20 pb-3 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`px-4 cursor-pointer py-2 text-sm font-semibold whitespace-nowrap rounded-lg transition-all ${
                            selectedTab === tab.id
                                ? "bg-blue-600 text-white"
                                : "text-slate-400 hover:text-white hover:bg-slate-900/50"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

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
                            className={`relative bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col w-full max-w-4xl max-h-[90vh] ${
                                isFullscreen ? "rounded-none" : ""
                            } z-[99999]`}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
                                <h2 className="text-lg font-semibold text-white">
                                    {tabs.find(t => t.id === modalTab)?.label}
                                </h2>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={toggleFullscreen}
                                        className="p-2 cursor-pointer text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                    >
                                        {isFullscreen ? (
                                            <Minimize2 className="h-5 w-5" />
                                        ) : (
                                            <Maximize2 className="h-5 w-5" />
                                        )}
                                    </button>
                                    <button
                                        onClick={handleCloseModal}
                                        className="p-2 cursor-pointer text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
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