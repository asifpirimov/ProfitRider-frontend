import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const BillingSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 text-center animate-fadeIn">
                {/* Success Icon */}
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>

                {/* Heading */}
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                    Subscription Successful!
                </h1>

                {/* Message */}
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                    Thank you for subscribing to ProfitRider Standard. Your account has been upgraded and you now have access to all premium features.
                </p>

                {/* Session Info (optional) */}
                {sessionId && (
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 mb-6">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono break-all">
                            Session ID: {sessionId}
                        </p>
                    </div>
                )}

                {/* Info Box */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 text-left">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">What's Next?</h3>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• Your subscription is now active</li>
                        <li>• You'll receive a confirmation email shortly</li>
                        <li>• Manage your subscription anytime in Billing</li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        to="/dashboard"
                        className="flex-1 py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                    >
                        Go to Dashboard
                    </Link>
                    <Link
                        to="/billing"
                        className="flex-1 py-3 px-6 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-colors"
                    >
                        View Billing
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BillingSuccess;
