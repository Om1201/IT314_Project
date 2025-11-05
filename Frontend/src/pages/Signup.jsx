import { useState } from "react"
import { Code, Eye, EyeOff, Check, X, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import toast from "react-hot-toast"
import { signupUser } from "../features/userSlicer"
import { useNavigate } from "react-router-dom"

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const passwordRequirements = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  }

  const isPasswordValid = Object.values(passwordRequirements).every((req) => req)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isPasswordValid) {
      toast.error("Password does not meet all requirements")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    setIsLoading(true)
    const body = {
      name,
      email,
      password,
    }
    try {
      let response = await dispatch(signupUser(body))
      response = response.payload
      if (response.success) {
        toast.success(response.message)
        setName("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
      } else {
        toast.error(response.message || "Registration failed. Please try again.")
      }
    } catch (err) {
      if (err.response?.message) {
        toast.error(err.response.message)
      } else {
        toast.error("An error occurred during registration. Please try again.")
      }
    }
    setIsLoading(false)
  }

  const handleOauthGoogle = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/oauth/google/login`
  }

  const RequirementItem = ({ met, text }) => (
    <div className="flex items-center gap-2.5">
      {met ? (
        <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
      ) : (
        <X className="h-4 w-4 text-red-400 flex-shrink-0" />
      )}
      <span className={`text-xs font-medium transition-colors ${met ? "text-emerald-400" : "text-gray-400"}`}>
        {text}
      </span>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-800 via-blue-900 to-slate-600 flex items-center justify-center p-4">


        {/* <Navbar /> */}


      <div className="w-full max-w-md">
        <div className="bg-slate-950/50 border border-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-8">
          {/* Header Section */}
          <div className="space-y-3 text-center">
            <div
            onClick={() => {
                navigate('/');  
            }}
            className="flex cursor-pointer items-center justify-center space-x-2 mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
                <Code className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-white tracking-tight">CodeLearn</span>
            </div>
            <h1 className="text-3xl font-bold text-white leading-tight">Create Account</h1>
            <p className="text-sm text-gray-400">Join thousands of developers learning today</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-xs font-semibold text-gray-200 uppercase tracking-wide">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all duration-200 hover:border-slate-600/50 text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-semibold text-gray-200 uppercase tracking-wide">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all duration-200 hover:border-slate-600/50 text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-xs font-semibold text-gray-200 uppercase tracking-wide">
                Password
              </label>
              <div className="relative group">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setShowPasswordRequirements(true)}
                  className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 focus:outline-none pr-12 transition-all duration-200 hover:border-slate-600/50 text-sm"
                  required
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {password.length > 0 && isPasswordValid && (
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 animate-pulse" />
                  )}
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-300 transition-colors duration-200 p-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements Display */}
              {showPasswordRequirements && password.length > 0 && (
                <div
    className="mt-4 p-3.5 bg-slate-900/40 border border-slate-700/40 rounded-lg space-y-2.5 backdrop-blur-sm 
               transition-all duration-500 ease-out animate-[fadeIn_0.4s_ease-out]"
  >
                  <p className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Requirements:</p>
                  <RequirementItem met={passwordRequirements.length} text="At least 6 characters" />
                  <RequirementItem met={passwordRequirements.uppercase} text="One uppercase letter" />
                  <RequirementItem met={passwordRequirements.lowercase} text="One lowercase letter" />
                  <RequirementItem met={passwordRequirements.number} text="One number" />
                  <RequirementItem met={passwordRequirements.special} text="One special character" />
                </div>
              )}

            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold text-gray-200 uppercase tracking-wide"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 focus:outline-none pr-12 transition-all duration-200 hover:border-slate-600/50 text-sm"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors duration-200 p-1"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"

              disabled={!isPasswordValid || isLoading}
              className="w-full cursor-pointer px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-blue-50 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:shadow-none text-sm mt-6"
            >
                {/* <Loader2 className="h-5 w-5 animate-spin" />{' '}
              Create Account */}
              {isLoading ? (
                                            <div className="flex items-center justify-center gap-1">
                                                <Loader2 className="h-5 w-5 animate-spin" />{' '}
                                                {/* <-- Show loader */}
                                                Creating Account
                                            </div>
                                        ) : (
                                            <>
                                                Create Account
                                            </>
                                        )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-700/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 text-gray-400 font-medium">or continue</span>
            </div>
          </div>

          {/* OAuth Button */}
          <button
            onClick={handleOauthGoogle}
            className="w-full cursor-pointer px-6 py-3 border border-slate-700/50 text-white hover:bg-slate-900/40 bg-slate-900/20 hover:border-blue-500/50 transition-all duration-300 rounded-lg hover:shadow-lg hover:shadow-blue-500/10 flex items-center justify-center font-medium text-sm backdrop-blur-sm"
          >
            <img src="images/google.png" className="h-4 pr-2" alt="google logo" />
            Continue with Google
          </button>

          {/* Sign In Link */}
          <div className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to={"/signin"}
              className="text-white cursor-pointer hover:text-blue-400 font-semibold transition-colors duration-200"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
