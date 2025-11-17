import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MoveLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function NotFound() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 overflow-hidden relative">
        <Navbar/>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className={`text-center space-y-8 max-w-3xl relative z-10 transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        <div className="space-y-4">
          <div className="inline-block">
            <div className="relative">
              <h1 className="text-8xl md:text-9xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-pulse"
                style={{ textShadow: '0 0 30px rgba(59, 130, 246, 0.3)' }}>
                404
              </h1>
              <div className="absolute -inset-8 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 hover:opacity-20 rounded-full blur-2xl transition-opacity duration-300"></div>
            </div>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Oops! Page Not Found
          </h2>
        </div>

        <div className="space-y-2">
          <p className="text-lg md:text-xl text-slate-300">
            Looks like this page drifted into the void.
          </p>
          <p className="text-base md:text-lg text-slate-400">
            Don't worry, we'll help you find your way back.
          </p>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="group relative px-8 py-4 md:px-8 md:py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg overflow-hidden"
          >
            <span className="relative z-10 flex justify-center items-center gap-2">
              <MoveLeft/> Back to Home
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>

        </div>

      </div>
    </div>
  );
}
