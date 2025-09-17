// frontend/src/services/ticketService.js
import api from './api';

export const ticketService = {
  // Create new ticket
  createTicket: async (ticketData) => {
    try {
      const response = await api.post('/tickets', ticketData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to create ticket' 
      };
    }
  },

  // Get user tickets
  getMyTickets: async () => {
    try {
      const response = await api.get('/tickets');
      return { success: true, data: response.data.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch tickets' 
      };
    }
  },

  // Get categories (we'll need to create this API endpoint)
  getCategories: async () => {
    try {
      const response = await api.get('/categories');
      return { success: true, data: response.data.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch categories' 
      };
    }
  },

  // Get priorities
  getPriorities: async () => {
    try {
      const response = await api.get('/priorities');
      return { success: true, data: response.data.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch priorities' 
      };
    }
  }
};