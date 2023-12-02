import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined) {
          return;
        }
        setToken(token);
        setAuthenticated(true);
    }, [token, authenticated]);

    return (
        <AuthContext.Provider value={{ token, setToken, authenticated, setAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}