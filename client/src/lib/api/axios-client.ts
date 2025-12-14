import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const getTime = () => new Date().toISOString();

const getBaseUrl = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

    try {
        // Use URL object to handle diverse input formats safely
        const url = new URL(apiUrl, window.location.origin);

        // Remove trailing slash for consistency
        if (url.pathname.endsWith('/')) {
            url.pathname = url.pathname.slice(0, -1);
        }

        // Ensure it ends with /api
        if (!url.pathname.endsWith('/api')) {
            console.warn(`[Axios] BASE_URL '${apiUrl}' seems to be missing '/api' suffix. Appending it automatically.`);
            url.pathname += '/api';
        }

        return url.toString();
    } catch (e) {
        // Fallback for relative URLs or invalid inputs
        let url = apiUrl;
        if (url.endsWith('/')) {
            url = url.slice(0, -1);
        }
        if (!url.endsWith('/api')) {
            url += '/api';
        }
        return url;
    }
}

const BASE_URL = getBaseUrl();

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            console.log("[Axios] Attaching Token:", token.substring(0, 10) + "...");
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn("[Axios] No token found in store!");
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Un-authorized - log out user
            useAuthStore.getState().logout();
            // Optionally redirect if needed, but the AuthGuard should handle it once isAuthenticated becomes false
        }
        return Promise.reject(error);
    }
);
