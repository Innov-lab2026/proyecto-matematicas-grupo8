import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/usuarios';
const AUTH_STORAGE_KEY = 'frontend_auth_user';

const AuthContext = createContext(undefined);

const getStoredUser = () => {
    const rawUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!rawUser) return null;
    try {
        return JSON.parse(rawUser);
    } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => getStoredUser());
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const isAuthenticated = Boolean(user);

    const login = async (email, password) => {
        try {
            setError(null);
            setSuccess(null);
            const response = await axios.post(`${API_URL}/login`, { email, password });
            const userData = response.data.user;
            setUser(userData);
            setSuccess(`hola ${userData.nombre}, iniciaste sesión`);
            return { success: true };
        } catch (err) {
            const messages = err.response?.data?.errors || [err.response?.data?.message || 'error al iniciar sesión'];
            setError(messages);
            return { success: false, message: messages.join(', ') };
        }
    };

    const register = async (email, password, nombre) => {
        try {
            setError(null);
            setSuccess(null);
            const response = await axios.post(`${API_URL}/registro`, { email, password, nombre });
            setSuccess('se registró un nuevo usuario');
            await login(email, password);
            return { success: true };
        } catch (err) {
            const messages = err.response?.data?.errors || [err.response?.data?.message || 'error en el registro'];
            setError(messages);
            return { success: false, message: messages.join(', ') };
        }
    };

    const deleteAccount = async (password) => {
        try {
            setError(null);
            setSuccess(null);
            await axios.delete(`${API_URL}/eliminar`, {
                data: { password },
                headers: { 'x-simulated-uid': user.id }
            });
            setUser(null);
            setSuccess('cuenta eliminada permanentemente');
            return { success: true };
        } catch (err) {
            const messages = err.response?.data?.errors || [err.response?.data?.message || 'hubo un problema borrando la cuenta'];
            setError(messages);
            return { success: false, message: messages.join(', ') };
        }
    };

    const logout = () => {
        setUser(null);
        setError(null);
        setSuccess(null);
    };

    useEffect(() => {
        if (user) {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(AUTH_STORAGE_KEY);
        }
    }, [user]);

    const value = useMemo(
        () => ({
            user,
            isAuthenticated,
            login,
            register,
            logout,
            deleteAccount,
            error,
            success,
            setSuccess,
            setError
        }),
        [user, isAuthenticated, error, success]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
    return context;
};
