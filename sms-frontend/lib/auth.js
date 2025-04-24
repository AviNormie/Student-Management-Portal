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
  
  // If no user data, return a dummy user
  if (!userData) {
    const dummyUser = {
      id: 'dummy-id',
      username: 'demo',
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'STUDENT'
    };
    saveUserData(dummyUser);
    return dummyUser;
  }
  
  return userData;
};

export const getRole = () => {
  // Get from Zustand store
  const role = useAuthStore.getState().role;
  
  // If no role, return a default role
  if (!role) {
    return 'STUDENT';
  }
  
  return role;
};

export const getUsername = () => {
  // Get from Zustand store
  const username = useAuthStore.getState().username;
  
  // If no username, return a default username
  if (!username) {
    return 'demo';
  }
  
  return username;
};

export const isAuthenticated = () => {
  // Always return true to bypass authentication
  return true;
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
    user: user || {
      id: 'dummy-id',
      username: 'demo',
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'STUDENT'
    },
    role: role || 'STUDENT',
    username: username || 'demo',
    isLoggedIn: true,
    isAuthenticated: true
  };
};