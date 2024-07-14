import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import axios from 'axios';

const PrivateRoutes = () => {
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        // Make an API call to check the authentication status
        const checkAuth = async () => {
            try {
                const response = await axios.get('/me', { withCredentials: true });
                setAuth(true);
                console.log('User Data:', response.data);
                console.log('Session ID:', response.data.sessionId);
            } catch (error) {
                console.error('Authentication check failed:', error);
                setAuth(false);
            }
        };

        checkAuth();
    }, []);

    if (auth === null) {
        // Optionally, render a loading spinner or some placeholder while the auth check is in progress
        return <div>Loading...</div>;
    }

    return auth ? <Outlet/> : <Navigate to="/login"/>;
};

export default PrivateRoutes;
