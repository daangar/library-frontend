import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { AuthContextType, User } from '../types/api';
import { apiService } from '../utils/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          apiService.setToken(token);
          const currentUser = await apiService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.log('No se pudo obtener usuario:', error);
          // Token expirado, limpiar
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setToken(null);
          apiService.setToken(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [token]);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiService.login({ username, password });

      // Store tokens
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);

      // Set token in API service
      apiService.setToken(response.access);
      setToken(response.access);

      // Get user info
      const currentUser = await apiService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.log('Login falló:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    apiService.setToken(null);
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
