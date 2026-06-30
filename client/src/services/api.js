import axios from 'axios';

// Single axios instance so base URL, auth header, and error handling
// are configured once instead of repeated across every component.
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT from localStorage to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('st_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Globally handle 401s by clearing stale auth state.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('st_token');
      localStorage.removeItem('st_user');
    }
    return Promise.reject(error);
  }
);

export default api;
