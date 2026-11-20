import axios from 'axios';

// One Axios instance for the whole app.
// baseURL '/api' works because vite.config.js proxies /api to Express.
const api = axios.create({ baseURL: '/api' });

// Automatically attach the login token (if we have one) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
