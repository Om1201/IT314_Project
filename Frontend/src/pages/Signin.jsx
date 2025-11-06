import { useState } from 'react';
import { Code, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { forgotPassword, signinUser } from '../features/userSlicer';
import { fetchUserRoadmaps } from '../features/roadmapSlicer';

export default function Signin() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            setIsLoading(true);
            let response = await dispatch(signinUser({ email, password }));
            response = response.payload;
            if (response.message == 'User exists, No password found') {
                toast.error('Please configure your password with forgot password');
                return;
            }
            if (!response.success) {
                toast.error(response.message || 'Signin failed. Please try again.');
                setIsLoading(false);
                return;
            }
            toast.success('Signin successful');
            await dispatch(fetchUserRoadmaps());
            await new Promise(resolve => setTimeout(resolve, 1000));
            // await setTimeout(() => {
            navigate('/', { replace: true });
            // }, 1000);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
        setIsLoading(false);
    };

    const handleOauthGoogle = () => {
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/oauth/google/login`;
    };

    const handleforgotpass = async e => {
        e.preventDefault();

        try {
            let response = await dispatch(forgotPassword({ email }));
            response = response.payload;
            if (!response.success) {
                toast.error(response.message || 'Error in sending reset link. Please try again.');
                return;
            }
            toast.success('Password reset link is sent to your email');
        } catch (err) {
            toast.error(err.response.data.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-tr from-slate-800 via-blue-900 to-slate-600 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-slate-950/50 border border-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-8">
                    <div className="space-y-3 text-center">
                        <div
                            onClick={() => {
                                navigate('/');
                            }}
                            className="flex cursor-pointer items-center justify-center space-x-2 mb-6"
                        >
                            <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
                                <Code className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-semibold text-white tracking-tight">
                                CodeLearn
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-white leading-tight">
                            Welcome Back
                        </h1>
                        <p className="text-sm text-gray-400">
                            Sign in to continue your coding journey
                        </p>
                    </div>

                    <div className="space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="block text-xs font-semibold text-gray-200 uppercase tracking-wide"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all duration-200 hover:border-slate-600/50 text-sm"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="password"
                                    className="block text-xs font-semibold text-gray-200 uppercase tracking-wide"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 focus:outline-none pr-12 transition-all duration-200 hover:border-slate-600/50 text-sm"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors duration-200 p-1"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={handleforgotpass}
                                    type="button"
                                    className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <button
                                type="submit"
                                className="w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:shadow-none cursor-pointer px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-blue-50 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform active:scale-95 text-sm mt-1"
                                disabled={!email || !password || isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex justify-center items-center gap-1">
                                        <Loader2 className="h-5 w-5 animate-spin" /> Signing In
                                    </div>
                                ) : (
                                    <>Sign In</>
                                )}
                            </button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-700/50" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="px-2 text-gray-400 font-medium">or continue</span>
                            </div>
                        </div>

                        <div className="grid cursor-pointer grid-cols-1 gap-4">
                            <button
                                onClick={handleOauthGoogle}
                                className="w-full cursor-pointer px-6 py-3 border border-slate-700/50 text-white hover:bg-slate-900/40 bg-slate-900/20 hover:border-blue-500/50 transition-all duration-300 rounded-lg hover:shadow-lg hover:shadow-blue-500/10 flex items-center justify-center font-medium text-sm backdrop-blur-sm"
                            >
                                <img
                                    src="images/google.png"
                                    className="h-4 pr-2"
                                    alt="google logo"
                                />
                                Continue with Google
                            </button>
                        </div>

                        <div className="text-center text-sm text-gray-400">
                            {"Don't have an account? "}
                            <Link
                                to={'/signup'}
                                className="text-white cursor-pointer hover:text-blue-400 font-semibold transition-colors duration-200"
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
