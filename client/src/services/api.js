import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aurashop_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // If the server returned an HTML document instead of API JSON (e.g. SPA fallback rewrite)
    if (
      typeof response.data === 'string' &&
      (response.data.includes('<!DOCTYPE html>') || response.data.includes('<html'))
    ) {
      const err = new Error(
        `API endpoint returned HTML instead of JSON for ${response.config.url}. Please check your backend connection.`
      );
      err.response = response;
      return Promise.reject(err);
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('aurashop_token');
      localStorage.removeItem('aurashop_user');
    }
    return Promise.reject(error);
  }
);

export default api;
