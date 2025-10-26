import authAPI from './auth';
import { ERROR_MESSAGES } from '../utils/constants';

// Enhanced API service with better error handling
class ApiService {
  constructor() {
    this.api = authAPI;
  }

  async handleRequest(request) {
    try {
      const response = await request;
      return response;
    } catch (error) {
      console.error('API Request failed:', error);
      
      // Handle different types of errors
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw new Error(ERROR_MESSAGES.NETWORK.OFFLINE);
      }
      
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;
        
        switch (status) {
          case 401:
            throw new Error(ERROR_MESSAGES.NETWORK.UNAUTHORIZED);
          case 403:
            throw new Error(ERROR_MESSAGES.NETWORK.FORBIDDEN);
          case 404:
            throw new Error(ERROR_MESSAGES.NETWORK.NOT_FOUND);
          case 500:
            // Handle server errors with more detail
            if (data.detail) {
              throw new Error(data.detail);
            }
            throw new Error(ERROR_MESSAGES.NETWORK.SERVER_ERROR);
          default:
            throw new Error(data.error || data.detail || ERROR_MESSAGES.NETWORK.SERVER_ERROR);
        }
      } else if (error.request) {
        // Request was made but no response received
        if (error.code === 'ECONNABORTED') {
          throw new Error(ERROR_MESSAGES.NETWORK.TIMEOUT);
        }
        throw new Error('Backend server is not running. Please make sure the Django server is started on port 8000.');
      } else {
        // Something else happened
        throw new Error(error.message || ERROR_MESSAGES.NETWORK.SERVER_ERROR);
      }
    }
  }

  // Event methods with filtering
  async getAllEvents(page = 1, status = 'upcoming') {
    let url = `/events/?page=${page}`;
    
    // Add status filter
    if (status === 'past') {
      url += '&status=past';
    } else if (status === 'all') {
      url += '&show_past=true';
    } else {
      url += '&status=upcoming'; // Default
    }
    
    return this.handleRequest(this.api.get(url));
  }

  async getEvent(id) {
    return this.handleRequest(this.api.get(`/events/${id}/`));
  }

  async bookTicket(id, ticketsCount = 1) {
    return this.handleRequest(this.api.post(`/events/${id}/book_ticket/`, { tickets_count: ticketsCount }));
  }

  async searchEvents(query, location, page = 1, status = 'upcoming') {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (location) params.append('location', location);
    if (page) params.append('page', page);
    
    // Add status filter
    if (status === 'past') {
      params.append('status', 'past');
    } else if (status === 'all') {
      params.append('show_past', 'true');
    } else {
      params.append('status', 'upcoming'); // Default
    }
    
    return this.handleRequest(this.api.get(`/events/search/?${params.toString()}`));
  }
}

// Booking methods
export const bookingService = {
  getMyBookings: () => authAPI.get('/bookings/'),
  cancelBooking: (id) => authAPI.delete(`/bookings/${id}/`),
};

// Create instance
const apiService = new ApiService();

// Export the enhanced service
export const eventService = {
  getAllEvents: (page, status) => apiService.getAllEvents(page, status),
  getEvent: (id) => apiService.getEvent(id),
  bookTicket: (id, ticketsCount) => apiService.bookTicket(id, ticketsCount),
  searchEvents: (query, location, page, status) => apiService.searchEvents(query, location, page, status),
};

export default apiService;