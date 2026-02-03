import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function loadStorageData() {
      const storagedUser = localStorage.getItem('@Sentinel:user');
      const storagedToken = localStorage.getItem('@Sentinel:token');

      if (storagedUser && storagedToken) {
        // Configura o header global para todas as próximas requisições
        api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
        setUser(JSON.parse(storagedUser));
      }
      
      setLoading(false);
    }

    loadStorageData();
  }, []);

  async function signIn(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });

    const { access_token, user: userResponse } = response.data;

    localStorage.setItem('@Sentinel:token', access_token);
    localStorage.setItem('@Sentinel:user', JSON.stringify(userResponse));
    
    api.defaults.headers.Authorization = `Bearer ${access_token}`;
    setUser(userResponse);
  }

  async function signUp(name: string, email: string, password: string) {
    const response = await api.post('/auth/register', { name, email, password });
    
    const { access_token, user: userResponse } = response.data;

    localStorage.setItem('@Sentinel:token', access_token);
    localStorage.setItem('@Sentinel:user', JSON.stringify(userResponse));
    
    api.defaults.headers.Authorization = `Bearer ${access_token}`;
    setUser(userResponse);
  }

  function signOut() {
    localStorage.removeItem('@Sentinel:token');
    localStorage.removeItem('@Sentinel:user');
    delete api.defaults.headers.Authorization;
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}