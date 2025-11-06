import { ChevronDown } from 'lucide-react';
import SubtopicCard from './SubtopicCard';
import SubtopicPanel from './SubtopicPanel';

export default function ModuleCard({
    module,
    isExpanded,
    onToggle,
    progress,
    completedSubtopics,
    onSubtopicClick,
    expandedSubtopics,
    onToggleComplete,
    notes,
    explanation,
    onSaveNote,
    selectedTab,
    onTabChange,
    allArticles,
    allVideos,
    onRequestExplanation,
}) {
    return (
        <div
        id={`chapter-${module.id}`}  
        className="bg-gradient-to-br from-slate-900/40 to-blue-900/20 backdrop-blur-xl border border-blue-500/30 rounded-2xl overflow-hidden hover:border-blue-400/50 transition-all duration-300">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-6 hover:bg-blue-500/10 transition-colors group"
            >
                <div className="flex items-center gap-4 text-left flex-1">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30 flex-shrink-0">
                        {module.id}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                            {module.title}
                        </h3>
                        <p className="text-slate-400 text-sm mt-1">{module.description}</p>
                    </div>
                </div>
                <ChevronDown
                    className={`h-6 w-6 text-slate-400 flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                />
            </button>

            {progress && (
                <div className="px-6 pb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-400 font-medium">Progress</span>
                        <span className="text-xs text-blue-300 font-semibold">
                            {progress.percentage}%
                        </span>
                    </div>
                    <div className="bg-slate-800/50 rounded-full h-2 overflow-hidden border border-blue-500/20">
                        <div
                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-400 transition-all duration-500"
                            style={{ width: `${progress.percentage}%` }}
                        />
                    </div>
                </div>
            )}

            {isExpanded && (
                <div className="px-6 pb-6 space-y-3 bg-slate-800/20">
                    {module.subtopics.map(subtopic => (
                        <div key={`${module.id}:${subtopic.id}`}>
                            <SubtopicCard
                                subtopic={subtopic}
                                isCompleted={completedSubtopics.has(`${module.id}:${subtopic.id}`)}
                                isExpanded={expandedSubtopics.has(`${module.id}:${subtopic.id}`)}
                                onExpand={() => onSubtopicClick(`${module.id}:${subtopic.id}`)}
                                onToggleComplete={() => onToggleComplete(module.id, subtopic.id)}
                            />

                            {expandedSubtopics.has(`${module.id}:${subtopic.id}`) && (
                                <SubtopicPanel
                                    subtopic={subtopic}
                                    chapterId={module.id}
                                    allArticles={allArticles}
                                    allVideos={allVideos}
                                    selectedTab={
                                        selectedTab[`${module.id}:${subtopic.id}`] || 'explanation'
                                    }
                                    onTabChange={tabId =>
                                        onTabChange(module.id, subtopic.id, tabId)
                                    }
                                    noteContent={notes[`${module.id}:${subtopic.id}`] || ''}
                                    explanationContent={
                                        explanation
                                            ? explanation[`${module.id}:${subtopic.id}`] || ''
                                            : ''
                                    }
                                    onSaveNote={content =>
                                        // console.log('Saving note for', module.id, subtopic.id)
                                        onSaveNote(module.id, subtopic.id, content)
                                    }
                                    onRequestExplanation={() =>
                                        onRequestExplanation(module.id, subtopic.id)
                                    }
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
