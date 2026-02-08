import React from 'react';
import { XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const BillingCancel = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 text-center animate-fadeIn">
                {/* Cancel Icon */}
                <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-6">
                    <XCircle className="w-10 h-10 text-slate-600 dark:text-slate-400" />
                </div>

                {/* Heading */}
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                    Checkout Canceled
                </h1>

                {/* Message */}
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                    No worries! Your subscription checkout was canceled. You can try again anytime you're ready.
                </p>

                {/* Info Box */}
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 mb-6 text-left">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Need Help?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        If you experienced any issues during checkout or have questions about our plans, feel free to contact our support team.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        to="/subscription"
                        className="flex-1 py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                    >
                        View Plans
                    </Link>
                    <Link
                        to="/dashboard"
                        className="flex-1 py-3 px-6 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-colors"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BillingCancel;
