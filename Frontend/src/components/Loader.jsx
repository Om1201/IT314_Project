import React from 'react'

export default function Loader() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-blue-950 to-black flex items-center justify-center">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Loading content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-8">
        {/* Spinner */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-blue-900/30"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>
        </div>

        {/* Text */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Loading</h2>
          {/* <p className="text-blue-300/70 text-sm">Preparing your roadmap...</p> */}
        </div>

        {/* Dots animation */}
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </div>
  )
}