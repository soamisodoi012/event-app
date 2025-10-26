// Application constants and configuration

export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

export const AUTH_CONFIG = {
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000 // 7 days
};

export const EVENT_CATEGORIES = {
  MUSIC: 'music',
  SPORTS: 'sports',
  ARTS: 'arts',
  BUSINESS: 'business',
  TECHNOLOGY: 'technology',
  FOOD: 'food',
  HEALTH: 'health',
  EDUCATION: 'education',
  OTHER: 'other'
};

export const EVENT_CATEGORY_LABELS = {
  [EVENT_CATEGORIES.MUSIC]: '🎵 Music',
  [EVENT_CATEGORIES.SPORTS]: '⚽ Sports',
  [EVENT_CATEGORIES.ARTS]: '🎨 Arts',
  [EVENT_CATEGORIES.BUSINESS]: '💼 Business',
  [EVENT_CATEGORIES.TECHNOLOGY]: '💻 Technology',
  [EVENT_CATEGORIES.FOOD]: '🍕 Food',
  [EVENT_CATEGORIES.HEALTH]: '🏥 Health',
  [EVENT_CATEGORIES.EDUCATION]: '📚 Education',
  [EVENT_CATEGORIES.OTHER]: '🎭 Other'
};

export const EVENT_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const BOOKING_STATUS = {
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  PENDING: 'pending',
  REFUNDED: 'refunded'
};

export const DATE_FORMATS = {
  DISPLAY: {
    date: 'MMMM dd, yyyy',
    time: 'hh:mm a',
    datetime: 'MMMM dd, yyyy hh:mm a',
    shortDate: 'MMM dd, yyyy',
    shortDatetime: 'MMM dd, yyyy hh:mm a'
  },
  API: {
    date: 'YYYY-MM-DD',
    datetime: 'YYYY-MM-DDTHH:mm:ssZ'
  }
};

export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_]+$/
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIREMENTS: {
      UPPERCASE: /[A-Z]/,
      LOWERCASE: /[a-z]/,
      NUMBER: /[0-9]/,
      SPECIAL: /[!@#$%^&*(),.?":{}|<>]/
    }
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  EVENT: {
    TITLE: {
      MIN_LENGTH: 5,
      MAX_LENGTH: 200
    },
    DESCRIPTION: {
      MIN_LENGTH: 10,
      MAX_LENGTH: 2000
    },
    TICKETS: {
      MIN: 1,
      MAX: 10000
    }
  }
};

export const ERROR_MESSAGES = {
  NETWORK: {
    OFFLINE: 'You appear to be offline. Please check your internet connection.',
    TIMEOUT: 'Request timed out. Please try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNAUTHORIZED: 'Your session has expired. Please log in again.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    NOT_FOUND: 'The requested resource was not found.'
  },
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid username or password.',
    ACCOUNT_LOCKED: 'Your account has been locked. Please contact support.',
    SESSION_EXPIRED: 'Your session has expired. Please log in again.',
    REGISTRATION_FAILED: 'Registration failed. Please try again.'
  },
  EVENT: {
    NOT_FOUND: 'Event not found.',
    SOLD_OUT: 'This event is sold out.',
    INSUFFICIENT_TICKETS: 'Not enough tickets available.',
    ALREADY_BOOKED: 'You have already booked this event.',
    BOOKING_FAILED: 'Failed to book tickets. Please try again.',
    CANCELLATION_FAILED: 'Failed to cancel booking. Please try again.'
  },
  FORM: {
    REQUIRED: 'This field is required.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters long.`,
    PASSWORD_MISMATCH: 'Passwords do not match.',
    USERNAME_INVALID: `Username must be ${VALIDATION_RULES.USERNAME.MIN_LENGTH}-${VALIDATION_RULES.USERNAME.MAX_LENGTH} characters and can only contain letters, numbers, and underscores.`
  }
};

export const SUCCESS_MESSAGES = {
  AUTH: {
    LOGIN: 'Successfully logged in!',
    LOGOUT: 'Successfully logged out!',
    REGISTER: 'Account created successfully! Welcome!'
  },
  EVENT: {
    BOOKING: 'Tickets booked successfully!',
    CANCELLATION: 'Booking cancelled successfully!'
  },
  PROFILE: {
    UPDATE: 'Profile updated successfully!'
  }
};

export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  AUTO_SAVE_DELAY: 2000,
  INFINITE_SCROLL_THRESHOLD: 100,
  NOTIFICATION_DURATION: 5000,
  SEARCH_DEBOUNCE: 500
};

export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1200
};

export const COLORS = {
  PRIMARY: '#667eea',
  PRIMARY_GRADIENT: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  SECONDARY: '#f39c12',
  SUCCESS: '#27ae60',
  ERROR: '#e74c3c',
  WARNING: '#f39c12',
  INFO: '#3498db',
  LIGHT: '#f8f9fa',
  DARK: '#2c3e50',
  GRAY: '#6c757d',
  BACKGROUND: '#f5f5f5'
};

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKENS: 'auth_tokens',
  USER_PREFERENCES: 'user_preferences',
  RECENT_SEARCHES: 'recent_searches',
  CART_ITEMS: 'cart_items',
  THEME: 'theme'
};

export default {
  API_CONFIG,
  AUTH_CONFIG,
  EVENT_CATEGORIES,
  EVENT_STATUS,
  DATE_FORMATS,
  VALIDATION_RULES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  UI_CONSTANTS,
  BREAKPOINTS,
  COLORS,
  LOCAL_STORAGE_KEYS
};