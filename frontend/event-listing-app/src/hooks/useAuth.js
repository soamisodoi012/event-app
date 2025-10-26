import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

// Main auth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Hook for authentication status only
export const useAuthStatus = () => {
  const { isAuthenticated, loading } = useAuth();
  
  return {
    isAuthenticated,
    isLoading: loading,
    isReady: !loading
  };
};

// Hook for user operations
export const useUser = () => {
  const { user, updateUser, getUserInfo } = useAuth();
  
  return {
    user,
    updateUser,
    getUserInfo
  };
};