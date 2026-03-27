import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_API_URL || 'https://zentrosite.onrender.com/api';
// Ensure the base URL always ends with /api
const baseURL = rawBaseURL.endsWith('/api') ? rawBaseURL : rawBaseURL.replace(/\/$/, '') + '/api';

const api = axios.create({ baseURL });

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
