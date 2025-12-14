import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const getTime = () => new Date().toISOString();

const getBaseUrl = () => {
    let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    // Ensure it doesn't end with a slash for consistency before appending /api is checked
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    // If it points to the root of the python server (likely localhost:8000), it needs /api appended
    // because the backend mounts all routers under /api.
    if (!url.endsWith('/api')) {
        console.warn(`[Axios] BASE_URL '${url}' seems to be missing '/api' suffix. Appending it automatically.`);
        url += '/api';
    }
    return url;
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
