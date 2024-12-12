// axios.js
import axios from 'axios';
import { store } from '../app/store';
import { logout } from '../features/authSlice';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
    withCredentials: true,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json", // Default for JSON
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            store.dispatch(logout());
            localStorage.removeItem('token');
            window.dispatchEvent(new CustomEvent('authError'));
        }
        return Promise.reject(error);
    }
);

export default api;
