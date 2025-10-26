import axios from 'axios';
import { API_CONFIG, AUTH_CONFIG, ERROR_MESSAGES } from '../utils/constants';
import { storageService } from '../utils/storage';

const authAPI = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: false,
});

// Add token to requests
authAPI.interceptors.request.use((config) => {
  const tokens = storageService.getAuthTokens();
  if (tokens.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

// Handle token refresh on 401 responses
authAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const tokens = storageService.getAuthTokens();
        if (tokens.refreshToken) {
          const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/token/refresh/`, {
            refresh: tokens.refreshToken
          });
          
          const newAccessToken = response.data.access;
          storageService.setAuthTokens(newAccessToken, tokens.refreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        authService.logout();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/token/`, {
        username,
        password
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }
  },

  register: async (userData) => {
    try {
      const response = await authAPI.post('/auth/register/', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || ERROR_MESSAGES.AUTH.REGISTRATION_FAILED);
    }
  },

  getProfile: async () => {
    try {
      const response = await authAPI.get('/auth/profile/');
      return response.data;
    } catch (error) {
      throw new Error(ERROR_MESSAGES.NETWORK.UNAUTHORIZED);
    }
  },

  logout: () => {
    storageService.clearAuthTokens();
  },

  isAuthenticated: () => {
    const tokens = storageService.getAuthTokens();
    return !!tokens.accessToken;
  },

  getCurrentUser: () => {
    return storageService.getUserData();
  },

  updateStoredUser: (userData) => {
    storageService.setUserData(userData);
  },

  // Token management
  getStoredTokens: () => {
    return storageService.getAuthTokens();
  },

  setStoredTokens: (accessToken, refreshToken) => {
    return storageService.setAuthTokens(accessToken, refreshToken);
  },

  // Clear all auth data (for testing/debugging)
  clearAllAuthData: () => {
    storageService.clearAuthTokens();
    // Also clear any legacy tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
};

export default authAPI;