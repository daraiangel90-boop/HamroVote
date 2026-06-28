// frontend/src/api/auth.js
import api from './axios';

export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  // ✅ Make sure this exists
  saveFaceDescriptor: async (faceDescriptor) => {
    const response = await api.post('/auth/face', { faceDescriptor });
    return response.data;
  },
};