/* eslint-disable react-hooks/preserve-manual-memoization */
import { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { supabase } from '../config/supabaseClient';
import api from '../config/api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const lastFetchedId = useRef(null);
  const isFetching = useRef(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const initializationAttempted = useRef(false); // ✅ Evita múltiples inicializaciones

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("⚠️ Error al cerrar sesión en Supabase, limpiando estado local.", err);
    } finally {
      setSession(null);
      setProfile(null);
      setIsNewUser(false);
      lastFetchedId.current = null;
      setLoading(false);
      setInitialized(true); // ✅ Asegurar que se marque como inicializado
    }
  }, []);

  const fetchProfile = useCallback(async (user) => {
    if (!user?.id || isFetching.current) return;

    if (profile?.id === user.id && lastFetchedId.current === user.id) {
      console.log(`✅ Perfil ya cargado para ${user.id}`);
      return;
    }

    isFetching.current = true;
    try {
      console.log(`🔄 Obteniendo perfil para: ${user.id}`);

      const response = await api.post("/usuarios/registro", {
        uid: user.id,
        email: user.email,
        nombre: user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuario",
      });

      const data = response.data;

      if (data) {
        setProfile(data);
        lastFetchedId.current = user.id;

        const hasOnboardingData =
          data.edad && data.edad.trim() !== '' &&
          data.desafio && data.desafio.trim() !== '' &&
          data.genero !== null &&
          data.sentimiento !== null;

        const isNew = !hasOnboardingData || data.isNew === true;

        setIsNewUser(isNew);

        console.log(`👤 Perfil cargado: ${data.nombre}`);
        console.log(`   📊 Puntos: ${data.puntos}`);
        console.log(`   📝 Edad: ${data.edad || 'No definida'}`);
        console.log(`   🎯 Desafío: ${data.desafio || 'No definido'}`);
        console.log(`   🆕 ¿Usuario nuevo? ${isNew ? 'SÍ' : 'NO'}`);
      }
    } catch (error) {
      console.error("🔴 Error de sincronización con Back-End:", error.message);

      if (error.response?.status === 401) {
        console.warn("⚠️ Sesión inválida detectada. Limpiando...");
        await logout();
      } else if (
        error.code === "ERR_NETWORK" ||
        error.code === "ECONNABORTED" ||
        !error.response
      ) {
        lastFetchedId.current = null;
      }
      setProfile(null);
      setIsNewUser(false);
    } finally {
      isFetching.current = false;
    }
  }, [profile?.id, logout]);

  // ✅ Función para marcar como inicializado
  const markInitialized = useCallback(() => {
    if (!initialized) {
      console.log('✅ Auth inicializado correctamente');
      setInitialized(true);
      setLoading(false);
    }
  }, [initialized]);

  // ✅ Efecto de inicialización mejorado - SIN TIMEOUT AGRESIVO
  useEffect(() => {
    // ✅ Evitar múltiples inicializaciones
    if (initializationAttempted.current) return;
    initializationAttempted.current = true;

    let isMounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🔍 Verificando sesión en Supabase...');
        
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();

        if (error) {
          console.warn("⚠️ Error al obtener sesión:", error);
        }

        if (currentSession?.user) {
          console.log("✅ Sesión existente encontrada");
          setSession(currentSession);
          await fetchProfile(currentSession.user);
        } else {
          console.log("ℹ️ No hay sesión activa");
          setSession(null);
          setProfile(null);
          setIsNewUser(false);
        }
      } catch (error) {
        console.error("🔴 Error en inicialización:", error);
        setSession(null);
        setProfile(null);
        setIsNewUser(false);
      } finally {
        if (isMounted) {
          markInitialized();
        }
      }
    };

    initializeAuth();

    // ✅ Suscripción a cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.log(`🔐 AuthEvent: ${_event}`);

      if (!isMounted) return;

      // ✅ IMPORTANTE: Si el evento es SIGNED_IN, esperar a que se cargue el perfil
      if (_event === 'SIGNED_IN' && newSession?.user) {
        console.log('🔄 Usuario ha iniciado sesión, verificando onboarding...');
        setSession(newSession);
        // Forzar la obtención del perfil
        lastFetchedId.current = null;
        fetchProfile(newSession.user).then(() => {
          // Asegurar que el estado esté actualizado
          if (!initialized) {
            markInitialized();
          }
        });
        return;
      }

      if (_event === 'USER_UPDATED' && newSession?.user) {
        console.log('🔄 Usuario actualizado, refrescando perfil...');
        if (lastFetchedId.current === newSession.user.id) {
          fetchProfile(newSession.user);
        }
        return;
      }

      if (_event === 'SIGNED_OUT') {
        console.log('🚪 Usuario cerró sesión');
        setSession(null);
        setProfile(null);
        setIsNewUser(false);
        lastFetchedId.current = null;
        // ✅ Asegurar que se marque como inicializado después del logout
        if (!initialized) {
          markInitialized();
        }
        return;
      }

      // Manejo genérico para otros eventos
      setSession(newSession || null);

      if (newSession?.user) {
        if (lastFetchedId.current !== newSession.user.id) {
          lastFetchedId.current = newSession.user.id;
          fetchProfile(newSession.user);
        }
      } else {
        setProfile(null);
        setIsNewUser(false);
        lastFetchedId.current = null;
      }

      if (!initialized) {
        markInitialized();
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile, markInitialized, initialized]);

  const completeOnboarding = useCallback(async (additionalData = {}) => {
    if (!session?.user) return;

    try {
      setLoading(true);
      const { data } = await api.put(`/usuarios/${session.user.id}`, {
        ...additionalData,
        onboardingCompleto: true,
      });

      if (data) {
        setProfile(data);
        setIsNewUser(false);
        console.log('✅ Onboarding completado exitosamente');
      }
    } catch (error) {
      console.error('❌ Error al completar onboarding:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [session?.user]);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.status === 400) throw error;
        throw new Error("SUPABASE_UNAVAILABLE");
      }

      if (data.user) {
        lastFetchedId.current = null;
        await fetchProfile(data.user);
      }
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      const isMockMode = !import.meta.env.VITE_SUPABASE_URL ||
        import.meta.env.VITE_SUPABASE_URL.includes("[TU_PROYECTO]");

      if (isMockMode || err.message === "SUPABASE_UNAVAILABLE") {
        console.warn("⚠️ Usando autenticación de respaldo (Back-End Mock)");
        const response = await api.post("/usuarios/login", { email, password });
        if (response.data) {
          const mockSession = {
            user: { email, id: response.data.user?.id || "local-auth" },
            access_token: response.data.user?.token || "local-mock-token",
          };
          setSession(mockSession);
          if (mockSession.user) {
            lastFetchedId.current = null;
            await fetchProfile(mockSession.user);
          }
        }
        return response.data;
      }
      throw err;
    }
  }, [fetchProfile]);

  const register = useCallback(async (email, password, nombre, extraData = {}) => {
    try {
      setRegisterLoading(true);
      
      const redirectUrl = "https://matemas.vercel.app/auth/callback";
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: nombre, ...extraData },
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) throw error;

      setRegisterLoading(false);
      return data;
    } catch (err) {
      setRegisterLoading(false);
      
      if (err.message === "SUPABASE_UNAVAILABLE_MOCK" || err.status === 400) {
        console.warn("⚠️ Supabase no disponible. Modo de autenticación local");
        const response = await api.post("/usuarios/registro", {
          uid: "mock-" + Date.now(),
          email,
          password,
          nombre,
          ...extraData,
        });
        if (response.data) {
          const mockSession = {
            user: { email, id: "local-auth" },
            access_token: "local-mock-token",
          };
          setSession(mockSession);
          if (mockSession.user) {
            lastFetchedId.current = null;
            await fetchProfile(mockSession.user);
          }
        }
        return response.data;
      }
      throw err;
    }
  }, [fetchProfile]);

  const loginWithGoogle = useCallback(async (redirectTo) => {
    try {
      setGoogleLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
      return data;
    } catch (err) {
      setGoogleLoading(false);
      throw err;
    }
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      profile,
      token: session?.access_token ?? null,
      isAuthenticated: !!session && !!profile,
      isNewUser,
      loading,
      registerLoading,
      googleLoading,
      initialized,
      login,
      register,
      logout,
      loginWithGoogle,
      completeOnboarding,
      refreshProfile: () => session?.user && fetchProfile(session.user),
      shouldShowOnboarding: isNewUser && !!session && !!profile,
      shouldShowDashboard: !isNewUser && !!session && !!profile,
      shouldShowLogin: !session && initialized && !loading,
    }),
    [session, profile, isNewUser, loading, registerLoading, googleLoading, initialized,
      login, register, logout, loginWithGoogle, completeOnboarding, fetchProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};