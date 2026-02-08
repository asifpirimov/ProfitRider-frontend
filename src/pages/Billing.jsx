import React, { useState, useEffect } from 'react';
import { CreditCard, TrendingUp, Calendar, AlertCircle, Crown, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import useBillingInfo from '../hooks/useBillingInfo';
import Toast from '../components/Toast';

const Billing = () => {
    const navigate = useNavigate();
    const { billingInfo, loading: billingLoading } = useBillingInfo();

    const [sessionsThisMonth, setSessionsThisMonth] = useState(0);
    const [creditsUsedThisMonth, setCreditsUsedThisMonth] = useState(0);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchUsageStats();
    }, []);

    const fetchUsageStats = async () => {
        try {
            setLoading(true);
            // Get sessions from current month
            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const response = await api.get('/sessions/', {
                params: {
                    start_date: firstDayOfMonth.toISOString().split('T')[0]
                }
            });

            const sessions = response.data.results || [];
            setSessionsThisMonth(sessions.length);
            setCreditsUsedThisMonth(sessions.length * 10);
        } catch (error) {
            console.error('Error fetching usage stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    if (billingLoading || loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Loading billing information...</p>
                </div>
            </div>
        );
    }

    const isPro = billingInfo?.is_pro || false;
    const hasActiveSubscription = billingInfo?.subscription_status === 'active';
    const billingEnabled = billingInfo?.billing_enabled || false;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        Billing & Plan
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Manage your subscription and view usage statistics
                    </p>
                </div>

                {/* Current Plan Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                {billingInfo?.plan_display || 'Starter (Free Beta)'}
                                {isPro && <Crown size={20} className="text-yellow-400 fill-yellow-400" />}
                            </h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                {isPro ? 'Unlimited sessions and advanced features' : 'Credit-based free tier'}
                            </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${isPro
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                            }`}>
                            {isPro ? 'Active' : 'Beta'}
                        </div>
                    </div>

                    {!isPro && (
                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                        Public Beta Period
                                    </p>
                                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                        You're using the free beta version with 300 credits. Paid plans will be available after launch.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Credit Usage Card (for non-Pro users) */}
                {!isPro && (
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                Credit Usage
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Credits Remaining */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                                    Credits Remaining
                                </p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {billingInfo?.credits_remaining || 0}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    of {billingInfo?.credits_total || 300} total
                                </p>
                                {/* Progress bar */}
                                <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all ${(billingInfo?.credits_remaining || 0) <= 10
                                                ? 'bg-red-500'
                                                : (billingInfo?.credits_remaining || 0) <= 50
                                                    ? 'bg-amber-500'
                                                    : 'bg-green-500'
                                            }`}
                                        style={{
                                            width: `${((billingInfo?.credits_remaining || 0) / (billingInfo?.credits_total || 300)) * 100}%`
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Sessions This Month */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                                    Sessions This Month
                                </p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {sessionsThisMonth}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {Math.floor((billingInfo?.credits_remaining || 0) / 10)} sessions remaining
                                </p>
                            </div>

                            {/* Credits Used */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                                    Credits Used
                                </p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {creditsUsedThisMonth}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    this month
                                </p>
                            </div>
                        </div>

                        {(billingInfo?.credits_remaining || 0) <= 50 && (
                            <div className={`mt-4 p-3 rounded-lg border ${(billingInfo?.credits_remaining || 0) <= 10
                                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                    : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                                }`}>
                                <p className={`text-sm font-medium ${(billingInfo?.credits_remaining || 0) <= 10
                                        ? 'text-red-900 dark:text-red-100'
                                        : 'text-amber-900 dark:text-amber-100'
                                    }`}>
                                    {(billingInfo?.credits_remaining || 0) <= 10
                                        ? '⚠️ Low credits! You have less than 10 credits remaining.'
                                        : '⚡ Running low on credits. Consider upgrading when paid plans launch.'
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Billing Status Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            Billing Status
                        </h2>
                    </div>

                    {!billingEnabled && !hasActiveSubscription ? (
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                        Billing is disabled during beta
                                    </p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                        Paid plans with unlimited sessions and advanced features will be available after the public beta launch.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => navigate('/subscription')}
                                    className="flex-1 px-4 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                                >
                                    View Pricing Plans
                                </button>
                                <button
                                    onClick={() => navigate('/contact-support')}
                                    className="flex-1 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                                >
                                    Join Waitlist <ExternalLink size={16} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                                        Status
                                    </p>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                        Active Subscription
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                                        Next Billing Date
                                    </p>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                        {billingInfo?.subscription_ends_at || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Invoice History Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            Invoice History
                        </h2>
                    </div>

                    <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                        <p className="text-slate-600 dark:text-slate-400 font-medium">
                            No invoices during beta
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                            Invoice history will appear here when you upgrade to a paid plan.
                        </p>
                    </div>
                </div>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default Billing;
