export const saveUserData = (userData) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('role', userData.role);
      localStorage.setItem('username', userData.username);
      localStorage.setItem('isLoggedIn', 'true');
    }
  };
  
  export const getUserData = () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
    }
    return null;
  };
  
  export const getRole = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('role');
    }
    return null;
  };
  
  export const getUsername = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('username');
    }
    return null;
  };
  
  export const isAuthenticated = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isLoggedIn') === 'true';
    }
    return false;
  };
  
  export const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      localStorage.removeItem('isLoggedIn');
    }
  };