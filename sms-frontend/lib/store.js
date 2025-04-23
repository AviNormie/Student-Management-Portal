import { create } from 'zustand';

// Create auth store
export const useAuthStore = create((set) => ({
  user: null,
  role: null,
  username: null,
  isLoggedIn: false,
  
  // Actions
  setUser: (userData) => set({
    user: userData,
    role: userData?.role || null,
    username: userData?.username || null,
    isLoggedIn: !!userData
  }),
  
  logout: () => set({
    user: null,
    role: null,
    username: null,
    isLoggedIn: false
  }),
  
  // For hydration safety
  hydrate: (data) => {
    if (typeof window !== 'undefined') {
      // Only run on client side
      set({
        user: data.user || null,
        role: data.role || null,
        username: data.username || null,
        isLoggedIn: !!data.user
      });
    }
  }
}));

// Optional: Hydrate from localStorage on client-side initialization
if (typeof window !== 'undefined') {
  try {
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    if (userData) {
      useAuthStore.getState().hydrate({
        user: userData,
        role: userData.role,
        username: userData.username
      });
      
      // We can still keep localStorage as a backup if needed
      // but the primary source of truth is now the Zustand store
    }
  } catch (error) {
    console.error('Error hydrating auth store from localStorage:', error);
  }
}