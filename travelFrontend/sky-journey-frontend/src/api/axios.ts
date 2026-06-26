import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7164/api',
});

// Request interceptor — token automatically add করবে
api.interceptors.request.use((config) => {
  const userData = localStorage.getItem('sky_user');
  if (userData) {
    const user = JSON.parse(userData);
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Response interceptor — 401 হলে logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sky_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;