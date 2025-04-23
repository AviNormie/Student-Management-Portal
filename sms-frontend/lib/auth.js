import { useAuthStore } from './store';

export const saveUserData = (userData) => {
  console.log('saveUserData - Saving user data:', userData);
  
  // Update Zustand store
  useAuthStore.getState().setUser(userData);
  
  // Optionally keep localStorage as backup
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data to localStorage:', error);
    }
  }
};

export const getUserData = () => {
  // Get from Zustand store
  const userData = useAuthStore.getState().user;
  console.log('getUserData - From store:', userData);
  return userData;
};

export const getRole = () => {
  // Get from Zustand store
  const role = useAuthStore.getState().role;
  console.log('getRole - From store:', role);
  return role;
};

export const getUsername = () => {
  // Get from Zustand store
  const username = useAuthStore.getState().username;
  console.log('getUsername - From store:', username);
  return username;
};

export const isAuthenticated = () => {
  // Check auth status from Zustand store
  const isLoggedIn = useAuthStore.getState().isLoggedIn;
  const hasUserData = !!useAuthStore.getState().user;
  const result = isLoggedIn && hasUserData;
  
  console.log('isAuthenticated - Check details:', {
    isLoggedInFlag: isLoggedIn,
    hasUserData: hasUserData,
    finalResult: result
  });
  
  return result;
};

export const logout = () => {
  console.log('logout - Removing user data from store');
  
  // Clear Zustand store
  useAuthStore.getState().logout();
  
  // Optionally clear localStorage as well
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      localStorage.removeItem('isLoggedIn');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
};

// Add a hook for components to access auth state
export const useAuth = () => {
  const { user, role, username, isLoggedIn } = useAuthStore();
  return {
    user,
    role,
    username,
    isLoggedIn,
    isAuthenticated: isLoggedIn && !!user
  };
};