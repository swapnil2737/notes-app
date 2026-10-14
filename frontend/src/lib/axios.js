import axios from "axios";
import useAuthStore from "../store/useAuthStore";

const rawBaseURL = import.meta.env.VITE_API_URL || "http://localhost:6001/api";
const baseURL = rawBaseURL.endsWith("/") ? rawBaseURL : `${rawBaseURL}/`;

const api = axios.create({
    baseURL,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 globally - log out user if token expired
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

export default api;