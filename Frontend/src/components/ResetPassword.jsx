import { useState, useRef } from "react"
import { Eye, EyeOff, Lock } from "lucide-react"

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")



  const handleSubmit = (e) => {
    
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-black flex items-center justify-center p-4 relative overflow-hidden">

      <div className="w-full max-w-md relative z-10">
        <div
        
          className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-blue-900/20 hover:shadow-blue-900/30 transition-all duration-500 p-8"
        >
          <div className="space-y-1 text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="relative">
                <Lock className="h-10 w-10 text-blue-400 drop-shadow-lg" />
                <div className="absolute inset-0 h-10 w-10 bg-blue-400/20 rounded-lg blur-xl animate-pulse"></div>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                CodeLearn
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-slate-300">Enter your new password to secure your account</p>
          </div>

          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-200">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-400 focus:bg-slate-700 pr-12 transition-all duration-300 hover:border-blue-400 hover:shadow-md"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-0 h-full px-4 py-3 text-slate-400 hover:text-blue-400 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-200">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-400 focus:bg-slate-700 pr-12 transition-all duration-300 hover:border-blue-400 hover:shadow-md"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-0 h-full px-4 py-3 text-slate-400 hover:text-blue-400 transition-colors duration-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
            
                type="submit"
                className="w-full cursor-pointer px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 transform active:scale-95"
              >
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
