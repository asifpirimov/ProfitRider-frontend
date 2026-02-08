import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from './AuthContext';

const BillingContext = createContext();

export const BillingProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [billingInfo, setBillingInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBillingInfo = useCallback(async () => {
        // Only fetch if user is authenticated
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            const response = await api.get('/me/billing/');
            setBillingInfo(response.data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch billing info:', err);
            setError(err);
            // Don't set billingInfo on error - keep it null so components can fallback to user.profile
            // This prevents showing 0 credits when the API fails
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchBillingInfo();
    }, [fetchBillingInfo]);

    // Expose refresh function for manual updates
    const refresh = useCallback(() => {
        setLoading(true);
        return fetchBillingInfo();
    }, [fetchBillingInfo]);

    return (
        <BillingContext.Provider value={{ billingInfo, loading, error, refresh }}>
            {children}
        </BillingContext.Provider>
    );
};

// Custom hook to use billing context
export const useBilling = () => {
    const context = useContext(BillingContext);
    if (!context) {
        throw new Error('useBilling must be used within a BillingProvider');
    }
    return context;
};

export default BillingContext;
