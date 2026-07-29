/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { supabase } from '../config/supabaseClient';
import api from '../config/api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false); // ✅ Nuevo: indica si es usuario nuevo
  const lastFetchedId = useRef(null);
  const isFetching = useRef(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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
    }
  }, []);

  // ✅ fetchProfile mejorado: detecta si es usuario nuevo
  const fetchProfile = useCallback(async (user) => {
    if (!user?.id || isFetching.current) return;

    // Si ya tenemos este perfil y no es un evento de login forzado, no repetir
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

        // ✅ Detectar si es usuario nuevo (basado en la respuesta del backend)
        // Asumimos que el backend devuelve un campo `isNew` o similar
        // O podemos detectar por la ausencia de datos adicionales
        const isNew = data.isNew || !data.puntos || data.puntos === 0;
        setIsNewUser(isNew);

        console.log(`👤 Perfil cargado: ${data.nombre} (${isNew ? 'NUEVO' : 'EXISTENTE'})`);
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

  const completeInitialization = useCallback(() => {
    if (!initialized) {
      setInitialized(true);
      setLoading(false);
    }
  }, [initialized]);

  // ✅ Efecto de inicialización mejorado
  useEffect(() => {
    let isMounted = true;
    let timeoutId = null;

    timeoutId = setTimeout(() => {
      if (isMounted && !initialized) {
        console.warn("⚠️ Timeout de inicialización - forzando carga");
        completeInitialization();
      }
    }, 3000);

    const initializeAuth = async () => {
      try {
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
      } finally {
        if (isMounted) {
          completeInitialization();
        }
      }
    };

    initializeAuth();

    // ✅ Suscripción a cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.log(`🔐 AuthEvent: ${_event}`);

      if (!isMounted) return;

      // ✅ Evento SIGNED_IN: usuario acaba de iniciar sesión
      if (_event === 'SIGNED_IN' && newSession?.user) {
        console.log('🔄 Usuario ha iniciado sesión, verificando onboarding...');
        setSession(newSession);
        // Forzar la obtención del perfil (podría ser nuevo)
        lastFetchedId.current = null;
        fetchProfile(newSession.user);
        return;
      }

      // ✅ Evento USER_UPDATED: usuario actualizó datos (ej. completó onboarding)
      if (_event === 'USER_UPDATED' && newSession?.user) {
        console.log('🔄 Usuario actualizado, refrescando perfil...');
        if (lastFetchedId.current === newSession.user.id) {
          // Refrescar perfil sin cambiar la bandera de nuevo usuario
          fetchProfile(newSession.user);
        }
        return;
      }

      // ✅ Evento SIGNED_OUT: cerró sesión
      if (_event === 'SIGNED_OUT') {
        console.log('🚪 Usuario cerró sesión');
        setSession(null);
        setProfile(null);
        setIsNewUser(false);
        lastFetchedId.current = null;
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
        completeInitialization();
      }
    });

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [fetchProfile, completeInitialization, initialized]);

  // ✅ Función para marcar onboarding como completado
  const completeOnboarding = useCallback(async (additionalData = {}) => {
    if (!session?.user) return;

    try {
      setLoading(true);
      // Actualizar perfil en el backend
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
        // Forzar recarga del perfil (puede ser nuevo usuario)
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
      const redirectUrl = "https://matemas.vercel.app/auth/callback";
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: nombre, ...extraData },
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) throw error;

      // Después del registro, el usuario debe ser redirigido al onboarding
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
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

  // ✅ Valor del contexto con todas las propiedades necesarias
  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      profile,
      token: session?.access_token ?? null,
      isAuthenticated: !!session && !!profile,
      isNewUser,
      loading,
      googleLoading,
      initialized,
      login,
      register,
      logout,
      loginWithGoogle,
      completeOnboarding,
      refreshProfile: () => session?.user && fetchProfile(session.user),
      // ✅ Utilidades para el enrutamiento
      shouldShowOnboarding: isNewUser && !!session && !!profile,
      shouldShowDashboard: !isNewUser && !!session && !!profile,
      shouldShowLogin: !session && !loading && initialized,
    }),
    [session, profile, isNewUser, loading, googleLoading, initialized,
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