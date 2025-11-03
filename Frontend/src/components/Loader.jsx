import React from 'react';

export default function Loader() {
    return (
        <div className="min-h-screen bg-gradient-to-br pt-56 from-blue-900 via-slate-900 to-black text-white overflow-hidden">
            <div className="flex items-center justify-center min-h-96">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-2 bg-slate-900 rounded-full"></div>
                    </div>
                    <p className="text-slate-300 text-lg font-medium">Loading your roadmaps...</p>
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
        </div>
    );
}
