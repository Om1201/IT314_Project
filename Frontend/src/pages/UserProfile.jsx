import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Mail, Github, Linkedin, Twitter, Lock, Route, Flame, ChevronLeft, ChevronRight, Trash2, FileText } from "lucide-react";
import Navbar from "../components/Navbar";
import { toast } from "react-hot-toast";
import EditProfileModal from "../components/EditProfileModal";
import ChangePassword from "./ChangePassword";
import Loader from "../components/Loader"
import { useDispatch, useSelector } from "react-redux";
import axios from "axios"
import { ConfirmationDialog } from "../components/confirmation-dialog"
import MDEditor from "@uiw/react-md-editor";
import { loadProfileData, purgeAllData, setUser as setUserAction } from "../features/profileSlicer";


export default function UserProfile() {
  const dispatch = useDispatch();
  const { user, stats, roadmaps, notes, loading } = useSelector(state => state.profile);
  const safeUser = user || {};
  const [monthCursor, setMonthCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [isPurgeOpen, setIsPurgeOpen] = useState(false);

  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    dispatch(loadProfileData());
  }, [dispatch]);
  
  const safeStats = stats || { roadmaps: 0, coursesCompleted: 0, currentStreak: 0, maxStreak: 0, loginDates: [] }
  const firstInitial = (user?.name && typeof user.name === 'string' && user.name.length > 0)
    ? user.name.charAt(0).toUpperCase()
    : "U"

  const formatDate = (value) => {
    if (!value) return null;
    try {
      const d = new Date(value);
      if (isNaN(d.getTime())) return null;
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
    } catch {
      return null;
    }
  }

  const toKey = (date) => {
    const d = new Date(date);
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())).toISOString().slice(0,10);
  };
  const loginSet = new Set((safeStats.loginDates || []).map(toKey));
  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const firstDayOffset = (y, m) => new Date(y, m, 1).getDay(); 
  const renderCalendar = () => {
    const y = monthCursor.getFullYear();
    const m = monthCursor.getMonth();
    const total = daysInMonth(y, m);
    const offset = firstDayOffset(y, m);
    const cells = [];
    for (let i = 0; i < offset; i++) cells.push(<div key={"b"+i} className="h-8 sm:h-10" />);
    for (let d = 1; d <= total; d++) {
      const key = new Date(Date.UTC(y, m, d)).toISOString().slice(0,10);
      const hit = loginSet.has(key);
      cells.push(
        <div
          key={d}
          className={`h-8 sm:h-10 flex items-center justify-center rounded text-xs sm:text-sm border border-slate-800 ${hit ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' : 'bg-slate-800/40 text-slate-300'}`}
          title={hit ? 'Logged in' : ''}
        >
          {d}
        </div>
      );
    }
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => setMonthCursor(new Date(y, m-1, 1))} className="p-1 rounded hover:bg-slate-800 border border-slate-700"><ChevronLeft className="h-4 w-4"/></button>
          <div className="text-slate-200 text-sm font-medium">{monthCursor.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</div>
          <button onClick={() => setMonthCursor(new Date(y, m+1, 1))} className="p-1 rounded hover:bg-slate-800 border border-slate-700"><ChevronRight className="h-4 w-4"/></button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {['S','M','T','W','T','F','S'].map((w, i) => (
            <div key={i} className="text-[10px] sm:text-xs text-slate-400 text-center mb-1">{w}</div>
          ))}
          {cells}
        </div>
      </div>
    );
  };

  const buildProfileUrl = (type, raw) => {
    if (!raw || typeof raw !== 'string') return null;
    const val = raw.trim();
    if (val.startsWith('http://') || val.startsWith('https://')) return val;
    switch (type) {
      case 'github':
        return `https://github.com/${val.replace(/^@/, '')}`;
      case 'linkedin':
        return val.includes('/') ? `https://www.linkedin.com/${val.replace(/^\/+/, '')}` : `https://www.linkedin.com/in/${val}`;
      case 'twitter':
        return `https://twitter.com/${val.replace(/^@/, '')}`;
      default:
        return `https://${val}`;
    }
  }

  const extractHandle = (type, raw) => {
    if (!raw) return null;
    const val = raw.trim();
    try {
      if (val.startsWith('http')) {
        const url = new URL(val);
        if (type === 'github') return `@${url.pathname.replace(/^\//,'').split('/')[0]}`;
        if (type === 'linkedin') {
          const parts = url.pathname.split('/').filter(Boolean);
          return parts.length ? parts[parts.length-1] : url.hostname;
        }
        if (type === 'twitter') return `@${url.pathname.replace(/^\//,'').split('/')[0]}`;
        return url.hostname;
      }
      if (type === 'twitter' || type === 'github') return val.startsWith('@') ? val : `@${val}`;
      return val;
    } catch {
      return val;
    }
  }

  const pinned = (roadmaps || []).filter(r => r.isPinned);
  const unpinned = (roadmaps || []).filter(r => !r.isPinned);

  const groupedNotes = (notes || []).reduce((acc, n) => {
    const rid = n.roadmapId || 'unknown';
    if(!acc[rid]) acc[rid] = [];
    acc[rid].push(n);
    return acc;
  }, {});

  const handlePurge = async () => {
    try {
      const res = await dispatch(purgeAllData()).unwrap();
      if (res?.success) {
        toast.success('All data erased');
        setIsPurgeOpen(false);
      } else {
        toast.error(res?.message || 'Failed to purge');
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to purge');
    }
  }

  if(loading) return <Loader/>
  return (
    <div className="w-full min-h-screen bg-linear-to-br from-cyan-950 via-slate-800 to-slate-950">
      <Navbar />
      <div className="pt-24" />

      <div className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-8">
            <div className="shrink-0 flex flex-col items-center gap-2">
              {/* <div className="relative h-32 w-32 rounded-full border-4 border-cyan-400/30 bg-linear-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-4xl font-semibold text-white overflow-hidden"> */}
              <div className="relative h-32 w-32 rounded-full border-4 border-cyan-400/30 bg-linear-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-4xl font-semibold text-white overflow-hidden">
                {safeUser?.avatar ? (
                  <img
                    src={safeUser.avatar}
                    alt={safeUser.name || 'avatar'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  firstInitial
                )}
              </div>
              <label className="mt-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900/80 border border-slate-700 cursor-pointer hover:bg-slate-800 text-xs text-slate-200">
                Change
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 3 * 1024 * 1024) { toast.error('Max 3MB image'); return; }
                    const reader = new FileReader();
                    reader.onload = async () => {
                      try {
                        const dataUri = reader.result;
                        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/avatar`, { dataUri }, { withCredentials: true });
                        if (res.data?.success) {
                            dispatch(setUserAction(res.data.data));
                            toast.success('Avatar updated');
                        } else {
                            toast.error(res.data?.message || 'Upload failed');
                        }
                      } catch (err) {
                        toast.error(err?.response?.data?.message || 'Upload failed');
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
            </div>
            

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">{safeUser.name || 'User'}</h1>
                  <p className="text-lg text-cyan-400 mt-1">{safeUser.title || ''}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-300">
                    {safeUser.github && (
                      <span className="flex items-center gap-1">
                        <Github className="h-4 w-4" /> {extractHandle('github', safeUser.github)}
                      </span>
                    )}
                    {safeUser.linkedin && (
                      <span className="flex items-center gap-1">
                        <Linkedin className="h-4 w-4" /> {extractHandle('linkedin', safeUser.linkedin)}
                      </span>
                    )}
                    {safeUser.twitter && (
                      <span className="flex items-center gap-1">
                        <Twitter className="h-4 w-4" /> {extractHandle('twitter', safeUser.twitter)}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300 mt-3">{safeUser.bio || ''}</p>

                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-400">
                    {safeUser.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {safeUser.location}
                      </div>
                    )}
                    {formatDate(safeUser.joinDate || safeUser.createdAt) && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Joined {formatDate(safeUser.joinDate || safeUser.createdAt)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-stretch gap-2 w-full sm:w-auto">
                  {/* <button onClick={() => setIsEditOpen(true)} className="bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg px-4 py-2 font-medium transition"> */}
                  <button onClick={() => setIsEditOpen(true)} className="bg-linear-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 cursor-pointer hover:to-cyan-700 text-white rounded-lg px-4 py-2 font-medium transition">
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setIsPasswordOpen(true)}
                    className="flex items-center cursor-pointer justify-center gap-2 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg px-3 py-2 text-sm transition"
                  >
                    <Lock className="h-4 w-4" />
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
  
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-lg p-4 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-cyan-400">{roadmaps?.length || 0}</div>
              <p className="text-sm text-slate-400 mt-1">Total Generated Courses</p>
            </div>
            <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-lg p-4 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400">{safeStats.coursesCompleted || 0}</div>
              <p className="text-sm text-slate-400 mt-1">Completed Courses</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-white mb-4">Pinned Roadmaps</h2>
          <div className="space-y-3 mb-8">
            {pinned.map((roadmap) => {
              const id = roadmap?._id || roadmap?.id;
              const title = roadmap?.roadmapData?.title || roadmap?.title || 'Roadmap';
              return (
                <Link to={`/roadmap/${id}`} key={id} className="block group bg-linear-to-br from-slate-800/40 to-slate-900/40 border border-cyan-600/40 hover:border-cyan-500 rounded-lg p-4 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Route className="h-5 w-5 text-cyan-400" />
                      <span className="text-slate-200 font-medium group-hover:text-white">{title}</span>
                    </div>
                    {typeof roadmap?.progress === 'number' && (
                      <span className="text-xs text-cyan-300">{roadmap.progress}%</span>
                    )}
                  </div>
                </Link>
              );
            })}
            {pinned.length === 0 && <div className="text-slate-500 text-sm">No pinned roadmaps.</div>}
          </div>

          <h2 className="text-xl font-semibold text-white mb-4">Other Roadmaps</h2>
          <div className="space-y-3 mb-10">
            {unpinned.map((roadmap) => {
              const id = roadmap?._id || roadmap?.id;
              const title = roadmap?.roadmapData?.title || roadmap?.title || 'Roadmap';
              return (
                <Link to={`/roadmap/${id}`} key={id} className="block group bg-linear-to-br from-slate-800/40 to-slate-900/40 border border-slate-700 hover:border-cyan-500/50 rounded-lg p-4 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Route className="h-5 w-5 text-cyan-400" />
                      <span className="text-slate-200 font-medium group-hover:text-white">{title}</span>
                    </div>
                    {typeof roadmap?.progress === 'number' && (
                      <span className="text-xs text-slate-400">{roadmap.progress}%</span>
                    )}
                  </div>
                </Link>
              );
            })}
            {unpinned.length === 0 && <div className="text-slate-500 text-sm">No other roadmaps.</div>}
            {(roadmaps || []).length === 0 && <div className="text-slate-500 text-sm">No roadmaps yet.</div>}
          </div>

          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-cyan-400"/> Your Notes</h2>
          <div className="space-y-4 mb-12">
            {Object.keys(groupedNotes).map(rid => {
              const relatedRoadmap = (roadmaps || []).find(r => (r._id || r.id) === rid);
              const title = relatedRoadmap?.roadmapData?.title || relatedRoadmap?.title || 'Roadmap';
              return (
                <div key={rid} className="border border-slate-700 rounded-lg p-4 bg-slate-800/40">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-cyan-300">{title}</h3>
                    <span className="text-xs text-slate-400">{groupedNotes[rid].length} notes</span>
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                    {groupedNotes[rid].map(n => (
                      <div key={n._id} className="text-xs sm:text-sm text-slate-300 bg-slate-900/40 rounded-md p-2 border border-slate-700/60">
                        <div className="text-[10px] text-slate-500 mb-1">Module {n.moduleId} • Subtopic {n.subtopicId}</div>
                        {<MDEditor.Markdown
                                    className="px-8 py-5"
                                    data-color-mode="dark"
                                    source={n.content || "_No notes yet — click to add._"}
                                /> || <span className="italic text-slate-500">(empty)</span>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {(notes || []).length === 0 && <div className="text-slate-500 text-sm">No notes yet.</div>}
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="space-y-4">
            <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-bold text-orange-400">
                {safeStats.currentStreak}
                <Flame className="h-6 w-6" />
              </div>
              <p className="text-sm text-slate-400 mt-1">Current Streak</p>
            </div>
            <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-lg p-4 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-amber-300">{safeStats.maxStreak}</div>
              <p className="text-sm text-slate-400 mt-1">Max Streak</p>
            </div>
            <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-lg p-4">
              <h3 className="text-sm text-slate-300 mb-2 flex items-center gap-2"><Calendar className="h-4 w-4"/> Login Calendar</h3>
              {renderCalendar()}
            </div>
          </div>
        </aside>
      </div>

      
      <div className="border-t border-slate-800 bg-slate-950/30">
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-white mb-6">Connect</h2>
            <div className="flex flex-wrap gap-4">
            {safeUser.email && (
              <a
                href={`mailto:${safeUser.email}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 border border-slate-700 hover:border-cyan-500/50"
              >
                <Mail className="h-5 w-5" />
                <span className="text-sm hidden sm:inline">Email</span>
              </a>
            )}
            {buildProfileUrl('github', safeUser.github) && (
              <a
                href={buildProfileUrl('github', safeUser.github)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 border border-slate-700 hover:border-cyan-500/50"
              >
                <Github className="h-5 w-5" />
                <span className="text-sm hidden sm:inline">GitHub</span>
              </a>
            )}
            {buildProfileUrl('linkedin', safeUser.linkedin) && (
              <a
                href={buildProfileUrl('linkedin', safeUser.linkedin)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 border border-slate-700 hover:border-cyan-500/50"
              >
                <Linkedin className="h-5 w-5" />
                <span className="text-sm hidden sm:inline">LinkedIn</span>
              </a>
            )}
            {buildProfileUrl('twitter', safeUser.twitter) && (
              <a
                href={buildProfileUrl('twitter', safeUser.twitter)}
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
          {/* <div className=" bg-blue-950/40 rounded-lg p-5"> */}
          <div className=" bg-cyan-950/40 rounded-lg p-5">
            <h3 className="text-red-400  font-semibold mb-2 flex items-center gap-2"><Trash2 className="h-4 w-4"/> Danger Zone</h3>
            <p className="text-sm text-red-200/80 mb-4">Deleting your data will permanently erase all roadmaps, notes, chats, and reset profile fields & streaks. This cannot be undone.</p>
            <button
              onClick={() => setIsPurgeOpen(true)}
              className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition"
            >
              Erase All My Data
            </button>
          </div>
        </div>
      </div>

      <ChangePassword open={isPasswordOpen} onOpenChange={setIsPasswordOpen} />
      <EditProfileModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={safeUser}
        onUpdated={(updated) => dispatch(setUserAction(updated))}
      />
      <ConfirmationDialog
        isOpen={isPurgeOpen}
        title="Erase All Data?"
        description="This will permanently delete all your roadmaps, notes, chats and reset your profile. Are you sure?"
        confirmText="Yes, erase everything"
        cancelText="Cancel"
        isDangerous
        onConfirm={handlePurge}
        onCancel={() => setIsPurgeOpen(false)}
      />
    </div>
  )
}
