import React, { createContext, useState, useContext, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('accessToken');
    if (username && role && token) {
      return { username, role, accessToken: token };
    }
    return null;
  });

  const login = useCallback(async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    const { accessToken, refreshToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('username', username);
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const role = (payload.role || '').replace('ROLE_', '');
    localStorage.setItem('role', role);
    const userData = { username, role, accessToken };
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    setUser(null);
  }, []);

  const hasRole = useCallback((role) => {
    return localStorage.getItem('role') === role;
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
