import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '~/contexts/AuthContext';

const PrivateRoute = ({ children, adminOnly = false, cinemaOnly = false }) => {
    const { isAuthenticated, role, loading } = useAuth();

    if (loading) return null; // Đảm bảo không trả về null nếu chưa load xong

    if (adminOnly && role !== 'Admin') {
        console.log("Redirecting, not an admin role");  // Debug log
        return <Navigate to="/" />;
    }

    if (cinemaOnly && role !== 'Cinema') {
        console.log("Redirecting, not a Cinema role");  // Debug log
        return <Navigate to="/" />;
    }

    return isAuthenticated ? children : <Navigate to="/signin" />;
};


export default PrivateRoute;
