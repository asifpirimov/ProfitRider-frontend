import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Layers, Plus, Trash2, Search, X } from 'lucide-react';
import Toast from './Toast';

const PlatformManager = () => {
    const { user, refreshProfile } = useContext(AuthContext);
    const [myPlatforms, setMyPlatforms] = useState([]);
    const [availablePlatforms, setAvailablePlatforms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    useEffect(() => {
        if (user?.profile?.platforms_details) {
            setMyPlatforms(user.profile.platforms_details);
        }
    }, [user]);

    useEffect(() => {
        if (showAdd && user?.profile?.country) {
            fetchAvailablePlatforms();
        }
    }, [showAdd]);

    const fetchAvailablePlatforms = async () => {
        try {
            const res = await api.get(`/platforms/?country=${user.profile.country}`);
            setAvailablePlatforms(res.data);
        } catch (error) {
            console.error("Failed to fetch available platforms", error);
        }
    };

    const handleAddPlatform = async (platform) => {
        setLoading(true);
        try {
            // Get current IDs
            const currentIds = myPlatforms.map(p => p.id);
            if (currentIds.includes(platform.id)) {
                setToast({ show: true, message: 'Platform already added', type: 'info' });
                setLoading(false);
                return;
            }

            const newIds = [...currentIds, platform.id];
            await api.put('/profile/', { platforms: newIds });
            await refreshProfile();
            setToast({ show: true, message: 'Platform added to your list', type: 'success' });
            setShowAdd(false);
            setSearchTerm('');
        } catch (error) {
            console.error("Failed to add platform", error);
            setToast({ show: true, message: 'Failed to add platform', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePlatform = async () => {
        if (!searchTerm.trim()) return;
        setLoading(true);
        try {
            // Create new platform
            const res = await api.post('/platforms/', {
                name: searchTerm,
                country: user.profile.country
            });
            const newPlatform = res.data;
            await handleAddPlatform(newPlatform);
        } catch (error) {
            console.error("Failed to create platform", error);
            setToast({ show: true, message: 'Failed to create platform', type: 'error' });
            setLoading(false);
        }
    };

    const handleRemovePlatform = async (platformId) => {
        if (!window.confirm('Remove this platform from your list?')) return;
        try {
            const newIds = myPlatforms.map(p => p.id).filter(id => id !== platformId);
            await api.put('/profile/', { platforms: newIds }); // Correctly send ONLY platforms key to update M2M
            await refreshProfile();
            setToast({ show: true, message: 'Platform removed', type: 'success' });
        } catch (error) {
            console.error("Failed to remove platform", error);
            setToast({ show: true, message: 'Failed to remove platform', type: 'error' });
        }
    };

    const filteredAvailable = availablePlatforms.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !myPlatforms.some(mp => mp.id === p.id)
    );

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                    <Layers size={20} className="text-purple-500" /> My Platforms
                </h2>
                <button
                    onClick={() => setShowAdd(!showAdd)}
                    className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100 flex items-center gap-1"
                >
                    <Plus size={16} /> Add Platform
                </button>
            </div>

            {/* My Platforms List */}
            <div className="space-y-3 mb-6">
                {myPlatforms.length === 0 ? (
                    <p className="text-slate-400 italic text-center py-4">No platforms added yet. Add the apps you work with.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {myPlatforms.map(platform => (
                            <div key={platform.id} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 dark:bg-slate-700 dark:border-slate-600">
                                <span className="font-medium text-slate-800 dark:text-white">{platform.name}</span>
                                <button
                                    onClick={() => handleRemovePlatform(platform.id)}
                                    className="text-slate-400 hover:text-red-500"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Platform Section */}
            {showAdd && (
                <div className="animate-fadeIn bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-blue-100 dark:border-slate-700">
                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select or Add New Application</h3>
                    <div className="relative mb-3">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search or type new platform name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {/* Existing Matches */}
                        {filteredAvailable.map(p => (
                            <div
                                key={p.id}
                                onClick={() => handleAddPlatform(p)}
                                className="flex justify-between items-center p-2 hover:bg-white dark:hover:bg-slate-800 rounded cursor-pointer transition-colors"
                            >
                                <span className="text-slate-700 dark:text-slate-300">{p.name}</span>
                                <Plus size={16} className="text-blue-500" />
                            </div>
                        ))}

                        {/* Create New Option */}
                        {searchTerm && !filteredAvailable.some(p => p.name.toLowerCase() === searchTerm.toLowerCase()) && (
                            <div
                                onClick={handleCreatePlatform}
                                className="flex justify-between items-center p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded cursor-pointer transition-colors text-blue-600"
                            >
                                <span>Add "{searchTerm}"</span>
                                <Plus size={16} />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}
        </div>
    );
};

export default PlatformManager;
