import { useState, useMemo, useEffect } from 'react';
import { useStopwatch } from '../hooks/stopwatch.js';
import { useTimer } from '../hooks/timer.js';
import LeftSidebar from '../components/LeftSidebar.jsx';
import ModuleCard from '../components/ModuleCard.jsx';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
    fetchNotes,
    fetchProgress,
    fetchSubtopicExplanation,
    generateSubtopicSummary,
    getUserRoadmapById,
    saveNote,
    saveProgress,
} from '../features/roadmapSlicer.js';
import toast from 'react-hot-toast';
import Loader from '../components/Loader.jsx';
import Navbar from '../components/Navbar.jsx';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RoadmapDisplay() {
    const dispatch = useDispatch();
    const [currRoadmap, setCurrRoadmap] = useState({});
    const [isLoading, setisLoading] = useState(true);
    const [notfound, setNotfound] = useState(false);
    const { id } = useParams();
    const [completedSubtopics, setCompletedSubtopics] = useState(new Map());

    const [selectedTab, setSelectedTab] = useState({});
    const [notes, setNotes] = useState({});
    const [explanation, setExplanation] = useState({});
    const [expandedModules, setExpandedModules] = useState(new Set());
    const [expandedSubtopics, setExpandedSubtopics] = useState(new Map());

    const stopwatch = useStopwatch();
    const timer = useTimer();

    useEffect(() => {
        async function fetchRoadmap() {
            if (id === undefined) return;
            let response = await dispatch(getUserRoadmapById(id));
            response = response.payload;
            if (!response.success) {
                setNotfound(true);
                toast.error('Failed to fetch roadmap data');
                setisLoading(false);
                return;
            }
            setCurrRoadmap(response.data.roadmapData);
            for (let i = 1; i <= response.data.roadmapData.chapters.length; i++) {
                for (
                    let j = 1;
                    j <= response.data.roadmapData.chapters[i - 1].subtopics.length;
                    j++
                ) {
                    setSelectedTab(prev => ({ ...prev, [`${i}:${j}`]: 'explanation' }));
                }
            }
            let notesResponse = await dispatch(fetchNotes(id));
            notesResponse = notesResponse.payload.data;
            setNotes(notesResponse);

            let progressResponse = await dispatch(fetchProgress({ roadmapId: id }));
            progressResponse = new Set(progressResponse.payload.data);

            setCompletedSubtopics(progressResponse);

            let explanationResponse = await dispatch(fetchSubtopicExplanation({ roadmapId: id }));
            explanationResponse = explanationResponse.payload.data;
            setExplanation(explanationResponse);
            setisLoading(false);
        }
        fetchRoadmap();
    }, [id, dispatch]);

    const moduleProgress = useMemo(() => {
        return currRoadmap?.chapters?.map(module => {
            const completedCount = module.subtopics.filter(s =>
                completedSubtopics.has(`${module.id}:${s.id}`)
            ).length;
            return {
                moduleId: module.id,
                title: module.title,
                completed: completedCount,
                total: module.subtopics.length,
                percentage: Math.round((completedCount / module.subtopics.length) * 100),
            };
        });
    }, [currRoadmap, completedSubtopics]);

    const overallProgress = useMemo(() => {
        const total = currRoadmap?.chapters?.reduce((sum, m) => sum + m.subtopics.length, 0);
        const completed = completedSubtopics.size;
        return Math.round((completed / total) * 100);
    }, [currRoadmap, completedSubtopics]);
    const toggleSubtopicComplete = async (moduleId, subtopicId) => {
        const newCompleted = new Set(completedSubtopics);
        if (newCompleted.has(`${moduleId}:${subtopicId}`)) {
            newCompleted.delete(`${moduleId}:${subtopicId}`);
        } else {
            newCompleted.add(`${moduleId}:${subtopicId}`);
        }
        setCompletedSubtopics(newCompleted);

        const response = await dispatch(
            saveProgress({ roadmapId: id, chapterId: moduleId, subtopicId })
        );
    };

    const saveNotes = async (moduleId, subtopicId, content) => {
        try {
            let response = await dispatch(
                saveNote({ roadmapId: id, subtopicId: subtopicId, moduleId: moduleId, content })
            );
            response = response.payload;
            console.log(response);
            if (!response.success) {
                toast.error('Failed to save note');
                return;
            }

            await dispatch(fetchNotes(id));

            toast.success('Note saved successfully');
            setNotes(prev => ({ ...prev, [`${moduleId}:${subtopicId}`]: content }));
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const onTabChange = (moduleId, subtopicId, tabId) => {
        setSelectedTab(prev => ({
            ...prev,
            [`${moduleId}:${subtopicId}`]: tabId,
        }));
    };

    const onRequestExplanation = async (moduleId, subtopicId) => {
        try {
            let response = await dispatch(
                generateSubtopicSummary({ roadmapId: id, moduleId, subtopicId })
            );
            response = response.payload;
            console.log('Generated explanation:', response);
            if (!response.success) {
                toast.error('Failed to generate explanation');
                return;
            }
            setExplanation(prev => ({
                ...prev,
                [`${moduleId}:${subtopicId}`]: response.summary,
            }));
            toast.success('Explanation generated successfully');
        } catch (error) {
            toast.error('Failed to generate explanation', error.message);
        }
    };

    const toggleModuleExpanded = moduleId => {
        const newExpanded = new Set(expandedModules);
        if (newExpanded.has(moduleId)) {
            newExpanded.delete(moduleId);
        } else {
            newExpanded.add(moduleId);
        }
        setExpandedModules(newExpanded);
    };

    const toggleSubtopicExpanded = (moduleId, subtopicId) => {
        const newExpandedSubtopics = new Map(expandedSubtopics);
        const moduleSubtopics = newExpandedSubtopics.get(moduleId) || new Set();

        if (moduleSubtopics.has(subtopicId)) {
            moduleSubtopics.delete(subtopicId);
        } else {
            moduleSubtopics.add(subtopicId);
        }

        if (moduleSubtopics.size === 0) {
            newExpandedSubtopics.delete(moduleId);
        } else {
            newExpandedSubtopics.set(moduleId, moduleSubtopics);
        }

        setExpandedSubtopics(newExpandedSubtopics);
    };

    if (notfound) {
        return (
            <div className="flex items-center justify-center h-screen pt-16 bg-gradient-to-br from-slate-950 via-blue-950 to-black text-white overflow-hidden">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[70vh] text-center relative z-10">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse"></div>
                        <div className="relative bg-slate-900/60 border border-slate-700/50 backdrop-blur-xl p-6 rounded-2xl">
                            <BookOpen className="h-12 w-12 text-blue-400 opacity-80" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-semibold text-slate-200 mb-2">
                        Roadmap Not Found
                    </h2>
                    <p className="text-slate-400 max-w-md mb-8">
                        The roadmap you're looking for doesn't exist or may have been removed.
                    </p>

                    <Link
                        to="/roadmaps"
                        className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold text-white shadow-lg shadow-blue-900/30 transition-all duration-300 flex items-center gap-2"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Back to My roadmaps
                    </Link>
                </div>
            </div>
        );
    }
    if (isLoading) return <Loader />;

    return (
        <div className="flex h-screen pt-16 bg-gradient-to-br from-slate-950 via-blue-950 to-black text-white overflow-hidden">
            <Navbar />
            <LeftSidebar
                roadmapTitle={currRoadmap.title}
                difficulty={currRoadmap.difficulty}
                estimatedDuration={currRoadmap.estimatedDuration}
                overallProgress={overallProgress}
                stopwatch={stopwatch}
                timer={timer}
                moduleProgress={moduleProgress}
            />

            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    <div className="mb-12">
                        <h1 className="text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-blue-200 bg-clip-text text-transparent">
                                {currRoadmap.title}
                            </span>
                        </h1>
                        <p className="text-xl text-slate-300 mb-4">{currRoadmap.description}</p>
                    </div>

                    <div className="space-y-4">
                        {currRoadmap.chapters.map(module => (
                            <div key={module.id}>
                                <ModuleCard
                                    module={module}
                                    isExpanded={expandedModules.has(module.id)}
                                    onToggle={() => toggleModuleExpanded(module.id)}
                                    progress={moduleProgress?.find(p => p.moduleId === module.id)}
                                    completedSubtopics={completedSubtopics}
                                    onSubtopicClick={subtopicId =>
                                        toggleSubtopicExpanded(module.id, subtopicId)
                                    }
                                    expandedSubtopics={
                                        expandedSubtopics.get(module.id) || new Set()
                                    }
                                    onToggleComplete={toggleSubtopicComplete}
                                    notes={notes}
                                    explanation={explanation}
                                    onSaveNote={saveNotes}
                                    selectedTab={selectedTab}
                                    onTabChange={onTabChange}
                                    allArticles={currRoadmap.articles}
                                    allVideos={currRoadmap.videos}
                                    onRequestExplanation={onRequestExplanation}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
