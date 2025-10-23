import { useState, useEffect } from "react"
import { CheckCircle, XCircle, Loader2, Shield, Eye, EyeOff } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { resetPassword } from "../features/userSlicer"
import { useSelector } from "react-redux"
import { setTempEmail } from "../features/userSlicer"

export default function PasswordReset() {
  const [status, setStatus] = useState("loading") 
  const [message, setMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [token, setToken] = useState("")
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tempemail = useSelector((state) => state.user.tempemail);


  useEffect(() => {
    const verifyResetToken = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const tokenParam = urlParams.get("token")
        // const emailParam = urlParams.get("email")

        if (!tokenParam) {
          setStatus("error")
          setMessage("Reset link is invalid.")
          toast.error("Reset link is invalid");
          return
        }

        setToken(tokenParam)
        // setEmail(emailParam)

        const body = { token: tokenParam }

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-reset-token`, body)

        await dispatch(setTempEmail({ tempemail: response.data.email }));
        setStatus("verified")
        setMessage("Link verified successfully. Please enter your new password.")
        toast.success("Verification completed. Please enter your new password")
      } catch (error) {
        toast.error(error.response.data.message || "Verification failed")
        setStatus("error")
        setMessage("Reset link is invalid or has expired.")
      }
    }

    verifyResetToken()
  }, [])

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password do not match")
      return
    }

    try {
      let response = await dispatch(resetPassword({ email: tempemail, newPassword: formData.password, token }));
      response = response.payload;
      if(!response.success){
        toast.error(response.message || "Password reset failed")
        return;
      }
      toast.success("Password reset successfully")

      setTimeout(() => {
        navigate('/', { replace: true })
      }, 1000)
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed")
      setStatus("verified")
      setMessage("Link verified successfully. Please enter your new password.")
    }
  }

  const handleRetry = () => {
    setStatus("loading")
    setMessage("")
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-blue-900/20 hover:shadow-blue-900/30 transition-all duration-500 p-8">
          <div className="space-y-1 text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="relative">
                <Shield className="h-10 w-10 text-blue-400 drop-shadow-lg" />
                <div className="absolute inset-0 h-10 w-10 bg-blue-400/20 rounded-lg blur-xl animate-pulse"></div>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                CodeLearn
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-slate-300">
              {status === "loading"
                ? "Verifying reset link..."
                : status === "verified"
                  ? "Enter your new password"
                  : "Password Reset"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              {status === "loading" && (
                <div className="flex items-center space-x-3">
                  <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
                  <span className="text-slate-300">Verifying reset link...</span>
                </div>
              )}

              {status === "success" && (
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                  <span className="text-green-400 font-semibold">Password Reset Successful!</span>
                </div>
              )}

              {status === "error" && (
                <div className="flex items-center space-x-3">
                  <XCircle className="h-8 w-8 text-red-400" />
                  <span className="text-red-400 font-semibold">Reset Failed</span>
                </div>
              )}
            </div>

            <div className="text-center">
              <p className="text-slate-300">{message}</p>
            </div>

            {status === "verified" && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full cursor-pointer px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  Submit
                </button>
              </form>
            )}

            {status === "error" && (
              <button
                onClick={handleRetry}
                className="w-full cursor-pointer px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 transform active:scale-95"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
