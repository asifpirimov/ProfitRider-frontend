import React, { useState } from 'react';
import { Check, AlertCircle, Crown, X, Loader } from 'lucide-react';
import api from '../utils/api';

const Subscription = () => {
    const [showWaitlistModal, setShowWaitlistModal] = useState(false);
    const [waitlistEmail, setWaitlistEmail] = useState('');
    const [waitlistLoading, setWaitlistLoading] = useState(false);
    const [waitlistSuccess, setWaitlistSuccess] = useState(false);
    const [waitlistError, setWaitlistError] = useState('');

    const handleWaitlistSubmit = async (e) => {
        e.preventDefault();
        setWaitlistLoading(true);
        setWaitlistError('');

        try {
            await api.post('/waitlist/', {
                email: waitlistEmail,
                source: 'subscription_page'
            });
            setWaitlistSuccess(true);
            setWaitlistEmail('');
            setTimeout(() => {
                setShowWaitlistModal(false);
                setWaitlistSuccess(false);
            }, 3000);
        } catch (error) {
            const errorMsg = error.response?.data?.errors?.email?.[0] ||
                error.response?.data?.message ||
                'Failed to join waitlist. Please try again.';
            setWaitlistError(errorMsg);
        } finally {
            setWaitlistLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            {/* Beta Notice Banner */}
            <div className="max-w-5xl mx-auto mb-8">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            🎉 Public Beta — Free Credits Available
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                            Billing is disabled during beta. You're using 300 free credits. Paid plans will launch after beta ends.
                        </p>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase text-sm mb-2">
                    Beta Pricing Preview
                </h2>
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl mb-4">
                    You're on <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Free Beta</span>
                </h1>
                <p className="text-xl text-slate-500 dark:text-slate-400">
                    Track sessions with 300 free credits. Paid plans with unlimited sessions coming soon.
                </p>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-5xl mx-auto grid gap-8 lg:grid-cols-2">

                {/* Starter (Free Beta) */}
                <div className="relative flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border-2 border-green-500/50 p-8 pt-10">
                    {/* Badge */}
                    <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
                        Current Plan
                    </div>

                    <div className="mb-4">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Starter (Free Beta)</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                            Everything you need to track sessions, costs, and earnings with confidence.
                        </p>
                    </div>

                    <div className="mb-8 flex items-baseline">
                        <span className="text-5xl font-extrabold text-slate-900 dark:text-white">
                            Free
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 ml-2">
                            / 300 credits
                        </span>
                    </div>

                    <ul className="space-y-4 mb-8 flex-1">
                        {[
                            '300 free credits (30 sessions)',
                            'Unlimited session logging',
                            'Basic analytics & insights',
                            'Cloud sync across devices',
                            'No credit card required'
                        ].map((feature) => (
                            <li key={feature} className="flex items-center text-slate-600 dark:text-slate-300">
                                <Check className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <button
                        disabled
                        className="w-full py-4 px-6 rounded-xl bg-green-600/20 text-green-700 dark:text-green-400 font-bold cursor-default border-2 border-green-500/30"
                    >
                        ✓ You're on Free Beta
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-4">
                        Start tracking sessions immediately with your free credits.
                    </p>
                </div>

                {/* Pro Plan (Coming Soon) */}
                <div className="relative flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 pt-10 opacity-90">
                    {/* Badge */}
                    <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
                        Coming Soon
                    </div>

                    <div className="mb-4">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            Pro <Crown size={20} className="text-yellow-400 fill-yellow-400" />
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                            Unlimited sessions and advanced features for serious couriers and fleet managers.
                        </p>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-baseline mb-2">
                            <span className="text-3xl font-extrabold text-slate-700 dark:text-slate-300">
                                Coming Soon
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Pricing will be announced after beta launch
                        </p>
                    </div>

                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center text-slate-600 dark:text-slate-300 font-medium">
                            <Check className="w-5 h-5 text-indigo-500 mr-3 shrink-0" />
                            Everything in Starter
                        </li>
                        {[
                            'Unlimited sessions (no credits)',
                            'Advanced analytics & reports',
                            'Priority support',
                            'Export to PDF/CSV',
                            'Tax estimation tools',
                            'Fleet management features'
                        ].map((feature) => (
                            <li key={feature} className="flex items-center text-slate-500 dark:text-slate-400">
                                <Check className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <button
                        disabled
                        className="w-full py-4 px-6 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold cursor-not-allowed border border-slate-300 dark:border-slate-600"
                    >
                        Coming After Launch
                    </button>

                    <div className="mt-4 text-center">
                        <p className="text-xs text-slate-400 mb-2">
                            Want early access when we launch?
                        </p>
                        <button
                            onClick={() => setShowWaitlistModal(true)}
                            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium underline"
                        >
                            Join the waitlist →
                        </button>
                    </div>
                </div>

            </div>

            {/* FAQ / Info Section */}
            <div className="max-w-3xl mx-auto mt-16 text-center">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Frequently Asked Questions
                </h3>
                <div className="space-y-4 text-left">
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                            How do credits work?
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Each session you log costs 10 credits. With 300 free credits, you can track 30 sessions during the beta period.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                            When will paid plans be available?
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            We'll launch paid plans after the public beta period. Early users will get special pricing and benefits.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                            What happens to my data when I upgrade?
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            All your session data and analytics will be preserved. You'll simply get unlimited sessions and advanced features.
                        </p>
                    </div>
                </div>
            </div>

            {/* Waitlist Modal */}
            {showWaitlistModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
                        <button
                            onClick={() => {
                                setShowWaitlistModal(false);
                                setWaitlistError('');
                                setWaitlistSuccess(false);
                            }}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            <X size={24} />
                        </button>

                        {waitlistSuccess ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    You're on the waitlist!
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    We'll notify you when paid plans launch.
                                </p>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    Join the Waitlist
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6">
                                    Be the first to know when Pro plans launch. We'll send you an email with early access pricing.
                                </p>

                                <form onSubmit={handleWaitlistSubmit}>
                                    <div className="mb-4">
                                        <label htmlFor="waitlist-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            id="waitlist-email"
                                            type="email"
                                            value={waitlistEmail}
                                            onChange={(e) => setWaitlistEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>

                                    {waitlistError && (
                                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
                                            {waitlistError}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={waitlistLoading}
                                        className="w-full py-3 px-6 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {waitlistLoading ? (
                                            <>
                                                <Loader className="animate-spin" size={20} />
                                                Joining...
                                            </>
                                        ) : (
                                            'Join Waitlist'
                                        )}
                                    </button>
                                </form>

                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">
                                    No spam, ever. Unsubscribe anytime.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Subscription;
