import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../Services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [userID, setUserID] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasVisited, setHasVisited] = useState(localStorage.getItem('hasVisited') === 'true');

    useEffect(() => {
        const storedUserID = authService.getUserID();
        const storedToken = authService.getToken();

        if (storedUserID && storedToken) {
            setUserID(storedUserID);
            setToken(storedToken);
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        const result = await authService.login(credentials);
        if (result.success) {
            setUserID(result.data.userID);
            setToken(result.data.token);
            return result;
        }
        return result;
    };

    const logout = () => {
        authService.logout();
        setUserID(null);
        setToken(null);
    };

    const markAsVisited = () => {
        localStorage.setItem('hasVisited', 'true');
        setHasVisited(true);
    };

    const value = {
        userID,
        token,
        login,
        logout,
        markAsVisited,
        hasVisited,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
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
