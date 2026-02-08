import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Calendar, DollarSign, Clock, MapPin, Trash2 } from 'lucide-react';

const History = () => {
    const { user } = useContext(AuthContext);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const formatCurrency = (val) => {
        const symbol = user?.profile?.country_details?.currency_symbol || user?.profile?.country?.currency_symbol || '$';
        return `${symbol}${parseFloat(val).toFixed(2)}`;
    };

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await api.get(`/sessions/?page=${page}`);
                // Handle both paginated and non-paginated responses
                const newSessions = response.data.results || response.data;
                if (page === 1) {
                    setSessions(newSessions);
                } else {
                    setSessions(prev => [...prev, ...newSessions]);
                }
                setHasMore(!!response.data.next);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        };
        fetchSessions();
    }, [page]);

    const handleDelete = async (sessionId) => {
        setDeleting(true);
        try {
            await api.delete(`/sessions/${sessionId}/`);
            setSessions(sessions.filter(s => s.id !== sessionId));
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting session:', error);
            alert('Failed to delete session. Please try again.');
        } finally {
            setDeleting(false);
        }
    };

    const loadMore = () => {
        setLoadingMore(true);
        setPage(prev => prev + 1);
    };

    if (loading) return <div className="text-center p-10">Loading...</div>;

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Session History</h1>
                <div className="text-sm text-slate-500">
                    {sessions.length} session{sessions.length !== 1 ? 's' : ''}
                    {hasMore && ' (more available)'}
                </div>
            </div>

            <div className="space-y-4">
                {sessions.length === 0 ? (
                    <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-xl">No sessions found.</div>
                ) : (
                    sessions.map(session => (
                        <div key={session.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800 dark:text-white">{session.platform_name || 'Delivery'}</h3>
                                    <p className="text-sm text-slate-500">{new Date(session.date).toLocaleDateString()} • {session.start_time.slice(0, 5)} - {session.end_time.slice(0, 5)}</p>
                                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                                        <span className="flex items-center gap-1"><Clock size={12} /> {parseFloat(session.duration_hours).toFixed(1)}h</span>
                                        <span className="flex items-center gap-1"><MapPin size={12} /> {session.total_distance_km}km</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 w-full md:w-auto justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-700">
                                <div className="text-right">
                                    <p className="text-xs text-slate-500">Earnings</p>
                                    <p className="font-medium text-slate-900 dark:text-slate-200">{formatCurrency(session.total_earnings)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500">Profit</p>
                                    <p className={`font-bold text-lg ${parseFloat(session.net_profit) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {formatCurrency(session.net_profit)}
                                    </p>
                                </div>
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs text-slate-500">$/hr</p>
                                    <p className="font-medium text-slate-700 dark:text-slate-300">{formatCurrency(session.profit_per_hour)}</p>
                                </div>
                                <button
                                    onClick={() => setDeleteConfirm(session.id)}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    title="Delete session"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Load More Button */}
            {hasMore && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                    >
                        {loadingMore ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                Loading...
                            </>
                        ) : (
                            'Load More Sessions'
                        )}
                    </button>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full shadow-xl">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Delete Session?</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            Are you sure you want to delete this session? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                disabled={deleting}
                                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                disabled={deleting}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {deleting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;
