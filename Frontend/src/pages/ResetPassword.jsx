import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, Shield, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../features/userSlicer';
import { useSelector } from 'react-redux';
import { setTempEmail } from '../features/userSlicer';

export default function PasswordReset() {
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const tempemail = useSelector(state => state.user.tempemail);

    useEffect(() => {
        const verifyResetToken = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const tokenParam = urlParams.get('token');
                // const emailParam = urlParams.get("email")

                if (!tokenParam) {
                    setStatus('error');
                    setMessage('Reset link is invalid.');
                    toast.error('Reset link is invalid');
                    return;
                }

                setToken(tokenParam);
                // setEmail(emailParam)

                const body = { token: tokenParam };

                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-reset-token`,
                    body
                );

                await dispatch(setTempEmail({ tempemail: response.data.email }));
                setStatus('verified');
                setMessage('Link verified successfully. Please enter your new password.');
                toast.success('Verification completed. Please enter your new password');
            } catch (error) {
                toast.error(error.response.data.message || 'Verification failed');
                setStatus('error');
                setMessage('Reset link is invalid or has expired.');
            }
        };

        verifyResetToken();
    }, []);

    const handleInputChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            toast.error('Password do not match');
            return;
        }

        try {
            let response = await dispatch(
                resetPassword({ email: tempemail, newPassword: formData.password, token })
            );
            response = response.payload;
            if (!response.success) {
                toast.error(response.message || 'Password reset failed');
                return;
            }
            toast.success('Password reset successfully');

            setTimeout(() => {
                navigate('/signin', { replace: true });
            }, 500);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Password reset failed');
            setStatus('verified');
            setMessage('Link verified successfully. Please enter your new password.');
        }
        setIsLoading(false);
    };

    const handleRetry = () => {
        setStatus('loading');
        setMessage('');
        window.location.reload();
    };

return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-800 via-cyan-900 to-slate-600 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
            <div className="bg-slate-950/50 border border-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-8">
                <div className="space-y-3 text-center">
                    <div className="flex cursor-pointer items-center justify-center space-x-2 mb-6">
                        <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
                            <Shield className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-semibold text-white tracking-tight">CodeLearn</span>
                    </div>

                    <h1 className="text-3xl font-bold text-white leading-tight">Reset Password</h1>

                    <p className="text-sm text-gray-400">
                        {status === 'loading'
                            ? 'Verifying reset link...'
                            : status === 'verified'
                            ? 'Enter your new password'
                            : 'Password Reset'}
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="flex flex-col items-center space-y-4">
                        {status === 'loading' && (
                            <div className="flex items-center space-x-3">
                                <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
                                <span className="text-gray-300 text-sm">Verifying reset link...</span>
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="flex items-center space-x-3">
                                <CheckCircle className="h-6 w-6 text-green-400" />
                                <span className="text-green-400 font-semibold text-sm">Password Reset Successful!</span>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="flex items-center space-x-3">
                                <XCircle className="h-6 w-6 text-red-400" />
                                <span className="text-red-400 font-semibold text-sm">Reset Failed</span>
                            </div>
                        )}
                    </div>

                    <div className="text-center">
                        <p className="text-gray-300 text-sm">{message}</p>
                    </div>

                    {status === 'verified' && (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-xs font-semibold text-gray-200 uppercase tracking-wide">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 focus:outline-none pr-12 transition-all duration-200 hover:border-slate-600/50 text-sm"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors duration-200 p-1"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-200 uppercase tracking-wide">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 focus:outline-none pr-12 transition-all duration-200 hover:border-slate-600/50 text-sm"
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
                                className="w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:shadow-none cursor-pointer px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-blue-50 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform active:scale-95 text-sm mt-1"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex justify-center items-center gap-1">
                                        <Loader2 className="h-5 w-5 animate-spin" /> Submitting...
                                    </div>
                                ) : (
                                    <>Submit</>
                                )}
                            </button>
                        </form>
                    )}

                    {status === 'error' && (
                        <button
                            onClick={handleRetry}
                            className="w-full cursor-pointer px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-blue-50 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform active:scale-95 text-sm"
                        >
                            Try Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    </div>
);

}
