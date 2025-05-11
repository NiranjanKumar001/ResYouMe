import React, { useState, createContext } from 'react';

// Create and export the context
export const UserContext = createContext();

const AuthContext = ({ children }) => {
    const [protect, setProtect] = useState(false);
    return (
        <UserContext.Provider value={{ protect, setProtect }}>
            {children}
        </UserContext.Provider>
    );
};

export default AuthContext;