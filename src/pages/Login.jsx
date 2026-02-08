import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Apple } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import LoadingOverlay from '../components/LoadingOverlay';

const Login = () => {
    const { socialLogin } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const googleLoginHelper = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                setLoading(true);
                await socialLogin(tokenResponse.code);
                navigate('/dashboard');
            } catch (err) {
                console.error("Google login failed", err);
                setError('Google login failed. Please try again.');
                setLoading(false);
            }
        },
        onError: () => {
            setError('Google login failed');
            setLoading(false);
        },
        flow: 'auth-code',
    });

    const handleAppleLogin = () => {
        // TODO: Implement Apple Sign-In when backend is ready
        setError('Apple Sign-In coming soon');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans">
            <LoadingOverlay isLoading={loading} message="Signing you in securely..." />
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-12 xl:p-24 relative z-10 bg-white dark:bg-slate-950 shadow-2xl lg:shadow-none">
                {/* Mobile Background Elements (subtle) */}
                <div className="lg:hidden absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>

                <div className="max-w-sm mx-auto w-full">
                    {/* Logo / Brand */}
                    <div className="mb-10">
                        <Link to="/" className="inline-block">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                                ProfitRider
                            </h1>
                        </Link>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Welcome back</h2>
                        <p className="text-slate-500 dark:text-slate-400">
                            Sign in securely with your preferred account.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-800/50 flex items-start gap-3">
                            <div className="mt-0.5">⚠️</div>
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Google Sign-In */}
                        <button
                            type="button"
                            onClick={() => {
                                setLoading(true);
                                googleLoginHelper();
                            }}
                            disabled={loading}
                            className="w-full py-4 px-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-all flex items-center justify-center gap-3 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6 relative z-10" alt="Google" />
                            <span className="relative z-10 text-base">Continue with Google</span>
                        </button>

                        {/* Apple Sign-In (Coming Soon) */}
                        <button
                            type="button"
                            onClick={handleAppleLogin}
                            disabled={loading}
                            className="w-full py-4 px-4 bg-slate-900 dark:bg-white border-2 border-slate-900 dark:border-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-medium rounded-xl transition-all flex items-center justify-center gap-3 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Apple className="w-6 h-6 relative z-10" />
                            <span className="relative z-10 text-base">Continue with Apple</span>
                        </button>

                        {/* Security Notice */}
                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
                            <p className="text-xs text-blue-600 dark:text-blue-400 text-center leading-relaxed">
                                🔒 We use secure OAuth authentication. Your credentials are never stored on our servers.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline decoration-2 underline-offset-2 transition-all">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer Copyright - Optional */}
                <div className="hidden lg:block absolute bottom-8 left-12 right-12 text-xs text-slate-400 dark:text-slate-600 text-center lg:text-left">
                    © {new Date().getFullYear()} ProfitRider. All rights reserved.
                </div>
            </div>

            {/* Right Side - Visual Panel (Desktop Only) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center">

                {/* Background Gradients/Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900"></div>

                {/* Abstract Blobs */}
                <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]"></div>

                {/* Glass Card content */}
                <div className="relative z-10 p-12 max-w-lg text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mx-auto mb-8 shadow-2xl shadow-blue-500/30 flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform duration-500">
                        <LogIn className="text-white" size={40} />
                    </div>

                    <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                        Track Every Mile. <br />
                        <span className="text-blue-400">Maximize Every Session.</span>
                    </h2>

                    <p className="text-lg text-slate-300 leading-relaxed max-w-md mx-auto mb-10">
                        Join thousands of delivery couriers who rely on ProfitRider to track earnings, manage expenses, and optimize their daily routes.
                    </p>

                    {/* Social Proof / Stats pill */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-xl">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className={`w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px] text-white font-medium`}>
                                    {/* Placeholder avatars */}
                                    <div className={`w-full h-full rounded-full bg-gradient-to-br ${i === 1 ? 'from-purple-500 to-indigo-500' : i === 2 ? 'from-blue-500 to-cyan-500' : 'from-pink-500 to-rose-500'}`}></div>
                                </div>
                            ))}
                        </div>
                        <span className="text-sm font-medium text-white px-2">Trusted by 2,000+ couriers</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
