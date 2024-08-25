import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, logout, getToken, getDecodedToken } from '../services/authService';

interface AuthContextProps {
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    token: string | null;
    role: string | null;
    email: string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(getToken());
    const [role, setRole] = useState<string | null>(null);
    const [email, setemail] = useState<string | null>(null);

    useEffect(() => {
        const decoded = getDecodedToken();
        if (decoded) {
            setRole(decoded.role);
            setemail(decoded.email);
        }
    }, [token]);

    const handleLogin = async (email: string, password: string) => {
        const data = await login({ email, password });
        setToken(data.token);

        const decoded = getDecodedToken();
        if (decoded) {
            setRole(decoded.role);
            setemail(decoded.email);
        }
    };

    const handleLogout = () => {
        logout();
        setToken(null);
        setRole(null);
        setemail(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!token, login: handleLogin, logout: handleLogout, token, role, email }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
