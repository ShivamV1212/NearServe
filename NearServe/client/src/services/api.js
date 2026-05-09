import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

export const getServices = (params) => API.get('/services', { params });
export const getServiceById = (id) => API.get(`/services/${id}`);
export const createService = (data) => API.post('/services', data);
export const updateService = (id, data) => API.put(`/services/${id}`, data);
export const deleteService = (id) => API.delete(`/services/${id}`);
export const getProviderServices = () => API.get('/services/provider/mine');

export const createBooking = (data) => API.post('/bookings', data);
export const getUserBookings = () => API.get('/bookings/my');
export const getProviderBookings = () => API.get('/bookings/provider');
export const updateBookingStatus = (id, status) => API.patch(`/bookings/${id}/status`, { status });

export const getCategories = () => API.get('/categories');
export const addReview = (data) => API.post('/reviews', data);
