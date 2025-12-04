import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    companyId: string;
    avatarUrl?: string;
    company?: {
        name: string;
    };
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => void;
    loading: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('@PortalTRR:token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStorageData = async () => {
            const storedToken = localStorage.getItem('@PortalTRR:token');
            const storedUser = localStorage.getItem('@PortalTRR:user');

            if (storedToken && storedUser) {
                try {
                    // Verify if token is still valid by calling /me
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/me`, {
                        headers: { Authorization: `Bearer ${storedToken}` }
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData);
                        setToken(storedToken);
                    } else {
                        signOut();
                    }
                } catch (error) {
                    signOut();
                }
            }
            setLoading(false);
        };

        loadStorageData();
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Email ou senha inválidos');
            }

            const { user, token } = await response.json();

            localStorage.setItem('@PortalTRR:token', token);
            localStorage.setItem('@PortalTRR:user', JSON.stringify(user));

            setToken(token);
            setUser(user);
        } catch (error) {
            throw error;
        }
    };

    const signOut = () => {
        localStorage.removeItem('@PortalTRR:token');
        localStorage.removeItem('@PortalTRR:user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            signIn,
            signOut,
            loading,
            isAuthenticated: !!user
        }}>
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
