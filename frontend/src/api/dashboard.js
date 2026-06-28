// frontend/src/api/dashboard.js
import api from './axios';

export const getDashboardData = async () => {
  const response = await api.get('/dashboard');
  return response.data;
};

export const seedParties = async () => {
  const response = await api.post('/dashboard/seed');
  return response.data;
};