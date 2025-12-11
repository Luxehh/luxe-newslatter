import axios from 'axios';

const api = axios.create({
  baseURL: 'https://luxe-api-production-d5c9.up.railway.app',
});

// Newsletter API methods
export const newsletterAPI = {
  // Fetch all subscribers with optional filters
  fetchSubscribers: async (filters = {}) => {
    return await api.post('/api/newsletter/fetch', filters);
  },

  // Fetch a single subscriber by ID or phone number
  fetchOne: async (params) => {
    return await api.post('/api/newsletter/fetch-one', params);
  },

  // Add a new newsletter subscriber
  addSubscriber: async (data) => {
    return await api.post('/api/newsletter/add', data);
  },

  // Update an existing subscriber
  updateSubscriber: async (data) => {
    return await api.post('/api/newsletter/update', data);
  },

  // Delete a subscriber
  deleteSubscriber: async (id) => {
    return await api.post('/api/newsletter/delete', { id });
  }
};

export default api;

