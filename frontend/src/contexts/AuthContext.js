// contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null); // Thêm role
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthentication = () => {
            const token = localStorage.getItem('userToken');
            const userRole = localStorage.getItem('userRole'); // Lấy role từ localStorage
            if (token) {
                setIsAuthenticated(true);
                setRole(userRole);
            } else {
                setIsAuthenticated(false);
                setRole(null);
            }
            setLoading(false);
        };

        checkAuthentication();
    }, []);

    const login = (token, userRole) => {
        setIsAuthenticated(true);
        setRole(userRole); // Lưu role
        localStorage.setItem('userToken', token);
        localStorage.setItem('userRole', userRole); // Lưu role vào localStorage
    };
      
    const logout = () => {
        setIsAuthenticated(false);
        setRole(null);
        localStorage.removeItem('userToken');
        localStorage.removeItem('userRole'); // Xóa role khỏi localStorage
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
