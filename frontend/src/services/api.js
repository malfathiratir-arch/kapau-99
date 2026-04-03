import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  createPetugas: (data) => api.post('/auth/create-petugas', data),
};

// ── Menu ──────────────────────────────────────────
export const menuAPI = {
  getAll: (params) => api.get('/menu', { params }),
  getById: (id) => api.get(`/menu/${id}`),
  create: (data) => api.post('/menu', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/menu/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/menu/${id}`),
};

// ── Order ─────────────────────────────────────────
export const orderAPI = {
  create: (data) => api.post('/order', data),
  getAll: (params) => api.get('/order', { params }),
  getMyOrders: () => api.get('/order/user/me'),
  updateStatus: (id, status) => api.put(`/order/${id}/status`, { status }),
  getStats: () => api.get('/order/stats'),
};

// ── Petugas ───────────────────────────────────────
export const petugasAPI = {
  getAll: () => api.get('/petugas'),
  delete: (id) => api.delete(`/petugas/${id}`),
};

// ── AI Chat ───────────────────────────────────────
export const aiAPI = {
  chat: (message) => api.post('/ai/chat', { message }),
};

export default api;
