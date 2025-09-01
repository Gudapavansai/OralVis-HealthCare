import React, { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        // Check for stored user session on app load
        const storedUser = localStorage.getItem('dentalApp_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            }
            catch (error) {
                localStorage.removeItem('dentalApp_user');
            }
        }
    }, []);
    const login = async (email, password, role) => {
        // Simulate authentication - in real app, this would call an API
        if (password === 'demo123') {
            const newUser = {
                id: Date.now().toString(),
                email,
                name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
                role,
            };
            setUser(newUser);
            localStorage.setItem('dentalApp_user', JSON.stringify(newUser));
            return true;
        }
        return false;
    };
    const logout = () => {
        setUser(null);
        localStorage.removeItem('dentalApp_user');
    };
    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
    };
    return React.createElement(AuthContext.Provider, { value: value }, children);
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

