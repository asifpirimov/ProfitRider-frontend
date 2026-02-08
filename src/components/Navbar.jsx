import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Moon, Sun, User, Menu } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
    const { user } = useContext(AuthContext);
    const [isDark, setIsDark] = useState(false);

    // Initialize theme state on mount
    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
    }, []);

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);

        if (newIsDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 fixed top-0 right-0 left-0 md:left-64 z-40">
            <div className="flex items-center md:hidden">
                <button onClick={toggleSidebar} className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                    <Menu size={20} />
                </button>
                <span className="ml-3 font-semibold text-lg text-slate-900 dark:text-white">ProfitRider</span>
            </div>

            <div className="hidden md:flex items-center text-slate-500 dark:text-slate-400 text-sm">
                {user?.email}
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Toggle Theme"
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.username}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{user?.profile?.transport_type || 'Courier'}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                        <User size={18} className="text-slate-600 dark:text-slate-400" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
