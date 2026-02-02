import { createContext, useState, useEffect } from "react";
import type { ReactNode } from 'react'
import api from '../services/api';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextData {
    user: User | null;
    isAuthenticated: boolean;
    signIn: (credentials: any) => Promise<void>
    signOut: () => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider ({children}: {children: ReactNode }) {
    const [user, SetUser] = useState<User | null >(null);
    const isAuthenticated = !!user;

    useEffect(() => {
        const token = localStorage.getItem('@IAauditLog:token');
        const storagedUser = localStorage.getItem('@IAauditLog:user');

        if (token && storagedUser) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            SetUser(JSON.parse(storagedUser));
        }
    }, []);

    async function signIn({ email, password}: any) {
        const response = await api.post('/auth/login', { email, password });
        
        const { access_token, user: userData } = response.data;

        localStorage.setItem('@IAauditLog:token', access_token);
        localStorage.setItem('@IAauditLog:user', JSON.stringify(userData))

        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        SetUser(userData);
    }

    function signOut(){
        localStorage.removeItem('@IAauditLog:token');
        localStorage.removeItem('@IAauditLog:user');
        SetUser(null);
    }

    return (
        <AuthContext.Provider value={{user, isAuthenticated, signIn, signOut}}>
            {children}
        </AuthContext.Provider>
    );
}