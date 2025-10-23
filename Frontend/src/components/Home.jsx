import { Code, Zap, Target, Lightbulb, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import Footer from "./Footer"
import Navbar from "./Navbar"

export default function Home() {

  // checking github account

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-black text-white overflow-hidden">
      
      <Navbar />
      
      <section className="pt-56 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full hover:border-blue-500/50 transition-colors">
          <Zap className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-blue-300">AI-Powered Roadmap Generation</span>
        </div>
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-white bg-clip-text text-transparent">
                  AI-Powered Roadmaps
                </span>
                <br />
                <span className="text-slate-300">for Your Success</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Generate intelligent, personalized learning roadmaps powered by AI. From beginner to expert, we chart
                your path to mastery.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/signin"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold text-lg hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight className="h-5 w-5" />
              </Link>
              <button className="px-8 py-4 border border-slate-600 rounded-xl hover:bg-slate-800 hover:border-blue-400 transition-all duration-300 font-semibold text-lg hover:shadow-md">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Everything you need to create and follow your perfect learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300 hover:-translate-y-1">
              <div className="relative mb-4">
                <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <Zap className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Generation</h3>
              <p className="text-slate-400">
                Instantly generate personalized roadmaps tailored to your goals and skill level
              </p>
            </div>

            <div className="group bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300 hover:-translate-y-1">
              <div className="relative mb-4">
                <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <Target className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Goal Tracking</h3>
              <p className="text-slate-400">Monitor your progress with detailed milestones and achievement tracking</p>
            </div>

            <div className="group bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300 hover:-translate-y-1">
              <div className="relative mb-4">
                <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <Lightbulb className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Insights</h3>
              <p className="text-slate-400">Get AI-powered recommendations to optimize your learning path</p>
            </div>

            <div className="group bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300 hover:-translate-y-1">
              <div className="relative mb-4">
                <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <Code className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Resource Library</h3>
              <p className="text-slate-400">Access curated resources and learning materials for every step</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 text-center">
                <div className="h-16 w-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  1
                </div>
                <h3 className="text-2xl font-semibold mb-3">Define Your Goal</h3>
                <p className="text-slate-400">Tell us what you want to learn and your current skill level</p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-9 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-transparent"></div>
            </div>

            <div className="relative">
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 text-center">
                <div className="h-16 w-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  2
                </div>
                <h3 className="text-2xl font-semibold mb-3">AI Generates Roadmap</h3>
                <p className="text-slate-400">Our AI creates a personalized learning path with milestones</p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-9 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-transparent"></div>
            </div>

            <div className="relative">
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 text-center">
                <div className="h-16 w-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  3
                </div>
                <h3 className="text-2xl font-semibold mb-3">Learn & Track</h3>
                <p className="text-slate-400">Follow your roadmap and track progress toward mastery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-900/50 to-slate-900/50 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-12 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join learners creating their perfect roadmaps with AI
            </p>
            <Link
              href="/signin"
              className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold text-lg hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 active:scale-95"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      
    </div>
  )
}
