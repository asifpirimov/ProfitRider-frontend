import React from 'react';

const LoadingOverlay = ({ isLoading, message = "Loading..." }) => {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 flex flex-col items-center shadow-2xl border border-slate-200 dark:border-slate-700 max-w-sm w-full mx-4">
                {/* Modern Spinner */}
                <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center animate-pulse">
                    {message}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                    Please wait a moment
                </p>
            </div>
        </div>
    );
};

export default LoadingOverlay;
