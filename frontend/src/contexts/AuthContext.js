import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // Thêm trạng thái loading

    useEffect(() => {
        const checkAuthentication = () => {
            const token = localStorage.getItem('userToken');
            if (token) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
            setLoading(false); // Đánh dấu việc kiểm tra hoàn tất
        };

        checkAuthentication();
    }, []);

    const login = (token) => {
        setIsAuthenticated(true);
        localStorage.setItem('userToken', token);
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('userToken');
    };

    // Trả về loading để biết trạng thái
    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
