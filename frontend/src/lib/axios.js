import axios from "axios";

// In production, VITE_API_URL can be set to e.g. "https://your-backend.onrender.com/api"
const rawBaseURL = import.meta.env.VITE_API_URL || "http://localhost:6001/api";
const baseURL = rawBaseURL.endsWith("/") ? rawBaseURL : `${rawBaseURL}/`;

const api = axios.create({
    baseURL,
});

export default api;