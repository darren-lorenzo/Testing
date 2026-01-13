import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthContext';

const ProtectedRoute = () => {
    const { token, loading, hasVisited, markAsVisited } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!token) {
        if (!hasVisited) {
            markAsVisited();
            return <Navigate to="/home" replace />;
        }
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
