import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

/**
 * Custom hook to fetch and cache billing information for the current user.
 * Returns billing status, plan details, and credit information.
 */
export const useBillingInfo = () => {
    const [billingInfo, setBillingInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBillingInfo = useCallback(async () => {
        try {
            const response = await api.get('/me/billing/');
            setBillingInfo(response.data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch billing info:', err);
            setError(err);
            // Set default values on error
            setBillingInfo({
                billing_enabled: false,
                plan: 'starter_beta',
                plan_display: 'Starter (Free Beta)',
                credits_remaining: 0,
                credits_total: 300,
                is_pro: false,
                subscription_status: 'none',
                subscription_ends_at: null
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBillingInfo();
    }, [fetchBillingInfo]);

    // Expose refresh function for manual updates
    const refresh = useCallback(() => {
        setLoading(true);
        return fetchBillingInfo();
    }, [fetchBillingInfo]);

    return { billingInfo, loading, error, refresh };
};

export default useBillingInfo;
