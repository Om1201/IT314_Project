"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { X, User, Globe, BookText } from "lucide-react";

export default function EditProfileModal({ open, onClose, user, onUpdated }) {
  const [form, setForm] = useState({ title: "", bio: "", location: "", github: "", linkedin: "", twitter: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && user) {
      setForm({
        title: user.title || "",
        bio: user.bio || "",
        location: user.location || "",
        github: user.github || "",
        linkedin: user.linkedin || "",
        twitter: user.twitter || "",
      });
      setError("");
    }
  }, [open, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/profile`,
        form,
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );
      if (res.data?.success) {
        onUpdated(res.data.data);
        onClose();
      } else {
        setError(res.data?.message || "Update failed");
        toast.error(res.data?.message || "Update failed");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Server error";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-xl w-full max-w-lg p-6 text-white relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 mb-4">
          <User className="h-6 w-6 text-cyan-400" />
          <h2 className="text-xl font-semibold text-cyan-400">Edit Profile</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-slate-300">Title / Headline</label>
            <input name="title" value={form.title} onChange={handleChange} maxLength={100}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-500" placeholder="e.g. Full Stack Developer" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-slate-300">Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} maxLength={1000}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-500 h-28 resize-none" placeholder="Short introduction" />
            <div className="text-xs text-slate-500 mt-1">{form.bio.length}/1000</div>
          </div>
          <div>
            <label className="block text-sm mb-1 text-slate-300">Location</label>
            <input name="location" value={form.location} onChange={handleChange} maxLength={100}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-500" placeholder="City, Country" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1 text-slate-300">GitHub</label>
              <input name="github" value={form.github} onChange={handleChange} maxLength={200}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-500" placeholder="username or full URL" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-slate-300">LinkedIn</label>
              <input name="linkedin" value={form.linkedin} onChange={handleChange} maxLength={200}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-500" placeholder="profile path or URL" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-slate-300">Twitter</label>
              <input name="twitter" value={form.twitter} onChange={handleChange} maxLength={200}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-500" placeholder="handle or URL" />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={saving}
            className="w-full bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
        <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
          <Globe className="h-4 w-4" />
          <span>Links are stored as provided; we normalize on display.</span>
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
          <BookText className="h-4 w-4" />
          <span>Bio strips angle brackets for safety.</span>
        </div>
      </div>
    </div>
  );
}
