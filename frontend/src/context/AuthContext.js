import React, { createContext, useState } from "react";

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);

    return (
        <AuthContext.Provider value={{ token, setToken, authenticated, setAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}