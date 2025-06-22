import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize directly from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token');
  });
  
  const [loading, setLoading] = useState(false);

  // Keep for synchronization with other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        setToken(e.newValue);
      } else if (e.key === 'user') {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Authenticate with backend
  const authenticateWithBackend = async (googleUser, googleToken) => {
    try {
      // Send Google token to your backend
      const response = await api.post('/user/authenticate', {
        idToken: googleToken
      });
      
      // Store the JWT from your backend
      const backendToken = response.data.jwtToken;
      setToken(backendToken); // Make sure token is set in state
      localStorage.setItem('token', backendToken);
      
      return true;
    } catch (error) {
      console.error('Backend authentication failed:', error);
      return false;
    }
  };

  const login = async (userData, googleToken) => {
    // Store Google user data
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Authenticate with backend
    return await authenticateWithBackend(userData, googleToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);