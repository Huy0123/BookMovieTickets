import React, { createContext, useContext, useState } from 'react';

// Tạo context
const AuthContext = createContext();

// Tạo provider cho context
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Thay đổi giá trị này tùy theo xác thực

    const login = () => {
        setIsAuthenticated(true);
        console.log("User logged in");
    };
    
    const logout = () => {
        setIsAuthenticated(false);
        console.log("User logged out");
    };
    

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
