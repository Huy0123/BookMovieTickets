import React, { createContext, useContext, useState } from 'react';

// Tạo context
const AuthContext = createContext();

// Tạo provider cho context
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = () => setIsAuthenticated(true);
    const logout = () => setIsAuthenticated(false);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Xuất khẩu AuthContext
export { AuthContext };

// Hook để sử dụng context
export const useAuth = () => useContext(AuthContext);
