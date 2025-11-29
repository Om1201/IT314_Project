import { ArrowRight, Sparkles, Zap, Loader2 } from 'lucide-react';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserRoadmaps, generateRoadmap } from '../features/roadmapSlicer';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
export default function Generator() {
    const [description, setDescription] = useState('');
    const [skillLevel, setSkillLevel] = useState('beginner');
    const { generation_loading } = useSelector(state => state.roadmap);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();

        if (!description.trim()) {
            toast.error('Please enter what you want to learn.');
            return;
        }
        try {
            let response = await dispatch(
                generateRoadmap({ userDescription: description, userLevel: skillLevel })
            );
            response = response.payload;
            if (!response.success) {
                toast.error(response.message || 'Roadmap generation failed. Please try again.');
                return;
            }
            if (response.success === true) {
                navigate(`/roadmap/${response.data._id}`);
            }
        } catch (err) {
            console.error('Error generating roadmap:', err);
            toast.error('Failed to generate roadmap. Please try again.');
        }
    };

    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-black text-white overflow-hidden relative">
        <Navbar />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center relative z-10">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">AI-Powered Learning Paths</span>
            </div>
            <h1 className="text-6xl sm:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-white bg-clip-text text-transparent">
                Your Personalized
              </span>
              <br />
              <span className="text-slate-300">Learning Journey</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Describe what you want to master and let our AI create a customized roadmap tailored to your skill level.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="bg-slate-900/40 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-8 sm:p-10 hover:border-blue-400/50 transition-all duration-300 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-blue-400" />
                      <label htmlFor="description" className="block text-lg font-bold text-white">
                        What do you want to learn?
                      </label>
                    </div>
                    <p className="text-sm text-slate-400 ml-7">
                      Be specific about the technology, language, or skill you want to master
                    </p>
                    <textarea
                      id="description"
                      value={description}
                      disabled={generation_loading}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g., I want to master React and build production-ready web applications with TypeScript..."
                      className="w-full px-5 py-4 bg-slate-800/50 border border-blue-500/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 resize-none font-medium"
                      rows={6}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-400" />
                      <label htmlFor="skillLevel" className="block text-lg font-bold text-white">
                        What's your current level?
                      </label>
                    </div>
                    <p className="text-sm text-slate-400 ml-7">
                      Select your experience level to get a tailored roadmap
                    </p>
                    <div className="grid grid-cols-3 gap-3 ml-7 max-sm:grid-cols-1 max-sm:ml-0">
                      {[
                        { value: "beginner", label: "Beginner", desc: "Just starting" },
                        { value: "intermediate", label: "Intermediate", desc: "Some experience" },
                        { value: "advanced", label: "Advanced", desc: "Experienced" },
                      ].map((level) => (
                        <button
                          key={level.value}
                          type="button"
                          onClick={() => setSkillLevel(level.value)}
                          className={`
                                                        p-4 rounded-xl border-2 transition-all duration-300 text-center
                                                        max-sm:p-3
                                                        ${
                                                          skillLevel === level.value
                                                            ? "border-blue-400 bg-blue-500/20 shadow-lg shadow-blue-500/25"
                                                            : "border-blue-500/30 bg-slate-800/30 hover:border-blue-400/50"
                                                        }
                                                    `}
                        >
                          <div className="font-bold text-white text-base max-sm:text-sm">{level.label}</div>
                          <div className="text-xs text-slate-400 max-sm:text-[10px]">{level.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={generation_loading}
                    className="w-full cursor-pointer px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/40 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 mt-8 text-white
                                  disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {generation_loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        Generate My Roadmap
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-sm text-slate-400">
                    {generation_loading
                      ? "✨ Our AI is building your path... Please wait."
                      : "✨ Your personalized roadmap will be generated ASAP"}
                  </p>
                </form>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm hover:border-blue-400/50 transition-all duration-300">
                <div className="text-2xl font-bold text-blue-300 mb-2">🎯</div>
                <h3 className="font-bold text-white mb-2">Personalized</h3>
                <p className="text-sm text-slate-400">Tailored to skill level</p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm hover:border-blue-400/50 transition-all duration-300">
                <div className="text-2xl font-bold text-blue-300 mb-2">⚡</div>
                <h3 className="font-bold text-white mb-2">Structured</h3>
                <p className="text-sm text-slate-400">Clear milestones and learning steps</p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm hover:border-blue-400/50 transition-all duration-300">
                <div className="text-2xl font-bold text-blue-300 mb-2">🚀</div>
                <h3 className="font-bold text-white mb-2">Learn with quizzes</h3>
                <p className="text-sm text-slate-400">Generate quizzes for any subtopic anytime</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
