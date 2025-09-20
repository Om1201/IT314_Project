import { useState } from "react";
import axios from "axios";

import { Code, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

export default function Signin() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    
  const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        const result = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/signin`,
          { email, password },
          { withCredentials: true }
        );

        if (!result.data.success) {
          alert(result.data.message || "Something went wrong!");
        } else {
          window.location.href = "/";
        }
      } catch (err) {
        console.log(err);
        alert(err.response?.data?.message || "Something went wrong!");
      }
  };



  const handleOauthGoogle = ()=> {
      window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/oauth/google/login`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-blue-900/20 hover:shadow-blue-900/30 transition-all duration-500 p-8">
          <div className="space-y-1 text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="relative">
                <Code className="h-10 w-10 text-blue-400 drop-shadow-lg" />
                <div className="absolute inset-0 h-10 w-10 bg-blue-400/20 rounded-lg blur-xl animate-pulse"></div>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                CodeLearn
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-slate-300">
              Sign in to continue your coding journey
            </p>
          </div>

          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-200"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-400 focus:bg-slate-700 transition-all duration-300 hover:border-blue-400 hover:shadow-md"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-200"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <button
                type="submit"
                className="w-full cursor-pointer px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 transform active:scale-95"
              >
                Sign In
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-3 text-slate-400 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid cursor-pointer grid-cols-1 gap-4">
              <button onClick={handleOauthGoogle} className="w-full px-6 py-3 border border-slate-600 text-slate-200 hover:bg-slate-800 bg-slate-800/50 hover:border-blue-400 transition-all duration-300 rounded-xl hover:shadow-md flex items-center justify-center font-medium group">
                <img src="images/google.png" className="h-5 pr-2" alt="google logo" />
                Continue with Google
              </button>
            </div>

            <div className="text-center text-sm text-slate-300">
              {"Don't have an account? "}
              <Link
                to={"/signup"}
                className="text-blue-400 cursor-pointer hover:text-blue-300 font-semibold transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
