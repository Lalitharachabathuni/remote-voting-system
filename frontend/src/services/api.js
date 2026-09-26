import axios from 'axios';

// Detect whether running locally or in production
const isLocal = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Smart default: uses localhost during dev, and live Render backend when deployed
const defaultBackendUrl = isLocal 
  ? 'http://localhost:5000/api/v1' 
  : 'https://voteremote-backend.onrender.com/api/v1';

let rawUrl = import.meta.env.VITE_API_BASE_URL || defaultBackendUrl;
rawUrl = rawUrl.trim().replace(/\/+$/, '');
const API_BASE_URL = rawUrl.endsWith('/api/v1') ? rawUrl : `${rawUrl}/api/v1`;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('voteremote_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for auth error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
