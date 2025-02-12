import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { loginWithEmail, logout, registerWithEmail, resetPassword } from '../firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = async (email, password) => {
        try {
            setError('');
            await loginWithEmail(email, password);
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    const signUp = async (email, password) => {
        try {
            setError('');
            await registerWithEmail(email, password);
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    const logoutUser = async () => {
        try {
            setError('');
            await logout();
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    const resetUserPassword = async (email) => {
        try {
            setError('');
            await resetPassword(email);
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    const value = {
        user,
        login,
        signUp,
        logoutUser,
        resetUserPassword,
        error
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
} 