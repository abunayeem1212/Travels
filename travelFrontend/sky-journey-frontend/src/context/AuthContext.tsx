import React, { createContext, useContext, useState } from 'react';
import { AuthResponse } from '../types';

interface AuthContextType {
  user: AuthResponse | null;
  login: (data: AuthResponse) => void;
  logout: () => void;
  isAdmin: () => boolean;
  isAdminOrAgent: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthResponse | null>(() => {
    const data = localStorage.getItem('sky_user');
    return data ? JSON.parse(data) : null;
  });

  const login = (data: AuthResponse) => {
    localStorage.setItem('sky_user', JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('sky_user');
    setUser(null);
  };

  const isAdmin = () => {
    const role = user?.role;
    return ['SuperAdmin', 'Admin'].includes(role || '');
  };

  const isAdminOrAgent = () => {
    const role = user?.role;
    return ['SuperAdmin', 'Admin', 'Moderator', 'Agent'].includes(role || '');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isAdminOrAgent }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};