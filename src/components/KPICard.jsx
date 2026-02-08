import React from 'react';
import clsx from 'clsx';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const KPICard = ({ title, value, icon: Icon, trend, trendValue, color }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
                </div>
                <div className={clsx("p-3 rounded-lg bg-opacity-10 dark:bg-opacity-20",
                    color === 'blue' ? "bg-blue-500 text-blue-600 dark:text-blue-400" :
                        color === 'green' ? "bg-green-500 text-green-600 dark:text-green-400" :
                            color === 'purple' ? "bg-purple-500 text-purple-600 dark:text-purple-400" :
                                "bg-slate-500 text-slate-600 dark:text-slate-400"
                )}>
                    <Icon size={24} />
                </div>
            </div>

            {trend && (
                <div className="flex items-center gap-1 text-sm">
                    {trend === 'up' ? (
                        <ArrowUpRight size={16} className="text-green-500" />
                    ) : (
                        <ArrowDownRight size={16} className="text-red-500" />
                    )}
                    <span className={trend === 'up' ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                        {trendValue}
                    </span>
                    <span className="text-slate-400 ml-1">vs yesterday</span>
                </div>
            )}
        </div>
    );
};

export default KPICard;
