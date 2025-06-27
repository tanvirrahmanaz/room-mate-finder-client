// src/pages/NotFound.jsx

import React from 'react';
import { Link, useRouteError } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 text-center px-4">
            <div className="max-w-md">
                <AlertTriangle className="w-24 h-24 text-error mx-auto mb-6" />
                <h1 className="text-6xl font-extrabold text-error">
                    {error.status || '404'}
                </h1>
                <h2 className="text-3xl font-bold text-base-content mt-4">
                    {error.statusText || 'Page Not Found'}
                </h2>
                <p className="text-base-content/70 mt-4 mb-8">
                    Oops! The page you are looking for does not exist. It might have been moved or deleted.
                </p>
                <Link to="/" className="btn btn-primary">
                    <Home size={18} className="mr-2" />
                    Go Back to Homepage
                </Link>
            </div>
        </div>
    );
};

export default NotFound;