import axios from 'axios';

const API_HOST = window.location.hostname;
const API_PORT = 5050;
const BASE_URL = `http://${API_HOST}:${API_PORT}/api`;

const api = axios.create({
    baseURL: BASE_URL,
     headers: {
      'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;