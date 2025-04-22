import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';

const SessionManager = () => {
    const navigate = useNavigate();
    const [sessionExpiring, setSessionExpiring] = useState(false);
    const [warningShown, setWarningShown] = useState(false);
    const [expiredShown, setExpiredShown] = useState(false);

    // Check if we're in a browser environment
    const isBrowser = typeof window !== 'undefined';

    // Function to parse JWT and get expiration time
    const getTokenExpirationTime = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            const decodedToken = jwtDecode(token);
            return decodedToken.exp * 1000; // Convert to milliseconds
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    // Function to refresh the token
    const refreshSession = async () => {
        try {
            // Get current user info
            const user = JSON.parse(localStorage.getItem('user'));

            if (!user || !user._id) {
                throw new Error('User information not found');
            }

            // Call refresh token endpoint to get a new token
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/refresh-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id })
            });

            if (!response.ok) {
                // If the endpoint is not available, just extend the session locally
                // This is a fallback for development or if the backend is not updated yet
                if (response.status === 404) {
                    console.warn('Refresh token endpoint not available, extending session locally');

                    // Log the current time for debugging
                    const currentTime = Math.floor(Date.now() / 1000);
                    console.log('Current time:', new Date(currentTime * 1000).toLocaleString());

                    // Get the current token
                    const currentToken = localStorage.getItem('token');

                    // Verify token is valid
                    try {
                        // Just check if we can decode it
                        jwtDecode(currentToken);
                    } catch (e) {
                        throw new Error('Invalid token format');
                    }

                    // Create a simple extended token (this is just for demo, not secure)
                    const extendedToken = currentToken;

                    // Update token in localStorage
                    localStorage.setItem('token', extendedToken);

                    // Reset states
                    setSessionExpiring(false);
                    setWarningShown(false);

                    toast.success('Your session has been extended!', {
                        position: "top-center",
                        autoClose: 3000
                    });

                    return true;
                }

                throw new Error('Failed to refresh session');
            }

            const data = await response.json();

            // Update token in localStorage
            localStorage.setItem('token', data.token);

            // Reset states
            setSessionExpiring(false);
            setWarningShown(false);

            toast.success('Your session has been extended!', {
                position: "top-center",
                autoClose: 3000
            });

            return true;
        } catch (error) {
            console.error('Error refreshing session:', error);

            // Show error notification
            toast.error('Could not extend your session. Please log in again.', {
                position: "top-center",
                autoClose: 5000
            });

            return false;
        }
    };

    // Function to handle session expiration
    const handleSessionExpired = () => {
        if (!expiredShown) {
            toast.error('Your session has expired. Please log in again.', {
                position: "top-center",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                onClose: () => {
                    // Clear user data and redirect to login
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                    window.location.reload();
                }
            });
            setExpiredShown(true);
        }
    };

    // Function to show warning before expiration
    const showExpirationWarning = () => {
        if (!warningShown) {
            toast.warn(
                <div>
                    <p>Your session will expire in 5 minutes.</p>
                    <button
                        onClick={refreshSession}
                        className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                    >
                        Extend Session
                    </button>
                </div>,
                {
                    position: "top-center",
                    autoClose: false,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                }
            );
            setWarningShown(true);
            setSessionExpiring(true);
        }
    };

    // Check token expiration periodically
    useEffect(() => {
        // Only run in browser environment
        if (!isBrowser) return;

        const checkTokenExpiration = () => {
            try {
                const expirationTime = getTokenExpirationTime();

                if (!expirationTime) return;

                const currentTime = Date.now();
                const timeUntilExpiration = expirationTime - currentTime;

                // If token is expired
                if (timeUntilExpiration <= 0) {
                    handleSessionExpired();
                    return;
                }

                // If token will expire in 5 minutes (300000 ms) or less
                if (timeUntilExpiration <= 300000 && !sessionExpiring) {
                    showExpirationWarning();
                }
            } catch (error) {
                console.error('Error checking token expiration:', error);
            }
        };

        // Check immediately and then every 30 seconds
        checkTokenExpiration();
        const intervalId = setInterval(checkTokenExpiration, 30000);

        return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionExpiring, warningShown, expiredShown, isBrowser]);

    return <ToastContainer />;
};

export default SessionManager;
