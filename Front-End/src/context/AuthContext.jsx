import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { supabase } from '../config/supabaseClient';
import api from '../config/api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = useCallback(async (user) => {
        try {
            const { data } = await api.post('/usuarios/registro', {
                uid: user.id,
                email: user.email,
                nombre: user.user_metadata?.full_name || user.email.split('@')[0]
            });
            setProfile(data);
        } catch (error) {
            console.error('Error al obtener perfil:', error);
            setProfile(null);
        }
    }, []);

    useEffect(() => {
        const initAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            if (session?.user) {
                await fetchProfile(session.user);
            }
            setLoading(false);
        };
        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            if (session?.user) {
                await fetchProfile(session.user);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [fetchProfile]);

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    const value = useMemo(
        () => ({
            user: session?.user ?? null,
            profile,
            token: session?.access_token ?? null,
            isAuthenticated: !!session,
            login,
            logout,
            loading,
            refreshProfile: () => session?.user && fetchProfile(session.user)
        }),
        [session, profile, loading, fetchProfile]
    );

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }

    return context;
};
