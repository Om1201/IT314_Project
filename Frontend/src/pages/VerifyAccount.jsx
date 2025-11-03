import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, Shield } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function VerifyAccount() {
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAccount = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const token = urlParams.get('token');
                // const email = urlParams.get("email");

                const body = { token: token };

                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-account`,
                    body,
                    {
                        withCredentials: true,
                    }
                );

                setStatus('success');
                setMessage('Account verified successfully! Redirecting to home...');
                toast.success('Account verified successfully');

                await setTimeout(() => {
                    navigate('/signin', { replace: true });
                }, 2000);
            } catch (error) {
                toast.error(error.response.data.message);
                setStatus('error');
                setMessage('Verification link is invalid or has expired.');
            }
        };

        verifyAccount();
    }, []);

    const handleRetry = () => {
        setStatus('loading');
        setMessage('');
        window.location.reload();
    };

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
                        <h1 className="text-3xl font-bold text-white mb-2">Account Verification</h1>
                        <p className="text-slate-300">Verifying your account...</p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex flex-col items-center space-y-4">
                            {status === 'loading' && (
                                <div className="flex items-center space-x-3">
                                    <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
                                    <span className="text-slate-300">
                                        Verifying your account...
                                    </span>
                                </div>
                            )}

                            {status === 'success' && (
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="h-8 w-8 text-green-400" />
                                    <span className="text-green-400 font-semibold">
                                        Verification Successful!
                                    </span>
                                </div>
                            )}

                            {status === 'error' && (
                                <div className="flex items-center space-x-3">
                                    <XCircle className="h-8 w-8 text-red-400" />
                                    <span className="text-red-400 font-semibold">
                                        Verification Failed
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="text-center">
                            <p className="text-slate-300">{message}</p>
                        </div>

                        {status === 'error' && (
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
    );
}
