import { useState } from 'react';
import { Code, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { signupUser } from '../features/userSlicer';

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = async e => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Password do not match');
            return;
        }
        const body = {
            name,
            email,
            password,
        };
        try {
            // const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, body);
            let response = await dispatch(signupUser(body));
            response = response.payload;
            if (response.success) {
                toast.success(response.message);
                // Clear form fields after successful registration
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            } else {
                toast.error(response.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            if (err.response?.message) {
                toast.error(err.response.message);
            } else {
                toast.error('An error occurred during registration. Please try again.');
            }
        }
    };

    const handleOauthGoogle = () => {
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
                        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                        <p className="text-slate-300">Join us and start your coding journey</p>
                    </div>

                    <div className="space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-semibold text-slate-200"
                                >
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-400 focus:bg-slate-700 transition-all duration-300 hover:border-blue-400 hover:shadow-md"
                                    required
                                />
                            </div>

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
                                    onChange={e => setEmail(e.target.value)}
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
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Create a password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
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

                            <div className="space-y-2">
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-semibold text-slate-200"
                                >
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-400 focus:bg-slate-700 pr-12 transition-all duration-300 hover:border-blue-400 hover:shadow-md"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-0 top-0 h-full px-4 py-3 text-slate-400 hover:text-blue-400 transition-colors duration-200"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full cursor-pointer px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 transform active:scale-95"
                            >
                                Create Account
                            </button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-600" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-slate-900 px-3 text-slate-400 font-medium">
                                    Or
                                </span>
                            </div>
                        </div>

                        <div className="grid cursor-pointer grid-cols-1 gap-4">
                            <button
                                onClick={handleOauthGoogle}
                                className="w-full px-6 py-3 border border-slate-600 text-slate-200 hover:bg-slate-800 bg-slate-800/50 hover:border-blue-400 transition-all duration-300 rounded-xl hover:shadow-md flex items-center justify-center font-medium group cursor-pointer"
                            >
                                <img
                                    src="images/google.png"
                                    className="h-5 pr-2"
                                    alt="google logo"
                                />
                                Continue with Google
                            </button>
                        </div>

                        <div className="text-center text-sm text-slate-300">
                            {'Already have an account? '}
                            <Link
                                to={'/signin'}
                                className="text-blue-400 cursor-pointer hover:text-blue-300 font-semibold transition-colors"
                            >
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
