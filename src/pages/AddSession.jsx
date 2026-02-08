import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { useBilling } from '../context/BillingContext';
import { Save, Calculator, Clock, DollarSign, Fuel, Wrench, Info } from 'lucide-react';
import CreditsExhaustedModal from '../components/CreditsExhaustedModal';

const AddSession = () => {
    const { user, refreshProfile } = useContext(AuthContext);
    const { refresh: refreshBilling } = useBilling();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [platformsLoading, setPlatformsLoading] = useState(true);
    const [platforms, setPlatforms] = useState([]);
    const [error, setError] = useState('');
    const [showDepreciationInfo, setShowDepreciationInfo] = useState(false);
    const [showCreditsModal, setShowCreditsModal] = useState(false);

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        start_time: '18:00',
        end_time: '22:00',
        platform: '',
        total_orders: '',
        total_distance_km: '',
        gross_earnings: '',
        tips: '',
        fuel_cost: '',
        depreciation_cost: '',
        other_expenses: '0'
    });

    // Load platforms and defaults
    useEffect(() => {
        const init = async () => {
            try {
                setPlatformsLoading(true);
                setError('');

                // Fetch platforms
                const countryId = user?.profile?.country?.id || user?.profile?.country;

                let url = '/platforms/';
                if (countryId) {
                    const cId = typeof countryId === 'object' ? countryId.id : countryId;
                    url += `?country=${cId}`;
                }
                const res = await api.get(url);
                setPlatforms(res.data);

                if (res.data.length === 0) {
                    setError('No platforms available for your country. Please update your profile.');
                }
            } catch (e) {
                console.error(e);
                setError('Failed to load platforms. Please refresh the page.');
            } finally {
                setPlatformsLoading(false);
            }
        };
        init();
    }, [user]);

    // Auto-calculate costs when distance changes
    useEffect(() => {
        const distance = formData.total_distance_km;
        if (distance && user?.profile) {
            const km = parseFloat(distance);
            if (!isNaN(km) && km > 0) {
                setFormData(prev => ({
                    ...prev,
                    // Fuel cost auto-calculation removed as per user request
                    depreciation_cost: (km * parseFloat(user.profile.default_depreciation_rate_per_km || 0)).toFixed(2)
                }));
            }
        }
    }, [formData.total_distance_km, user?.profile?.default_fuel_cost_per_km, user?.profile?.default_depreciation_rate_per_km]);

    // Determine if current transport type is non-fuel (Bicycle, Scooter)
    const transportType = user?.profile?.transport_type?.toLowerCase() || '';
    const isNonFuelVehicle = transportType === 'bicycle' || transportType === 'scooter';

    // Force fuel cost to 0 for non-fuel vehicles
    useEffect(() => {
        if (isNonFuelVehicle && formData.fuel_cost !== '0') {
            setFormData(prev => ({ ...prev, fuel_cost: '0' }));
        }
    }, [isNonFuelVehicle]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.platform) {
            setError('Please select a platform');
            return;
        }

        // Backend validation: force fuel cost to 0 for non-fuel vehicles
        const submitData = { ...formData };
        if (isNonFuelVehicle) {
            submitData.fuel_cost = '0';
        }

        setLoading(true);
        setError('');
        try {
            await api.post('/sessions/', submitData);
            await refreshProfile(); // Update credits in user profile
            await refreshBilling(); // Update credits in billing info (for Sidebar)
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to save session', error);
            if (error.response && error.response.status === 402) {
                setShowCreditsModal(true);
            } else {
                setError(error.response?.data?.error || 'Failed to save session. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Simple quick preview of net profit
    const duration = (() => {
        const start = new Date(`2000-01-01T${formData.start_time}`);
        const end = new Date(`2000-01-01T${formData.end_time}`);
        if (end < start) end.setDate(end.getDate() + 1);
        return (end - start) / 3600000;
    })();

    const totalEarnings = parseFloat(formData.gross_earnings || 0) + parseFloat(formData.tips || 0);

    // Include all costs in preview (note: vehicle_rent and platform_fees are calculated by backend)
    const totalCosts = parseFloat(formData.fuel_cost || 0) +
        parseFloat(formData.depreciation_cost || 0) +
        parseFloat(formData.other_expenses || 0);

    // This is an estimate - actual profit will include rent, platform fees, and taxes
    const estimatedProfit = totalEarnings - totalCosts;

    // Get currency symbol (use country_details which is the nested object)
    const currencySymbol = user?.profile?.country_details?.currency_symbol || '$';

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 animate-fadeIn">
            <CreditsExhaustedModal
                isOpen={showCreditsModal}
                onClose={() => setShowCreditsModal(false)}
            />
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Clock className="text-blue-500" /> Log Work Session
                </h1>
            </div>

            {error && (
                <div className="mx-6 mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
                        <input type="time" name="start_time" value={formData.start_time} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500" required />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Use 24-hour time (e.g., 18:30 for 6:30 PM)</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Time</label>
                        <input type="time" name="end_time" value={formData.end_time} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500" required />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Use 24-hour time (e.g., 18:30 for 6:30 PM)</p>
                    </div>
                </div>

                {/* Platform & Activity */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Platform</label>
                        <select
                            name="platform"
                            value={formData.platform}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={platformsLoading}
                        >
                            <option value="">
                                {platformsLoading ? 'Loading platforms...' : 'Select Platform'}
                            </option>
                            {platforms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Orders</label>
                        <input type="number" name="total_orders" value={formData.total_orders} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Distance (km)</label>
                        <input type="number" step="0.1" name="total_distance_km" value={formData.total_distance_km} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.0" required />
                    </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 pt-4"></div>

                {/* Financials */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-green-600 flex items-center gap-2"><DollarSign size={18} /> Earnings</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Gross Pay</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{currencySymbol}</span>
                                    <input type="number" step="0.01" name="gross_earnings" value={formData.gross_earnings} onChange={handleChange} className="w-full pl-8 pr-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-2 focus:ring-green-500" placeholder="0.00" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Tips</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{currencySymbol}</span>
                                    <input type="number" step="0.01" name="tips" value={formData.tips} onChange={handleChange} className="w-full pl-8 pr-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-2 focus:ring-green-500" placeholder="0.00" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-red-500 flex items-center gap-2"><Fuel size={18} /> Estimated Costs</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Fuel</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{currencySymbol}</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="fuel_cost"
                                        value={formData.fuel_cost}
                                        onChange={handleChange}
                                        disabled={isNonFuelVehicle}
                                        className={`w-full pl-8 pr-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-2 focus:ring-red-500 ${isNonFuelVehicle ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        placeholder="0.00"
                                    />
                                </div>
                                {isNonFuelVehicle && (
                                    <p className="text-xs text-slate-400 mt-1">Non-fuel vehicle</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                                    Depreciation
                                    <button
                                        type="button"
                                        onClick={() => setShowDepreciationInfo(!showDepreciationInfo)}
                                        className="text-blue-500 hover:text-blue-600"
                                    >
                                        <Info size={14} />
                                    </button>
                                </label>
                                {showDepreciationInfo && (
                                    <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-xs text-blue-700 dark:text-blue-300">
                                        Loss of vehicle value per km driven (wear and tear).
                                    </div>
                                )}
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{currencySymbol}</span>
                                    <input type="number" step="0.01" name="depreciation_cost" value={formData.depreciation_cost} onChange={handleChange} className="w-full pl-8 pr-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-2 focus:ring-red-500" placeholder="0.00" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Other</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{currencySymbol}</span>
                                    <input type="number" step="0.01" name="other_expenses" value={formData.other_expenses} onChange={handleChange} className="w-full pl-8 pr-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-2 focus:ring-red-500" placeholder="0.00" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Preview */}
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg flex items-center justify-between">
                    <div className="text-center">
                        <p className="text-xs text-slate-500">Duration</p>
                        <p className="font-semibold">{duration.toFixed(1)} hrs</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-slate-500">Est. Profit*</p>
                        <p className={`font-bold text-lg ${estimatedProfit >= 0 ? 'text-green-600' : 'text-red-500'}`}>{currencySymbol}{estimatedProfit.toFixed(2)}</p>
                        <p className="text-xs text-slate-400 mt-1">*Excludes rent, fees, taxes</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-slate-500">Est. /hr</p>
                        <p className="font-semibold text-slate-700 dark:text-slate-300">
                            {currencySymbol}{duration > 0 ? (estimatedProfit / duration).toFixed(2) : '0.00'}
                        </p>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || platformsLoading}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Saving...' : <><Save size={20} /> Save Session</>}
                </button>
            </form>
        </div>
    );
};

export default AddSession;
