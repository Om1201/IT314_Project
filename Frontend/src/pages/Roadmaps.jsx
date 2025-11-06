import { useState } from 'react';
import { Trash2, Plus, Calendar, BookOpen, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { ExpandableCardDemo } from '../components/ExpandableCardDemo';

export default function Roadmaps() {
    const { userRoadmaps, fetch_loading } = useSelector(state => state.roadmap);
    const formatDate = dateString => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        // <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-black text-white overflow-hidden">
        <div className="min-h-screen bg-gradient-to-br from-slate-800 via-cyan-900 to-slate-800 text-white overflow-hidden">
            <Navbar />

            {/* Main Content */}
            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-2">
                            <span className="bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                                My Roadmaps
                            </span>
                        </h1>
                        <p className="text-slate-300 text-lg">
                            View and manage all your learning roadmaps
                        </p>
                    </div>

                    {fetch_loading ? (
                        <div className="h-96 w-full flex flex-col items-center justify-center">
                            <Loader2 className="h-10 w-10 animate-spin text-slate-400" />
                            <p className="text-slate-400 text-center mt-3">
                                Loading your roadmaps...
                            </p>
                        </div>
                    ) : (
                        <>
                            {userRoadmaps.length === 0 ? (
                                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-16 text-center">
                                    <BookOpen className="h-16 w-16 text-slate-500 mx-auto mb-4 opacity-50" />
                                    <h2 className="text-2xl font-semibold mb-2 text-slate-300">
                                        No Roadmaps Yet
                                    </h2>
                                    <p className="text-slate-400 mb-8 max-w-md mx-auto">
                                        Create your first AI-powered learning roadmap to get started
                                        on your learning journey
                                    </p>
                                </div>
                            ) : (
                                <ExpandableCardDemo />
                            )}

                            <div className="fixed bottom-10 right-10">
                                <Link
                                    to="/roadmap/generate"
                                    className="px-4 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 rounded-full"
                                >
                                    <Plus className="h-6 w-6" />
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
