// LocalStorage utility functions with enhanced error handling and expiration

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user',
  THEME_PREFERENCE: 'theme_preference',
  LANGUAGE: 'language'
};

class StorageService {
  constructor() {
    this.isAvailable = this.checkStorageAvailability();
  }

  checkStorageAvailability() {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('LocalStorage is not available:', e);
      return false;
    }
  }

  // Basic storage operations
  setItem(key, value, options = {}) {
    if (!this.isAvailable) return false;

    try {
      // For tokens, store as plain strings (not JSON)
      if (key === STORAGE_KEYS.ACCESS_TOKEN || key === STORAGE_KEYS.REFRESH_TOKEN) {
        localStorage.setItem(key, value);
      } else {
        // For other data, store as JSON with metadata
        const data = {
          value,
          timestamp: Date.now(),
          expires: options.expires ? Date.now() + options.expires : null
        };
        localStorage.setItem(key, JSON.stringify(data));
      }
      return true;
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      return false;
    }
  }

  getItem(key) {
    if (!this.isAvailable) return null;

    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      // For tokens, return as plain strings
      if (key === STORAGE_KEYS.ACCESS_TOKEN || key === STORAGE_KEYS.REFRESH_TOKEN) {
        return item;
      }

      // For other data, parse as JSON
      try {
        const data = JSON.parse(item);
        
        // Check if item has expired
        if (data.expires && Date.now() > data.expires) {
          this.removeItem(key);
          return null;
        }

        return data.value;
      } catch (parseError) {
        // If parsing fails, return the raw item (backward compatibility)
        console.warn(`Failed to parse ${key} as JSON, returning raw value`);
        return item;
      }
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  removeItem(key) {
    if (!this.isAvailable) return false;

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      return false;
    }
  }

  clear() {
    if (!this.isAvailable) return false;

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  // Auth-specific methods
  setAuthTokens(accessToken, refreshToken) {
    const success1 = this.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    const success2 = this.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    return success1 && success2;
  }

  getAuthTokens() {
    return {
      accessToken: this.getItem(STORAGE_KEYS.ACCESS_TOKEN),
      refreshToken: this.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    };
  }

  clearAuthTokens() {
    this.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    this.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    this.removeItem(STORAGE_KEYS.USER_DATA);
  }

  setUserData(userData) {
    return this.setItem(STORAGE_KEYS.USER_DATA, userData);
  }

  getUserData() {
    return this.getItem(STORAGE_KEYS.USER_DATA);
  }

  // Utility methods
  getAllKeys() {
    if (!this.isAvailable) return [];
    
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Error getting storage keys:', error);
      return [];
    }
  }

  getSize() {
    if (!this.isAvailable) return 0;
    
    try {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return total;
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return 0;
    }
  }

  // Clean expired items
  cleanup() {
    if (!this.isAvailable) return;

    const keys = this.getAllKeys();
    keys.forEach(key => {
      // Only check non-token keys for expiration
      if (key !== STORAGE_KEYS.ACCESS_TOKEN && key !== STORAGE_KEYS.REFRESH_TOKEN) {
        this.getItem(key); // This will automatically remove expired items
      }
    });
  }
}

// Create singleton instance
export const storageService = new StorageService();

// Legacy functions for backward compatibility
export const getStoredUser = () => storageService.getUserData();
export const setStoredUser = (userData) => storageService.setUserData(userData);
export const removeStoredUser = () => storageService.removeItem(STORAGE_KEYS.USER_DATA);
export const getStoredToken = () => storageService.getAuthTokens().accessToken;
export const clearAllStorage = () => storageService.clear();

export default storageService;