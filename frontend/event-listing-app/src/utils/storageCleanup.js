export const cleanupStorage = () => {
  try {
    // Clear all auth-related items that might be corrupted
    const authKeys = [
      'access_token',
      'refresh_token',
      'user',
      'auth_tokens'
    ];
    
    authKeys.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn(`Failed to remove ${key}:`, error);
      }
    });
    
    console.log('Storage cleanup completed');
    return true;
  } catch (error) {
    console.error('Storage cleanup failed:', error);
    return false;
  }
};

// Run cleanup on import (for development)
if (process.env.NODE_ENV === 'development') {
  // cleanupStorage();
}