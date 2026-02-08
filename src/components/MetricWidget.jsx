import React from 'react';

const MetricWidget = ({ title, value, unit, icon: Icon, color }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
            <div className={`p-3 rounded-full bg-${color}-50 dark:bg-${color}-900/20 text-${color}-600 dark:text-${color}-400`}>
                <Icon size={20} />
            </div>
            <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium">{title}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                    {value} <span className="text-sm font-normal text-slate-400">{unit}</span>
                </p>
            </div>
        </div>
    );
};

export default MetricWidget;
