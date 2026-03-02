import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getToken, ensureCurrentUser } from '../api/authApi';

const REDIRECT_KEY = 'redirectAfterLogin';

export const ProtectedRoute = ({ element, requiredRole }) => {
    const token = getToken();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [hasValidAuth, setHasValidAuth] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const validateAuth = async () => {
            setIsLoading(true);

            // If no token, not authenticated
            if (!token) {
                setHasValidAuth(false);
                setIsLoading(false);
                return;
            }

            try {
                const user = await ensureCurrentUser();
                setHasValidAuth(!!user);
                setUserRole(user?.role ?? null);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                setHasValidAuth(false);
                setUserRole(null);
            } finally {
                setIsLoading(false);
            }
        };

        validateAuth();
    }, [token, location.pathname]);

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    // Not authenticated
    if (!hasValidAuth) {
        sessionStorage.setItem(REDIRECT_KEY, location.pathname);
        return <Navigate to="/login" replace />;
    }

    if (requiredRole) {
        const normalizedUserRole = (userRole || '').toLowerCase();
        const normalizedRequiredRole = requiredRole.toLowerCase();
        if (normalizedUserRole !== normalizedRequiredRole) {
            return <Navigate to="/403" replace />;
        }
    }

    return element;
};

export const getRedirectPath = () => {
    const path = sessionStorage.getItem(REDIRECT_KEY);
    sessionStorage.removeItem(REDIRECT_KEY);
    return path || '/compte/inici';
};
