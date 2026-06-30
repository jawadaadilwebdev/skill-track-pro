import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

// Centralizes auth state (user, token, loading) and exposes login/register/logout
// so any component can access auth without prop drilling. Using Context here
// (rather than Redux) is the right call for an app of this size — fewer
// moving parts, easier for recruiters to read, same end result.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('st_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem('st_token');
      if (token) {
        try {
          const { user: freshUser } = await authService.getMe();
          setUser(freshUser);
          localStorage.setItem('st_user', JSON.stringify(freshUser));
        } catch {
          localStorage.removeItem('st_token');
          localStorage.removeItem('st_user');
          setUser(null);
        }
      }
      setLoading(false);
    };
    bootstrap();
  }, []);

  const persistSession = (data) => {
    localStorage.setItem('st_token', data.token);
    localStorage.setItem('st_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    persistSession(data);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authService.register(payload);
    persistSession(data);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('st_token');
    localStorage.removeItem('st_user');
    setUser(null);
  }, []);

  const updateLocalUser = useCallback((partialUser) => {
    setUser((prev) => {
      const next = { ...prev, ...partialUser };
      localStorage.setItem('st_user', JSON.stringify(next));
      return next;
    });
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateLocalUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
