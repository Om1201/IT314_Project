import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    CheckCircle2,
    Clock,
    Zap,
    StickyNote,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserRoadmapById } from '../features/roadmapSlicer';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import { fetchNotes } from '../features/roadmapSlicer';
import NoteModal from '../components/NoteModal';

export default function RoadmapDisplay() {
    const dispatch = useDispatch();
    const [currRoadmap, setCurrRoadmap] = useState({});
    const [isLoading, setisLoading] = useState(true);
    const [notfound, setNotfound] = useState(false);
    const { id } = useParams();

    const { notes } = useSelector(state => state.roadmap);

    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [currentNoteContext, setCurrentNoteContext] = useState(null);

    useEffect(() => {
        async function fetchRoadmap() {
            if (id === undefined) return;
            let response = await dispatch(getUserRoadmapById(id));
            response = response.payload;
            console.log(response);
            if (!response.success) {
                setNotfound(true);
                toast.error('Failed to fetch roadmap data');
                setisLoading(false);
                return;
            }
            console.log('Fetched single roadmap:', response.roadmapData);
            setCurrRoadmap(response.data.roadmapData);

            dispatch(fetchNotes(id));
            setisLoading(false);
        }
        fetchRoadmap();
    }, [id, dispatch]);

    const handleOpenNotes = (contextId, contextType, title) => {
        setCurrentNoteContext({ id: contextId, type: contextType, title });
        setIsNoteModalOpen(true);
    };
    if (!currRoadmap) return null;

    const data = currRoadmap;
    const progressCounts = (() => {
        let total = 0,
            completed = 0;
        (data.chapters || []).forEach(ch => {
            (ch.subtopics || []).forEach(s => {
                total++;
                if (s.completed) completed++;
            });
        });
        return { total, completed, ratio: total ? Math.round((completed / total) * 100) : 0 };
    })();

    if (isLoading) return <Loader />;

    return (
        <>
            <Navbar />
            <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-950 via-blue-950 to-black text-white overflow-hidden relative py-8 px-4 sm:px-6 lg:px-8">
                {notfound ? (
                    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center relative z-10">
                        {/* Glowing Icon */}
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse"></div>
                            <div className="relative bg-slate-900/60 border border-slate-700/50 backdrop-blur-xl p-6 rounded-2xl">
                                <BookOpen className="h-12 w-12 text-blue-400 opacity-80" />
                            </div>
                        </div>

                        {/* Text */}
                        <h2 className="text-3xl font-semibold text-slate-200 mb-2">
                            Roadmap Not Found
                        </h2>
                        <p className="text-slate-400 max-w-md mb-8">
                            The roadmap you're looking for doesn't exist or may have been removed.
                        </p>

                        {/* Button to go back */}
                        <Link
                            to="/roadmaps"
                            className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold text-white shadow-lg shadow-blue-900/30 transition-all duration-300 flex items-center gap-2"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            Back to My roadmaps
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
                            <div
                                className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"
                                style={{ animationDelay: '1s' }}
                            ></div>
                            <div
                                className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
                                style={{ animationDelay: '2s' }}
                            ></div>
                        </div>

                        <div className="w-full max-w-7xl mx-auto relative z-10">
                            <div className="mb-12">
                                <h1 className="text-5xl sm:text-6xl font-bold mb-4">
                                    <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-blue-200 bg-clip-text text-transparent">
                                        {data.title}
                                    </span>
                                </h1>
                                <p className="text-xl text-slate-300 max-w-3xl">
                                    {data.description}
                                </p>
                                {/* Module-level Save Note button */}
                                <div className="mt-4">
                                    <button
                                        onClick={() =>
                                            handleOpenNotes('root', 'module', data.title)
                                        }
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 hover:text-white hover:bg-blue-500/20 hover:border-blue-400/50 transition-colors"
                                        title="Save Note"
                                        aria-label={`Save note for module ${data.title}`}
                                    >
                                        <span className="text-[10px] sm:text-xs font-semibold tracking-wide">
                                            SAVE NOTE
                                        </span>
                                        <StickyNote className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-4 gap-8">
                                <aside className="lg:col-span-1">
                                    <div className="sticky top-8 bg-gradient-to-br from-slate-900/60 to-blue-900/30 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-8 hover:border-blue-400/50 transition-all duration-300 shadow-2xl space-y-6">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock className="h-4 w-4 text-blue-400" />
                                                <div className="text-xs text-slate-400 uppercase tracking-wide">
                                                    Estimated duration
                                                </div>
                                            </div>
                                            <div className="font-bold text-white text-lg">
                                                {data.estimatedDuration}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Zap className="h-4 w-4 text-purple-400" />
                                                <div className="text-xs text-slate-400 uppercase tracking-wide">
                                                    Difficulty
                                                </div>
                                            </div>
                                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 transition-colors">
                                                <span className="font-semibold text-white">
                                                    {data.difficulty}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <CheckCircle2 className="h-4 w-4 text-green-400" />
                                                <div className="text-xs text-slate-400 uppercase tracking-wide">
                                                    Progress
                                                </div>
                                            </div>
                                            <div className="bg-slate-800/50 rounded-full h-3 overflow-hidden border border-blue-500/20">
                                                <div
                                                    className="h-3 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-400 transition-all duration-500"
                                                    style={{ width: `${progressCounts.ratio}%` }}
                                                />
                                            </div>
                                            <div className="text-xs text-slate-400 mt-3">
                                                <span className="text-blue-300 font-semibold">
                                                    {progressCounts.completed}/
                                                    {progressCounts.total}
                                                </span>{' '}
                                                completed •{' '}
                                                <span className="text-purple-300 font-semibold">
                                                    {progressCounts.ratio}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </aside>

                                <main className="lg:col-span-3 space-y-6">
                                    {(data.chapters || []).map(chapter => (
                                        <section
                                            key={chapter.id}
                                            className="bg-gradient-to-br from-slate-900/40 to-blue-900/20 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-8 hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group"
                                        >
                                            <div className="flex items-start justify-between gap-4 mb-6">
                                                <div className="flex-1">
                                                    <div className="inline-flex items-center gap-3 mb-3">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
                                                            {chapter.id}
                                                        </div>
                                                        <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                                                            {chapter.title}
                                                        </h3>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() =>
                                                                handleOpenNotes(
                                                                    chapter.id,
                                                                    'chapter',
                                                                    chapter.title
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 hover:text-white hover:bg-blue-500/20 hover:border-blue-400/50 transition-colors"
                                                            title="Save Note"
                                                            aria-label={`Save note for chapter ${chapter.title}`}
                                                        >
                                                            <span className="text-[10px] sm:text-xs font-semibold tracking-wide">
                                                                SAVE NOTE
                                                            </span>
                                                            <StickyNote className="h-4 w-4" />
                                                        </button>
                                                    </div>

                                                    <p className="text-slate-300 mt-3 leading-relaxed">
                                                        {chapter.description}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-4 text-sm text-slate-400">
                                                        <Clock className="h-4 w-4" />
                                                        Estimated time:{' '}
                                                        <span className="font-semibold text-blue-300">
                                                            {chapter.estimatedTime}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0 text-slate-400 group-hover:text-blue-400 transition-colors transform group-hover:translate-x-1">
                                                    <ArrowRight className="h-6 w-6" />
                                                </div>
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-4">
                                                {(chapter.subtopics || []).map(s => (
                                                    <div
                                                        key={s.id}
                                                        className="bg-gradient-to-br from-slate-800/40 to-slate-900/20 border border-blue-500/20 rounded-xl p-5 hover:border-blue-400/40 hover:bg-slate-800/60 transition-all duration-300 group/card"
                                                    >
                                                        <div className="flex items-start justify-between gap-3 mb-4">
                                                            <div className="flex-1">
                                                                <div className="font-semibold text-white group-hover/card:text-blue-200 transition-colors">
                                                                    {s.title}
                                                                </div>
                                                                <div className="text-sm text-slate-400 mt-1 leading-relaxed">
                                                                    {s.description}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <div
                                                                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${s.completed ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-slate-700/30 text-slate-300 border border-slate-600/30'}`}
                                                            >
                                                                {s.completed
                                                                    ? '✓ Completed'
                                                                    : 'Pending'}
                                                            </div>
                                                            <div className="text-xs text-slate-500 font-medium">
                                                                {s.estimatedTime}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    ))}
                                </main>
                            </div>
                        </div>
                        {isNoteModalOpen && (
                            <NoteModal
                                roadmapId={id}
                                contextId={currentNoteContext.id}
                                contextType={currentNoteContext.type}
                                title={currentNoteContext.title}
                                initialContent={
                                    notes[`${currentNoteContext.type}:${currentNoteContext.id}`] ||
                                    ''
                                }
                                onClose={() => setIsNoteModalOpen(false)}
                            />
                        )}
                    </>
                )}
            </div>
        </>
    );
}