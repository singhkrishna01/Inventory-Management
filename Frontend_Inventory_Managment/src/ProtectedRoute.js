import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './Login _signup_pages/UserContext'; // Import user context

const ProtectedRoute = ({ children }) => {
    const { userData } = useUser(); // Get user authentication status

    if (!userData) {
        // If not authenticated, redirect to login
        return <Navigate to="/login" replace />;
    }

    return children; // Render the protected content
};

export default ProtectedRoute;
