import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const getTime = () => new Date().toISOString();

const getBaseUrl = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

    try {
        // Use URL object to handle diverse input formats safely
        const url = new URL(apiUrl, window.location.origin);

        // Deduplicate slashes in the path
        let path = url.pathname.replace(/\/+/g, '/');

        // Remove trailing slash for consistency (unless it's just root, handled below)
        if (path !== '/' && path.endsWith('/')) {
            path = path.slice(0, -1);
        }

        // Ensure it ends with /api
        if (!path.endsWith('/api')) {
            if (path === '/') {
                path = '/api';
            } else {
                console.warn(`[Axios] BASE_URL '${apiUrl}' seems to be missing '/api' suffix. Appending it automatically.`);
                path += '/api';
            }
        }

        url.pathname = path;
        return url.toString();
    } catch (e) {
        // Fallback for relative URLs: rudimentary cleanup
        let url = apiUrl;
        // Fix double slashes in string
        url = url.replace(/([^:]\/)\/+/g, "$1");

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
