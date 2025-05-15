import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export const UserContext = createContext();

const AuthContext = ({ children }) => {
  const [protect, setProtect] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/status`, {
        withCredentials: true,
        validateStatus: (status) => status < 500
      });
      
      if (res.data.isAuthenticated) {
        setProtect(true);
        setUser(res.data.user);
      } else {
        setProtect(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setProtect(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const githubLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
  };

  const logout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setProtect(false);
      setUser(null);
      Cookies.remove('auth_token');
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <UserContext.Provider value={{ 
      protect, 
      setProtect, 
      loading, 
      user, 
      setUser,
      githubLogin,
      logout,
      checkAuthStatus
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default AuthContext;