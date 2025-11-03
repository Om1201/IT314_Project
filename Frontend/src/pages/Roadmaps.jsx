import { useState } from 'react';
import { Trash2, Plus, Calendar, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import { deleteUserRoadmap, setUserRoadmaps } from '../features/roadmapSlicer';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Roadmaps() {
    const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const { userRoadmaps, fetch_loading } = useSelector(state => state.roadmap);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    console.log(userRoadmaps);

    const handleDelete = id => {
        setDeleteId(id);
        setIsDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (deleteId) {
            try {
                let response = await dispatch(deleteUserRoadmap(deleteId));
                response = response.payload;
                if (!response.success) {
                    toast.error('Failed to delete roadmap');
                    return;
                }
                toast.success('Roadmap deleted successfully');
                await dispatch(setUserRoadmaps(userRoadmaps.filter(r => r._id !== deleteId)));
            } catch (err) {
                console.error('Error deleting roadmap:', err);
            }

            setIsDeleteConfirm(false);
            setDeleteId(null);
        }
    };

    const formatDate = dateString => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleDisplayRoadmap = id => {
        navigate(`/roadmap/${id}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-black text-white overflow-hidden">
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
                        <div className="flex items-center justify-center min-h-96">
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative w-16 h-16">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-spin"></div>
                                    <div className="absolute inset-2 bg-slate-900 rounded-full"></div>
                                </div>
                                <p className="text-slate-300 text-lg font-medium">
                                    Loading your roadmaps...
                                </p>
                                <div className="flex gap-2">
                                    <div
                                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                        style={{ animationDelay: '0s' }}
                                    ></div>
                                    <div
                                        className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                                        style={{ animationDelay: '0.2s' }}
                                    ></div>
                                    <div
                                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                                        style={{ animationDelay: '0.4s' }}
                                    ></div>
                                </div>
                            </div>
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
                                <>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                        {userRoadmaps.map(roadmap => (
                                            <div
                                                key={roadmap._id}
                                                className="group bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                                                onClick={() => handleDisplayRoadmap(roadmap._id)}
                                            >
                                                {/* Header */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-semibold mb-1 text-white line-clamp-2">
                                                            {roadmap.roadmapData.title ||
                                                                'Untitled Roadmap'}
                                                        </h3>
                                                        <p className="text-sm text-slate-400 line-clamp-1">
                                                            {roadmap.roadmapData.difficulty &&
                                                                `${roadmap.roadmapData.difficulty} Level`}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            handleDelete(roadmap._id);
                                                        }}
                                                        className="p-2 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors duration-300 text-red-400 hover:text-red-300"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>

                                                {/* Description + Footer */}
                                                <div className="flex flex-col justify-between w-full h-[65%]">
                                                    <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                                                        {roadmap.roadmapData.description ||
                                                            'No description provided'}
                                                    </p>
                                                    <div className="flex items-center justify-between pt-4 border-t border-slate-700/30">
                                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                                            <Calendar className="h-4 w-4" />
                                                            {formatDate(roadmap.createdAt)}
                                                        </div>
                                                        <button className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 group">
                                                            View
                                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Floating Create Button */}
                            <div className="absolute bottom-10 right-10">
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

            {/* Delete Confirmation Modal */}
            {isDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-sm w-full">
                        <h2 className="text-2xl font-bold mb-2">Delete Roadmap?</h2>
                        <p className="text-slate-300 mb-6">
                            Are you sure you want to delete this roadmap? This action cannot be
                            undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsDeleteConfirm(false)}
                                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors duration-300 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-300 font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Roadmap Detail Modal */}
        </div>
    );
}
