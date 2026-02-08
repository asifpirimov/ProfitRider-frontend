import React, { useContext, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useBilling } from '../context/BillingContext';
import {
    LayoutDashboard,
    PlusCircle,
    History,
    Settings,
    LogOut,
    TrendingUp,
    Crown,

    CreditCard,
    Shield,
    Book,
    Lock,
    LifeBuoy,
    FileText,
    ChevronDown,
    ChevronRight,
} from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const { billingInfo } = useBilling();
    const location = useLocation();
    const [isLegalOpen, setIsLegalOpen] = useState(false);

    // Get credit info from billing context (fallback to user profile)
    const creditsRemaining = billingInfo?.credits_remaining ?? user?.profile?.credits ?? 0;
    const creditsTotal = billingInfo?.credits_total ?? 300;
    const isPro = billingInfo?.is_pro ?? false;

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/add-session', icon: PlusCircle, label: 'Add Session' },
        { path: '/history', icon: History, label: 'History' },
        { path: '/subscription', icon: Crown, label: 'Upgrade' },
        { path: '/billing', icon: CreditCard, label: 'Billing' },
        { path: '/profile', icon: Settings, label: 'Profile' },
    ];

    const legalItems = [
        { path: '/privacy-policy', icon: Shield, label: 'Privacy' },
        { path: '/terms-of-service', icon: Book, label: 'Terms' },
        { path: '/security', icon: Lock, label: 'Security' },
        { path: '/refund-policy', icon: FileText, label: 'Refunds' },
        { path: '/contact', icon: LifeBuoy, label: 'Support' },
    ];

    return (
        <aside className="hidden md:flex flex-col w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 fixed left-0 top-0 z-50 overflow-hidden">
            {/* Header & Nav - Takes available space */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <TrendingUp size={24} className="text-white" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            ProfitRider
                        </h1>
                    </div>
                </div>

                {/* Credit Balance Display */}
                <div className="mb-6 px-1">
                    <div className={`rounded-lg p-2 border ${!isPro && creditsRemaining <= 10
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                        : !isPro && creditsRemaining <= 50
                            ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'
                        }`}>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-semibold uppercase text-slate-400">Usage Credits</span>
                            {!isPro && creditsRemaining <= 10 && (
                                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase">⚠️ Low</span>
                            )}
                            {!isPro && creditsRemaining > 10 && creditsRemaining <= 50 && (
                                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">⚡ Running Low</span>
                            )}
                        </div>
                        <div className="flex items-end gap-1">
                            {isPro ? (
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Unlimited</span>
                            ) : (
                                <>
                                    <span className={`text-sm font-bold ${creditsRemaining <= 10
                                        ? 'text-red-600 dark:text-red-400'
                                        : creditsRemaining <= 50
                                            ? 'text-amber-600 dark:text-amber-400'
                                            : 'text-slate-700 dark:text-slate-200'
                                        }`}>{creditsRemaining} / {creditsTotal}</span>
                                    <span className="text-xs text-slate-400 mb-0.5">({Math.floor(creditsRemaining / 10)} sessions)</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <nav className="space-y-2 mb-8">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                                    isActive
                                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                                )}
                            >
                                <Icon size={20} className={clsx(
                                    isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                                )} />
                                {item.label}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Legal Section Dropdown */}
                <div className="mb-2">
                    <button
                        onClick={() => setIsLegalOpen(!isLegalOpen)}
                        className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-600 dark:hover:text-slate-300 transition-colors group"
                    >
                        <span>Legal & Support</span>
                        {isLegalOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>

                    {isLegalOpen && (
                        <nav className="space-y-1 mt-1 pl-2">
                            {legalItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;
                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        className={clsx(
                                            "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 group text-sm",
                                            isActive
                                                ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                                                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                                        )}
                                    >
                                        <Icon size={16} className={clsx(
                                            isActive ? "text-slate-600 dark:text-slate-300" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                                        )} />
                                        {item.label}
                                    </NavLink>
                                );
                            })}
                        </nav>
                    )}
                </div>
            </div>

            {/* Footer / Logout - Fixed at bottom */}
            <div className="flex-shrink-0 p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
