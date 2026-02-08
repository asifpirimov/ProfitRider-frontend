import React from 'react';
import { Mail, MessageSquare, Clock } from 'lucide-react';

const Contact = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 font-sans text-slate-900 dark:text-slate-100">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">Contact Support</h1>

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-800">
                    <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 text-center">
                        Have questions or need help? We're here for you.
                    </p>

                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="flex flex-col items-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                <Mail size={24} />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Email Us</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">For general inquiries and support</p>
                            <a href="mailto:support@profitrider.com" className="text-blue-600 font-medium hover:underline">
                                support@profitrider.com
                            </a>
                        </div>

                        <div className="flex flex-col items-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                                <Clock size={24} />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Response Time</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">We usually respond within</p>
                            <span className="font-medium">24 - 48 hours</span>
                        </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
                        <h3 className="font-semibold mb-4">Common Questions?</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Check our <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> or <a href="/refund-policy" className="text-blue-600 hover:underline">Refund Policy</a> for quick answers about billing and accounts.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
