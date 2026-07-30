import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem('aurashop_user');
    const token = localStorage.getItem('aurashop_token');
    if (stored && token) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('aurashop_token', data.token);
    localStorage.setItem('aurashop_user', JSON.stringify(data.user));
    setUser(data.user);
    showToast(`Welcome back, ${data.user.name}!`);
    return data.user;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('aurashop_token', data.token);
    localStorage.setItem('aurashop_user', JSON.stringify(data.user));
    setUser(data.user);
    showToast('Account created successfully!');
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('aurashop_token');
    localStorage.removeItem('aurashop_user');
    setUser(null);
    showToast('Logged out', 'info');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
