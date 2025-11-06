import { Code, Zap, Target, Lightbulb, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import { LampContainer } from '../components/ui/lamp';
import { motion } from 'motion/react';
import { InfiniteMovingCardsDemo } from '../components/InfiniteMovingCardsDemo';
import { StickyScrollRevealDemo } from '../components/StickyScrollRevealDemo';
import { TypewriterEffect } from '../components/ui/typewriter-effect';
import { Meteors } from '../components/ui/meteors';
export default function Home() {
    const { isLoggedin } = useSelector(state => state.user);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-black text-white overflow-hidden">
            <Navbar />

            <LampContainer>
                <motion.h1
                    initial={{ opacity: 0.5, y: 400 }}
                    whileInView={{ opacity: 1, y: 160 }}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: 'easeInOut',
                    }}
                    className="pt-24 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
                >
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center space-y-8">
                            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full hover:border-blue-500/50 transition-colors">
                                <Zap className="w-4 h-4 text-blue-400" />
                                <span className="text-sm font-medium tracking-wide text-blue-300 font-sans">
                                    AI-Powered Roadmap Generation
                                </span>
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                                    <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-white bg-clip-text text-transparent">
                                        AI-Powered Roadmaps
                                    </span>
                                    <br />
                                    <span className="text-slate-300">for Your Success</span>
                                </h1>
                                <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light tracking-wide font-sans">
                                    Generate intelligent, personalized learning roadmaps powered by
                                    AI. From beginner to expert, we chart your path to mastery.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                <Link
                                    to={`${isLoggedin ? '/roadmap/generate' : '/signin'}`}
                                    className="px-7 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 
             rounded-xl font-medium tracking-wide font-sans text-lg
             hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-500/25 
             transform hover:scale-105 active:scale-95 
             transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    {isLoggedin ? 'Get Started' : 'Sign In'}{' '}
                                    <ArrowRight className="h-5 w-5" />
                                </Link>

                                <Link
                                    to="/about"
                                    className="px-7 py-3 border border-slate-600 rounded-xl 
             font-medium tracking-wide font-sans text-lg text-slate-200
             hover:bg-slate-800 hover:border-blue-400 
             hover:shadow-lg hover:shadow-blue-500/10 
             transform hover:scale-105 active:scale-95
             transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.h1>
            </LampContainer>

            <InfiniteMovingCardsDemo />

            <section className="bg-[#02354B]">
                <div className="text-center mb-20">
                    <h2
                        className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 
                             bg-gradient-to-r from-blue-400 via-blue-200 to-white 
                             bg-clip-text text-transparent tracking-wide drop-shadow-[0_2px_6px_rgba(0,186,217,0.25)]"
                    >
                        How It Works
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
                        Discover how our AI designs your personalized roadmap - step by step.
                    </p>
                </div>

                <StickyScrollRevealDemo />
            </section>

            <section className="py-20 bg-gradient-to-b from-[#02354B] to-slate-900 px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-4xl mx-auto">
                    <div className="relative overflow-hidden bg-gradient-to-r from-[#00181F] to-slate-900/50 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-12 text-center">
                        <div className="relative z-10">
                            <TypewriterEffect
                                words={[
                                    { text: 'Ready', className: 'text-white' },
                                    { text: 'to', className: 'text-white' },
                                    { text: 'Start', className: 'text-white' },
                                    { text: 'Your', className: 'text-white' },
                                    { text: 'Journey?', className: 'text-white' },
                                ]}
                                className="text-4xl sm:text-5xl font-bold mb-6"
                                cursorClassName="bg-blue-500"
                                staggerDelay={0.04}
                                charDuration={0.15}
                            />
                            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                                Join learners creating their perfect roadmaps with AI
                            </p>
                            <Link
                                to={`${isLoggedin ? '/roadmap/generate' : '/signin'}`}
                                className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold text-lg hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 active:scale-95"
                            >
                                Get Started Now
                            </Link>
                        </div>

                        <div className="pointer-events-none absolute inset-0">
                            <Meteors number={24} />
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
