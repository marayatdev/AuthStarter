import React, { createContext, useState, useContext, ReactNode } from 'react';
import { login, fetchUserDetails } from '../../services/Auth/authService';

interface AuthContextType {
    user: { email: string; username: string } | null;
    loginUser: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<{ email: string; username: string } | null>(null);

    const loginUser = async (email: string, password: string) => {
        try {
            const { token } = await login(email, password);
            localStorage.setItem('authToken', token);

            const userDetails = await fetchUserDetails(token);
            setUser({ email: userDetails.email, username: userDetails.username });
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loginUser }}>
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
