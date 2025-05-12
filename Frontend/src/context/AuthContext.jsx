/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';

export const UserContext = createContext();

const AuthContext = ({ children }) => {
  const [protect, setProtect] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Always check auth status on mount
    const fetchAuthStatus = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/status`, {
          withCredentials: true
        });
        if (res.data.isAuthenticated) {
          setProtect(true);
          setUser(res.data.user);
        } else {
          setProtect(false);
          setUser(null);
        }
      } catch {
        setProtect(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthStatus();
  }, []);

  return (
    <UserContext.Provider value={{ protect, setProtect, loading, user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default AuthContext;
