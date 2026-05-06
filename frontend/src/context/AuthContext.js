import { createContext, useContext, useState } from 'react';

// Create the context
const AuthContext = createContext();

// Provider wraps the whole app and shares login state globally
export const AuthProvider = ({ children }) => {

    // Check localStorage on startup so login persists on refresh
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });

    // Called after successful login/register
    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    // Clears everything on logout
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook - makes it easy to use auth anywhere
// Just write: const { user, login, logout } = useAuth();
export const useAuth = () => useContext(AuthContext);