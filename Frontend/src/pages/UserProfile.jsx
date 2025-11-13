"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin, Mail, Github, Linkedin, Twitter, Lock, Route } from "lucide-react";
import ChangePassword from "./ChangePassword";
import Loader from "../components/Loader"
import axios from "axios"


export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("roadmap");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, 
          { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        )
        console.log()
        const statsRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/stats`, 
          { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        )
        const roadmapRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/roadmaps`, 
          { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        )        
        setUser(profileRes.data.data);
        setStats(statsRes.data.data);
        setRoadmaps(roadmapRes.data.data);
      } catch (err) {
        console.error("Error loading data:", err);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const tabClass = (tab) =>
    `px-4 py-2 text-sm font-medium rounded-t-lg ${
      activeTab === tab
        ? "bg-slate-700 text-white"
        : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
    } transition`

  if(loading) return <Loader/>
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-bold text-white">
            <span className="text-cyan-400">&lt;&gt;</span>
            CodingLearning
          </div>
            <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300">
              <a href="/" className="hover:text-white transition">Home</a>
              <a href="/about" className="hover:text-white transition">About</a>
              <a href="/contact" className="hover:text-white transition">Contact</a>
              <a href="/roadmaps" className="hover:text-white transition">Roadmaps</a>
            </nav>
          <button
            onClick={() => setIsPasswordOpen(true)}
            className="flex items-center gap-2 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg px-3 py-1.5 text-sm transition"
          >
            <Lock className="h-4 w-4" />
            Change Password
          </button>
        </div>
      </header>

      {/* Profile Heading */}
      <div className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-8">
            {/* Avatar (dummy for now, will integrate properly afterwards) */}
            <div className="flex-shrink-0">
              <div className="h-32 w-32 rounded-full border-4 border-cyan-400/30 bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-4xl font-semibold text-white">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  user?.name.charAt(0)
                )}
              </div>
            </div>

            {/* Will display user info here*/}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl sm:text-4xl font-bold text-white">{user.name}</h1>
                  <p className="text-lg text-cyan-400 mt-1">{user.title}</p>
                  <p className="text-slate-300 mt-3">{user.bio}</p>

                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-400">
                    {user.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {user.location}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {user.joinDate}
                    </div>
                  </div>
                </div>

                <button className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg px-4 py-2 font-medium transition">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Will display stats here, still not decided whether too display strak or not, will discuss with team */}
      <div className="border-b border-slate-800 bg-slate-950/30">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[ 
              { label: "Courses Completed", value: stats.coursesCompleted, color: "text-cyan-400" },
              { label: "Hours Learned", value: stats.hoursLearned, color: "text-blue-400" },
              { label: "Day Streak", value: stats.currentStreak, color: "text-orange-400" },
              { label: "Total Points", value: stats.totalPoints, color: "text-purple-400" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-lg p-4 text-center"
              >
                <div className={`text-2xl sm:text-3xl font-bold ${item.color}`}>{item.value}</div>
                <p className="text-sm text-slate-400 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Displaying Roadmaps here */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-wrap border-b border-slate-700 mb-6">
          <button onClick={() => setActiveTab("roadmap")} className={tabClass("roadmap")}>
            Roadmap
          </button>
        </div>

        {activeTab === "roadmap" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Learning Roadmaps</h2>
            {roadmaps.map((roadmap) => (
              <div
                key={roadmap.id}
                className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700 rounded-lg p-6 hover:border-cyan-500/50 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Route className="h-5 w-5 text-cyan-400" />
                      {roadmap.title}
                    </h3>
                    <p className="text-slate-400 text-sm mt-2">{roadmap.description}</p>
                    <div className="mt-3 text-xs text-slate-500">
                      Last Updated: {roadmap.lastUpdated}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-cyan-400 font-semibold">{roadmap.progress}% Complete</p>
                    <div className="w-32 h-2 bg-slate-800 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                        style={{ width: `${roadmap.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Link Section to be updated, right now only email will be visible*/}
      <div className="border-t border-slate-800 bg-slate-950/30">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-lg font-semibold text-white mb-6">Connect</h2>
          <div className="flex flex-wrap gap-4">
            {user.email && (
              <a
                href={`mailto:${user.email}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 border border-slate-700 hover:border-cyan-500/50"
              >
                <Mail className="h-5 w-5" />
                <span className="text-sm hidden sm:inline">Email</span>
              </a>
            )}
            {user.github && (
              <a
                href={`https://${user.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 border border-slate-700 hover:border-cyan-500/50"
              >
                <Github className="h-5 w-5" />
                <span className="text-sm hidden sm:inline">GitHub</span>
              </a>
            )}
            {user.linkedin && (
              <a
                href={`https://${user.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 border border-slate-700 hover:border-cyan-500/50"
              >
                <Linkedin className="h-5 w-5" />
                <span className="text-sm hidden sm:inline">LinkedIn</span>
              </a>
            )}
            {user.twitter && (
              <a
                href={`https://${user.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 border border-slate-700 hover:border-cyan-500/50"
              >
                <Twitter className="h-5 w-5" />
                <span className="text-sm hidden sm:inline">Twitter</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <ChangePassword open={isPasswordOpen} onOpenChange={setIsPasswordOpen} />
    </div>
  )
}
