// src/contexts/AuthContext.jsx
import React, { createContext, useState } from 'react';
import { authService } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      if (response.token) {
        localStorage.setItem('token', response.token);
        // Assuming response includes user data with role
        const userData = {
          ...response.user,
          role: response.user.role
        };
        setUser(userData);
        return userData; // Return user data for role checking
      } else {
        throw new Error(response.msg || 'Login failed');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const isOrganizer = () => {
    return user?.role === 'organizer';
  };
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(userData);
      console.log('API Response:', response);
      if (response.token) {
        localStorage.setItem('token', response.token);
        const userData = {
          ...response.user,
          role: response.user.role
        };
        setUser(userData);
        return userData;
      } else {
        throw new Error(response.msg || 'Registration failed');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      loading, 
      isOrganizer,
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
};