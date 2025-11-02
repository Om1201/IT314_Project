import { ChevronDown, CheckCircle2, Circle } from 'lucide-react';

export default function SubtopicCard({
    subtopic,
    isCompleted,
    isExpanded,
    onExpand,
    onToggleComplete,
}) {
    return (
        <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/20 border border-blue-500/20 rounded-xl overflow-hidden hover:border-blue-400/40 hover:bg-slate-800/60 transition-all duration-300 group/card">
            <div
                className="flex items-start justify-between gap-4 p-4 cursor-pointer hover:bg-blue-500/5"
                onClick={onExpand}
            >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            onToggleComplete();
                        }}
                        className="mt-1 flex-shrink-0 transition-colors hover:text-blue-400"
                        title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                        {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-green-400" />
                        ) : (
                            <Circle className="h-5 w-5 text-slate-500" />
                        )}
                    </button>
                    <div className="flex-1 min-w-0">
                        <div
                            className={`font-semibold group-hover/card:text-blue-200 transition-colors ${isCompleted ? 'line-through text-slate-500' : 'text-white'}`}
                        >
                            {subtopic.title}
                        </div>
                        <div className="text-sm text-slate-400 mt-1 line-clamp-2">
                            {subtopic.description}
                        </div>
                    </div>
                </div>
                <ChevronDown
                    className={`h-5 w-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                />
            </div>

            {!isExpanded && (
                <div className="px-4 pb-3 flex items-center justify-between text-xs text-slate-500">
                    <span>{subtopic.estimatedTime}</span>
                </div>
            )}
        </div>
    );
}
