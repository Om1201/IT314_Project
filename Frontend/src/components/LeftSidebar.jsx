import { Clock, Zap, CheckCircle2, Play, Pause, RotateCcw } from 'lucide-react';
import { useRef } from 'react';

export default function LeftSidebar({
    roadmapTitle,
    difficulty,
    estimatedDuration,
    overallProgress,
    stopwatch,
    timer,
    moduleProgress,
}) {
    const resetBtn = useRef();
    return (
        <aside className="w-80 bg-slate-900/40 backdrop-blur-xl border-blue-500/30 overflow-y-auto p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">{roadmapTitle}</h2>

                <div className="space-y-4">
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-blue-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="h-4 w-4 text-purple-400" />
                            <span className="text-xs text-slate-400 uppercase tracking-wide">
                                Difficulty
                            </span>
                        </div>
                        <div className="font-semibold text-white">{difficulty}</div>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4 border border-blue-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4 text-blue-400" />
                            <span className="text-xs text-slate-400 uppercase tracking-wide">
                                Estimated Time
                            </span>
                        </div>
                        <div className="font-semibold text-white">{estimatedDuration}</div>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-xs text-slate-400 uppercase tracking-wide">
                        Overall Progress
                    </span>
                </div>
                <div className="bg-slate-800/50 rounded-full h-3 overflow-hidden border border-blue-500/20">
                    <div
                        className="h-3 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-400 transition-all duration-500"
                        style={{ width: `${overallProgress}%` }}
                    />
                </div>
                <div className="text-xs text-slate-400 mt-2">
                    <span className="text-blue-300 font-semibold">{overallProgress}%</span> Complete
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
                    Stopwatch
                </h3>
                <div className="bg-gradient-to-br from-slate-800/60 to-blue-900/30 rounded-lg p-4 border border-blue-500/30">
                    <div className="text-4xl font-mono font-bold text-blue-300 text-center mb-4">
                        {String(stopwatch.minutes).padStart(2, '0')}:
                        {String(stopwatch.seconds).padStart(2, '0')}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={stopwatch.toggle}
                            className="flex-1 cursor-pointer flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 transition-colors"
                            title={stopwatch.isRunning ? 'Pause' : 'Start'}
                        >
                            {stopwatch.isRunning ? (
                                <Pause className="h-4 w-4" />
                            ) : (
                                <Play className="h-4 w-4" />
                            )}
                            <span className="text-xs font-semibold">
                                {stopwatch.isRunning ? 'Pause' : 'Start'}
                            </span>
                        </button>
                        <button
                            onClick={stopwatch.reset}
                            className="flex-1 cursor-pointer flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg py-2 transition-colors"
                            title="Reset"
                        >
                            <RotateCcw className="h-4 w-4" />
                            <span className="text-xs font-semibold">Reset</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
                    Timer
                </h3>
                <div className="bg-gradient-to-br from-slate-800/60 to-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                    <div className="flex gap-2 mb-4">
                        <input
                            type="number"
                            min="0"
                            max="59"
                            value={timer.minutes}
                            onChange={async e => {
                                await timer.setMinutes(
                                    Math.max(0, Number.parseInt(e.target.value) || 0)
                                );
                                resetBtn.current.click();
                            }}
                            disabled={timer.isRunning}
                            className="flex-1 bg-slate-800 text-white px-2 py-1 rounded text-center text-sm disabled:opacity-50"
                            placeholder="MM"
                        />
                        <span className="text-white font-bold self-center">:</span>
                        <input
                            type="number"
                            min="0"
                            max="59"
                            value={timer.seconds}
                            onChange={e =>
                                timer.setSeconds(
                                    Math.max(0, Math.min(59, Number.parseInt(e.target.value) || 0))
                                )
                            }
                            disabled={timer.isRunning}
                            className="flex-1 bg-slate-800 text-white px-2 py-1 rounded text-center text-sm disabled:opacity-50"
                            placeholder="SS"
                        />
                    </div>
                    <div className="text-3xl font-mono font-bold text-purple-300 text-center mb-4">
                        {String(timer.displayMinutes).padStart(2, '0')}:
                        {String(timer.displaySeconds).padStart(2, '0')}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={timer.toggle}
                            className="flex-1 flex cursor-pointer items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 transition-colors disabled:opacity-50"
                            disabled={timer.totalSeconds === 0}
                            title={timer.isRunning ? 'Pause' : 'Start'}
                        >
                            {timer.isRunning ? (
                                <Pause className="h-4 w-4" />
                            ) : (
                                <Play className="h-4 w-4" />
                            )}
                            <span className="text-xs font-semibold">
                                {timer.isRunning ? 'Pause' : 'Start'}
                            </span>
                        </button>
                        <button
                            ref={resetBtn}
                            onClick={timer.reset}
                            className="flex-1 flex cursor-pointer items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg py-2 transition-colors"
                            title="Reset"
                        >
                            <RotateCcw className="h-4 w-4" />
                            <span className="text-xs font-semibold">Reset</span>
                        </button>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
                    Module Progress
                </h3>
                <div className="space-y-3">
                    {moduleProgress?.map(mod => (
                        <div
                            key={mod.moduleId}
                            className="bg-slate-800/50 rounded-lg p-3 border border-blue-500/20"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-slate-300 font-medium">
                                    {mod.title}
                                </span>
                                <span className="text-xs text-blue-300 font-semibold">
                                    {mod.percentage}%
                                </span>
                            </div>
                            <div className="bg-slate-700 rounded-full h-2 overflow-hidden">
                                <div
                                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                                    style={{ width: `${mod.percentage}%` }}
                                />
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                                {mod.completed}/{mod.total} completed
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
