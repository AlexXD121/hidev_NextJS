import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        // We'll read the token from localStorage via Zustand's persistence
        // The persistence key is 'auth-storage', so we parse it manually or rely on `useAuthStore.getState().token` if outside standard hook usage.
        // For simplicity, we can try to read from `localStorage` directly as Zustand persists it there.
        const storage = localStorage.getItem('auth-storage');
        if (storage) {
            try {
                const { state } = JSON.parse(storage);
                if (state && state.token) {
                    config.headers.Authorization = `Bearer ${state.token}`;
                }
            } catch (e) {
                console.error("Failed to parse auth storage", e);
            }
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
        // Optional: Handle 401 Unauthorized globally
        return Promise.reject(error);
    }
);
