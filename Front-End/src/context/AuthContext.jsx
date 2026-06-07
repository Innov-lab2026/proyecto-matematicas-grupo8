import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import api from '../config/api';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isRealSupabaseConfigured = supabaseUrl &&
                                 supabaseKey &&
                                 !supabaseUrl.includes('[') &&
                                 !supabaseKey.includes('key') &&
                                 import.meta.env.VITE_DATA_SOURCE !== 'MOCK';

export const supabase = isRealSupabaseConfigured
    ? createClient(supabaseUrl, supabaseKey)
    : {
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signInWithPassword: async ({ email }) => {
                const usuariosExistentes = ['admin@test.com', 'cesar@test.com', 'invitado@test.com'];
                if (!usuariosExistentes.includes(email.toLowerCase())) {
                    return { data: { user: null, session: null }, error: new Error('El correo ingresado no figura en nuestra base de datos.') };
                }
                return {
                    data: { user: { id: 'mock-uid-123', email, user_metadata: { full_name: 'Usuario Mock' } }, session: { access_token: 'mock-token-abc' } },
                    error: null
                };
            },
            signUp: async ({ email, options }) => ({
                data: { user: { id: 'mock-uid-123', email, user_metadata: options?.data || {} }, session: { access_token: 'mock-token' } },
                error: null
            }),
            signOut: async () => ({ error: null })
        }
    };

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
            setProfile(data || null);
        } catch (error) {
            console.error('Fallo la conexion con el Back-End:', error.message);
            setProfile(null);
        }
    }, []);

    useEffect(() => {
        const initAuth = async () => {
            console.log('🔐 AuthContext: Iniciando validación de sesión...');
            try {
                // Creamos una promesa que falla a los 4 segundos
                const timeout = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout Supabase')), 4000)
                );

                console.log('🛰️ AuthContext: Solicitando sesión (con timeout)...');

                // Competencia: lo que pase primero (la respuesta o el timeout)
                const { data: { session } } = await Promise.race([
                    supabase.auth.getSession(),
                    timeout
                ]);

                console.log('✅ AuthContext: Sesión recibida:', session ? 'Logueado' : 'Anónimo');
                setSession(session || null);
                // fetchProfile se ejecutará vía onAuthStateChange automáticamente
            } catch (err) {
                console.warn('⚠️ AuthContext: No se pudo recuperar sesión (posible bloqueo de red o timeout):', err.message);
                setSession(null);
            } finally {
                console.log('🔐 AuthContext: Finalizando estado de carga.');
                setLoading(false);
            }
        };

        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session || null);
            if (session?.user) {
                await fetchProfile(session.user);
            } else {
                setProfile(null);
            }
        });

        return () => subscription.unsubscribe();
    }, [fetchProfile]);

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    };

    const signUp = async (email, password, nombre) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: nombre } }
        });
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
            signUp,
            logout,
            loading,
            refreshProfile: () => session?.user && fetchProfile(session.user)
        }),
        [session, profile, loading, fetchProfile]
    );

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#1a1a1a', color: '#00ff00' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h3>InnovaLab</h3>
                        <p>Cargando módulos de seguridad...</p>
                    </div>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }

    return context;
};
