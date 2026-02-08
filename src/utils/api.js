import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    withCredentials: true, // Send cookies with requests
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - No longer need to attach token manually
api.interceptors.request.use(
    (config) => {
        config.withCredentials = true; // Ensure every request sends cookies
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized (Token expired)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Determine base URL dynamically or from env
                const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

                // Attempt refresh (cookie is sent automatically)
                await axios.post(`${baseURL}/auth/refresh/`, {}, { withCredentials: true });

                // Retry original request
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed - user is truly logged out
                // Let AuthContext handle the redirect via state change if possible, 
                // or just redirect here as a fallback.
                const publicPaths = [
                    '/login',
                    '/register',
                    '/',
                    '/privacy-policy',
                    '/terms-of-service',
                    '/refund-policy',
                    '/security',
                    '/contact',
                    '/contact-support'
                ];
                if (!publicPaths.includes(window.location.pathname)) {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
