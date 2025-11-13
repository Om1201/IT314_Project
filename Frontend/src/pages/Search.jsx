import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchAll, setQuery } from '../features/searchSlicer';
import { useNavigate, useSearchParams } from 'react-router-dom';
import GridBackground from '../components/ui/GridBackground';

export default function Search() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const { query, results, loading, error } = useSelector(state => state.search);
    const [localQuery, setLocalQuery] = useState(params.get('q') || query || '');

    useEffect(() => {
        const initial = params.get('q');
        if (initial) {
            dispatch(setQuery(initial));
            dispatch(searchAll({ query: initial }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = e => {
        e.preventDefault();
        const q = localQuery.trim();
        if (!q) return;
        navigate(`/search?q=${encodeURIComponent(q)}`);
        dispatch(setQuery(q));
        dispatch(searchAll({ query: q }));
    };

    const goToRoadmap = (roadmapId, hash = '') => {
        navigate(`/roadmap/${roadmapId}${hash ? `#${hash}` : ''}`);
    };

    return (
        <GridBackground className="min-h-screen pt-24 px-4" containerClassName="max-w-5xl mx-auto">
                <form onSubmit={onSubmit} className="mb-6">
                    <input
                        value={localQuery}
                        onChange={e => setLocalQuery(e.target.value)}
                        placeholder="Search roadmaps, chapters, subtopics, notes…"
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </form>

                {loading && <p className="text-slate-400">Searching…</p>}
                {error && <p className="text-red-400">{error}</p>}

                {!loading && !error && (
                    <div className="space-y-8">
                        <Section title={`Roadmaps (${results.roadmaps.total})`}>
                            {results.roadmaps.items.map(item => (
                                <Item
                                    key={`rm-${item.roadmapId}`}
                                    title={item.title}
                                    onClick={() => goToRoadmap(item.roadmapId)}
                                />
                            ))}
                        </Section>

                        <Section title={`Chapters (${results.chapters.total})`}>
                            {results.chapters.items.map(item => (
                                <Item
                                    key={`ch-${item.roadmapId}-${item.chapterId}`}
                                    title={`${item.title} — ${item.roadmapTitle}`}
                                    onClick={() => goToRoadmap(item.roadmapId, `chapter-${item.chapterId}`)}
                                />
                            ))}
                        </Section>

                        <Section title={`Subtopics (${results.subtopics.total})`}>
                            {results.subtopics.items.map(item => (
                                <Item
                                    key={`st-${item.roadmapId}-${item.chapterId}-${item.subtopicId}`}
                                    title={`${item.title} — ${item.chapterTitle}`}
                                    onClick={() =>
                                        goToRoadmap(
                                            item.roadmapId,
                                            `subtopic-${item.chapterId}-${item.subtopicId}`
                                        )
                                    }
                                />
                            ))}
                        </Section>

                        <Section title={`Notes (${results.notes.total})`}>
                            {results.notes.items.map(item => (
                                <Item
                                    key={`nt-${item.roadmapId}-${item.moduleId}-${item.subtopicId}`}
                                    title={item.snippet || '(no preview)'}
                                    onClick={() =>
                                        goToRoadmap(
                                            item.roadmapId,
                                            `subtopic-${item.moduleId}-${item.subtopicId}`
                                        )
                                    }
                                />
                            ))}
                        </Section>
                    </div>
                )}
        </GridBackground>
    );
}

function Section({ title, children }) {
    return (
        <div>
            <h2 className="text-slate-300 font-semibold mb-3">{title}</h2>
            <div className="space-y-2">{children}</div>
        </div>
    );
}

function Item({ title, onClick }) {
    return (
        <button
            onClick={onClick}
            className="w-full text-left px-4 py-3 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 hover:bg-slate-900/80 transition-colors"
        >
            <div className="truncate">{title}</div>
        </button>
    );
}
