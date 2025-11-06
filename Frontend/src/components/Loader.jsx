// import React from 'react';

// export default function Loader() {
//     return (
//         <div className="min-h-screen bg-gradient-to-br pt-56 from-blue-900 via-slate-900 to-black text-white overflow-hidden">
//             <div className="flex items-center justify-center min-h-96">
//                 <div className="flex flex-col items-center gap-4">
//                     <div className="relative w-16 h-16">
//                         <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-spin"></div>
//                         <div className="absolute inset-2 bg-slate-900 rounded-full"></div>
//                     </div>
//                     <p className="text-slate-300 text-lg font-medium">Loading your roadmaps...</p>
//                     <div className="flex gap-2">
//                         <div
//                             className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
//                             style={{ animationDelay: '0s' }}
//                         ></div>
//                         <div
//                             className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
//                             style={{ animationDelay: '0.2s' }}
//                         ></div>
//                         <div
//                             className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
//                             style={{ animationDelay: '0.4s' }}
//                         ></div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

export default function Loader() {
    return (
        <div className="min-h-screen bg-black text-white overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-black opacity-100"></div>

            <div className="relative z-10 flex flex-col items-center gap-8">
                <div className="relative w-32 h-32">
                    {/* Outer rotating ring - white */}
                    <div
                        className="absolute inset-0 rounded-full border-2 border-transparent border-t-white border-r-white animate-spin"
                        style={{ animationDuration: '2s' }}
                    ></div>

                    {/* Middle rotating ring - #015670 (teal) */}
                    <div
                        className="absolute inset-3 rounded-full border-2 border-transparent border-b-[#015670] border-l-[#015670] animate-spin"
                        style={{ animationDuration: '3s', animationDirection: 'reverse' }}
                    ></div>

                    {/* Inner rotating ring - blue */}
                    <div
                        className="absolute inset-6 rounded-full border-2 border-transparent border-t-blue-400 border-r-blue-500 animate-spin"
                        style={{ animationDuration: '1.5s' }}
                    ></div>

                    {/* Center dot - pulsing */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#015670] animate-pulse"></div>
                </div>

                <p className="text-gray-300 text-lg font-medium text-center">
                    Loading your roadmaps...
                </p>

                <div className="flex gap-3 items-center">
                    <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: '0s' }}
                    ></div>
                    <div
                        className="w-2 h-2 bg-[#015670] rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                    ></div>
                    <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: '0.4s' }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
