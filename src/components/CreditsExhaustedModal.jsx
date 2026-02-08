import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreditsExhaustedModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mb-4">
                        <AlertCircle size={32} className="text-blue-600 dark:text-blue-500" />
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        You've reached your free limit
                    </h2>

                    <p className="text-slate-600 dark:text-slate-400 mb-2">
                        You've used all 300 free credits. Great job tracking your sessions!
                    </p>

                    <p className="text-sm text-slate-500 dark:text-slate-500 mb-6">
                        Paid plans with unlimited sessions are coming soon after our public beta launch.
                    </p>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                        >
                            Got it
                        </button>
                        <button
                            onClick={() => navigate('/subscription')}
                            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            View Plans
                        </button>
                    </div>

                    <p className="text-xs text-slate-400 mt-4">
                        Thank you for being an early user! 🙏
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CreditsExhaustedModal;
