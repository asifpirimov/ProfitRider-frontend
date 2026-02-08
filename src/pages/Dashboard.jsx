import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import KPICard from '../components/KPICard';
import MetricWidget from '../components/MetricWidget';
import ProfitChart from '../components/ProfitChart';
import EarningsVsCostsChart from '../components/EarningsVsCostsChart';
import {
    DollarSign,
    Wallet,
    CreditCard,
    Clock,
    Navigation,
    ShoppingBag,
    Calendar,
    RefreshCw
} from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [period, setPeriod] = useState('week'); // today, week, month
    const [lastFetch, setLastFetch] = useState(Date.now());

    const fetchData = async () => {
        setLoading(true);
        try {
            // Get local YYYY-MM-DD
            const localDate = new Date().toLocaleDateString('en-CA'); // 'en-CA' gives YYYY-MM-DD format
            const response = await api.get(`/dashboard/?period=${period}&local_date=${localDate}`);
            setData(response.data);
            setLastFetch(Date.now());
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [period]);

    // Refresh data when component becomes visible (only if stale)
    useEffect(() => {
        const FIVE_MINUTES = 5 * 60 * 1000;

        const handleVisibilityChange = () => {
            const isStale = Date.now() - lastFetch > FIVE_MINUTES;
            if (!document.hidden && isStale) {
                fetchData();
            }
        };

        const handleFocus = () => {
            const isStale = Date.now() - lastFetch > FIVE_MINUTES;
            if (isStale) {
                fetchData();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
        };
    }, [period, lastFetch]);

    const formatCurrency = (val) => {
        // Use country_details for symbol
        const symbol = user?.profile?.country_details?.currency_symbol || user?.profile?.country?.currency_symbol || '$';
        return `${symbol}${parseFloat(val).toFixed(2)}`;
    };

    const formatNumber = (val) => parseFloat(val).toFixed(2);

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Fallback for null data
    const safeData = data || {
        total_net_profit: 0,
        total_earnings: 0,
        total_costs: 0,
        avg_profit_per_hour: 0,
        profit_per_km: 0, // Not in API response? Wait, I didn't add it to response explicitly?
        // Let's check API response structure again.
        // DashboardMetricsView API response:
        // 'avg_profit_per_hour': ..., 
        // 'total_distance_km': ..., 
        // But profit_per_km needs calculation if avg is needed?
        // Ah, I set 'avg_profit_per_hour' in separate fields.
        // I should calculate profit/km here or add to API.
        // API returns 'total_net_profit' and 'total_distance_km'.
        chart_data: [],
        recent_sessions: []
    };

    // Quick calc for missing per-unit metrics if API doesn't send them directly
    const profitPerKm = safeData.total_distance_km > 0 ? safeData.total_net_profit / safeData.total_distance_km : 0;
    const profitPerOrder = safeData.session_count > 0 ? safeData.total_net_profit / safeData.session_count : 0; // rough proxy, logic might need total_orders count from sessions

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400">Welcome back, {user?.username}!</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                        title="Refresh data"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700 shadow-sm">
                        {['today', 'week', 'month'].map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${period === p
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                                    }`}
                            >
                                {p.charAt(0).toUpperCase() + p.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPICard
                    title="Net Profit"
                    value={formatCurrency(safeData.total_net_profit)}
                    icon={DollarSign}
                    color="blue"
                // trend="up" trendValue="12%" // Would need historical comparison logic
                />
                <KPICard
                    title="Total Earnings"
                    value={formatCurrency(safeData.total_earnings)}
                    icon={Wallet}
                    color="green"
                />
                <KPICard
                    title="Total Costs"
                    value={formatCurrency(safeData.total_costs)}
                    icon={CreditCard}
                    color="purple"
                />
            </div>

            {/* Widgets & Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart - Takes up 2 cols */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-slate-800 dark:text-white">Profit Trend</h3>
                    </div>
                    <ProfitChart data={safeData.chart_data} />
                </div>

                {/* Modular Metric Widgets - Takes up 1 col */}
                <div className="space-y-4">
                    <MetricWidget
                        title="Profit / Hour"
                        value={formatCurrency(safeData.avg_profit_per_hour)}
                        unit="/ hr"
                        icon={Clock}
                        color="orange"
                    />
                    <MetricWidget
                        title="Profit / Km"
                        value={formatCurrency(profitPerKm)}
                        unit="/ km"
                        icon={Navigation}
                        color="indigo"
                    />
                    <MetricWidget
                        title="Profit / Order (Est)"
                        value={formatCurrency(profitPerOrder)}
                        unit="/ order"
                        icon={ShoppingBag}
                        color="cyan"
                    />
                </div>
            </div>

            {/* Secondary Chart & Recent Sessions Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-slate-800 dark:text-white">Earnings vs Costs</h3>
                    </div>
                    <EarningsVsCostsChart data={safeData.chart_data?.map(item => ({
                        name: item.date || item.name || 'N/A',
                        earnings: parseFloat(item.earnings) || 0,
                        costs: parseFloat(item.costs) || 0
                    }))} />
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-800 dark:text-white">Recent Activity</h3>
                        <button className="text-sm text-blue-600 hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        {/* Abstract away list into component later */}
                        <div className="space-y-4">
                            {safeData.recent_sessions && safeData.recent_sessions.length > 0 ? (
                                safeData.recent_sessions.map(session => (
                                    <div key={session.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                                <Calendar size={18} />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-slate-800 dark:text-white">{session.platform_details?.name || 'Session'}</h4>
                                                <p className="text-xs text-slate-500">{new Date(session.date).toLocaleDateString()} • {session.duration_hours}h</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold text-green-600 dark:text-green-400">
                                                +{formatCurrency(session.net_profit)}
                                            </div>
                                            <p className="text-xs text-slate-400">{formatCurrency(session.total_earnings)} earning</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-slate-500 text-center py-8">
                                    Start adding sessions to see your recent activity here.
                                    <div className="mt-4">
                                        <a href="/add-session" className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-blue-100">
                                            Add Session
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
