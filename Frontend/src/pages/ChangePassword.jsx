import { useState } from "react"
import { Eye, EyeOff, Lock, X } from "lucide-react"
import axios from "axios"
import { toast } from "react-hot-toast"

export default function ChangePassword({ open, onOpenChange }) {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Please fill all the fields.")
      return
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.")
      return
    }

    setLoading(true)
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/change-password`,
        { oldPassword, newPassword },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      )
      if (res.data?.success) {
        setSuccess(true)
        toast.success("Password updated")
      }
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")

      setTimeout(() => onOpenChange(false), 1200)
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong. Please try again."
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-xl w-[90%] max-w-md p-6 text-white relative animate-fade-in">
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <Lock className="h-6 w-6 text-cyan-400" />
          <h2 className="text-xl font-semibold text-cyan-400">Change Password</h2>
        </div>
        <p className="text-slate-400 text-sm mb-6">
          Update your account password to keep your profile secure.
        </p>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm mb-1">Current Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
              placeholder="Enter your current password"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 pr-10 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-cyan-400"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Confirm New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
              placeholder="Confirm new password"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">Password changed successfully!</p>}

          <button
            type="submit"
            disabled={loading}
              className="w-full mt-4 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Updating Password..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  )
}
