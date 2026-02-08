import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { jwtDecode } from "jwt-decode"; // Need to install this or just check existence for basic auth

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Try to fetch profile directly. If cookies are valid, this works.
                const response = await api.get('/profile/');
                const profileData = response.data;
                const userData = {
                    ...profileData.user,
                    profile: profileData
                };
                setUser(userData);
            } catch (error) {
                console.log("Not authenticated or session expired");
                // Don't auto-redirect to login here, just leave user as null. 
                // PrivateRoute handles redirection.
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (username, password) => {
        // Cookies are set automatically by backend response
        await api.post('/auth/login/', { username, password });

        // Performance: Fetch profile immediately after
        await refreshProfile();
        return true;
    };

    const register = async (userData) => {
        const response = await api.post('/auth/register/', userData);
        return response.data;
    };

    const socialLogin = async (code) => {
        // Cookies are set automatically by backend response
        await api.post('/auth/google/', { code });

        // Performance: Parallelize if we added more calls, but here just getting profile
        await refreshProfile();
        return true;
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout/'); // dj-rest-auth logout clears cookies
        } catch (e) {
            console.error("Logout failed", e);
        }
        setUser(null);
        // Force reload or redirect to ensure clean state
        window.location.href = '/login';
    };

    const refreshProfile = async () => {
        try {
            const response = await api.get('/profile/');
            const profileData = response.data;
            const userData = {
                ...profileData.user,
                profile: profileData
            };
            setUser(userData);
        } catch (error) {
            console.error("Failed to refresh profile", error);
        }
    };

    const updateUser = (userData) => {
        // Optimistically update user state without refetching
        setUser(prev => {
            // If userData is the full profile response (containing .user), use logic similar to refreshProfile
            if (userData.user && userData.country !== undefined) {
                return {
                    ...userData.user,
                    profile: userData
                };
            }
            // Otherwise assume it's a partial merge or just user fields?
            // For safety, let's assume usage is passing the full profile object (like from PUT /profile)
            return {
                ...prev,
                profile: {
                    ...prev.profile,
                    ...userData
                }
            };
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, register, socialLogin, logout, loading, refreshProfile, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
