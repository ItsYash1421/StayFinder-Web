import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { User } from '../types';
import { authAPI } from '../api/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Verify token and get user data
          const userData = await authAPI.getProfile();
          setUser(userData);
          
          // Only redirect to login if we're on a protected route and the token is invalid
          if (location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/') {
            navigate(location.pathname);
          }
        } catch (error) {
          console.error('AuthContext: Error loading user profile:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          
          // Only redirect to login if we're on a protected route
          if (location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/') {
            navigate('/login');
          }
        }
      } else {
        setUser(null);
        // Only redirect to login if we're on a protected route
        if (location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/') {
          navigate('/login');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [navigate, location.pathname]);

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const updateUser = (updatedUser: User) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};