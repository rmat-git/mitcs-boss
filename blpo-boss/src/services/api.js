import axios from 'axios';
import useAuthStore from '../store/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data) => api.post('/api/register', data),
  login:    (data) => api.post('/api/login', data),
  logout:   ()     => api.post('/api/logout'),
  user:     ()     => api.get('/api/user'),
};

export default api;