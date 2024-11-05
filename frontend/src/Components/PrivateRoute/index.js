import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '~/contexts/AuthContext';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return null; // Hoặc một component loading nếu bạn muốn

    return isAuthenticated ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
