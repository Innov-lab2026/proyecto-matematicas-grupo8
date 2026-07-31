import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Register from "../pages/Register";
import Landing from '../pages/Landing.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';
import LoginPage from '../pages/Login';
import ConsolaAdmin from '../pages/ConsolaAdmin';
import { useAuth } from '../context/AuthContext';
import StartedPage from '../pages/Started.jsx';
import Onboarding from '../pages/Onboarding';
import Nosotros from '../pages/Nosotros.jsx';
import Desafios from '../pages/Desafios.jsx';
import AuthCallback from '../pages/AuthCallback.jsx';
import ModuloEjercicios from '../pages/Ejercicios.jsx';
import DragConstraints from '../components/layouts/Ejercicios/DropAndDown.jsx';
import TermsOfService from '../pages/TermsOfService.jsx';
import MixtoPage from '../pages/Mixto.jsx';
import RankingPage from '../pages/Ranking.jsx';
import Configuracion from '../components/layouts/Configuracion/Configuracion.jsx';
import Perfil from '../components/layouts/Perfil/Perfil.jsx';
import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";

// ✅ Componente para proteger rutas autenticadas
const ProtectedRoute = ({ children, requireOnboarding = false }) => {
  const { user, profile, shouldShowOnboarding, loading, initialized, profileError, refreshProfile, logout } = useAuth();
  const location = useLocation();
  console.log({ user, profile, shouldShowOnboarding, loading, initialized });
  // ⏳ Esperar a que termine la inicialización
  if (loading || !initialized) {
    return <LoadingSpinner message="Validando sesión..." />;
  }

  // 🔐 Si no está autenticado, redirigir a login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // ⏳ Si hay sesión pero aún no llega el perfil, evitar rebote a login/dashboard.
  if (!profile) {
    if (profileError) {
      return (
        <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem", textAlign: "center" }}>
          <div>
            <h2>No pudimos cargar tu perfil</h2>
            <p style={{ color: "#666" }}>{profileError}</p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "1rem" }}>
              <button type="button" onClick={() => refreshProfile()}>Reintentar</button>
              <button type="button" onClick={() => logout()}>Cerrar sesión</button>
            </div>
          </div>
        </div>
      );
    }
    return <LoadingSpinner message="Cargando tu perfil..." />;
  }

  // 🎯 Ruta exclusiva para onboarding: si ya completó, enviar al dashboard.
  if (requireOnboarding) {
    return shouldShowOnboarding ? children : <Navigate to="/dashboard" replace />;
  }

  // 🎯 Si todavía necesita onboarding, cualquier otra ruta protegida debe ir allí.
  if (shouldShowOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  // ✅ Si todo está bien, mostrar la ruta
  return children;
};

// ✅ Componente para rutas públicas (no autenticadas)
const PublicRoute = ({ children, redirectAuthenticated = true }) => {
  const { user, profile, shouldShowOnboarding, loading, initialized, registerLoading, profileError, refreshProfile, logout } = useAuth();

  // ⏳ Esperar a que termine la inicialización
  if (loading || !initialized) {
    return <LoadingSpinner message="Iniciando sesión..." />;
  }

  // ⏳ Mostrar spinner durante el registro
  if (registerLoading) {
    return <LoadingSpinner message="Creando tu cuenta..." />;
  }

  // 🔓 Si no está autenticado, mostrar la ruta pública
  if (!user) {
    return children;
  }

  // ⏳ Hay sesión activa pero todavía se está resolviendo el perfil.
  if (!profile) {
    if (profileError) {
      return (
        <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem", textAlign: "center" }}>
          <div>
            <h2>No pudimos cargar tu perfil</h2>
            <p style={{ color: "#666" }}>{profileError}</p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "1rem" }}>
              <button type="button" onClick={() => refreshProfile()}>Reintentar</button>
              <button type="button" onClick={() => logout()}>Cerrar sesión</button>
            </div>
          </div>
        </div>
      );
    }
    return <LoadingSpinner message="Cargando tu perfil..." />;
  }

  // 🔒 Si está autenticado y debe redirigir
  if (redirectAuthenticated) {
    if (shouldShowOnboarding) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default function AppRouter() {
  const { loading, initialized } = useAuth();

  // ⏳ Loading global mientras se inicializa la autenticación
  if (loading || !initialized) {
    return <LoadingSpinner message="Iniciando sesión..." />;
  }

  return (
    <Router>
      <Routes>
        {/* 🌐 Rutas públicas (siempre accesibles) */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/TermsOfService" element={<TermsOfService />} />
        <Route path="/nosotros" element={<Nosotros />} />

        {/* 📄 Landing - Página principal pública */}
        <Route
          path="/"
          element={
            <PublicRoute redirectAuthenticated={false}>
              <Landing />
            </PublicRoute>
          }
        />

        {/* 🚀 Started - Pre-onboarding */}
        <Route
          path="/started"
          element={
            <PublicRoute>
              <StartedPage />
            </PublicRoute>
          }
        />

        {/* 🔐 Login y Register - Solo para no autenticados */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* 📚 Rutas de previsualización (públicas) */}
        <Route path="/desafios" element={<Desafios />} />
        <Route path="/ejercicios/:seccionId?" element={<ModuloEjercicios />} />
        <Route path="/ejercicios2" element={<DragConstraints />} />

        {/* 🔒 Rutas protegidas (requieren autenticación) */}

        {/* 🎯 Onboarding - Solo para usuarios nuevos */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute requireOnboarding>
              <Onboarding />
            </ProtectedRoute>
          }
        />

        {/* 📊 Dashboard - Ruta principal después del onboarding */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* 👤 Perfil y Configuración */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/configuracion"
          element={
            <ProtectedRoute>
              <Configuracion />
            </ProtectedRoute>
          }
        />

        {/* 🏆 Ranking */}
        <Route
          path="/ranking"
          element={
            <ProtectedRoute>
              <RankingPage />
            </ProtectedRoute>
          }
        />

        {/* 🎮 Mixto y Ejercicios */}
        <Route
          path="/mixto"
          element={
            <ProtectedRoute>
              <MixtoPage />
            </ProtectedRoute>
          }
        />

        {/* 🔧 Administración */}
        <Route
          path="/admin-be"
          element={
            <ProtectedRoute>
              <ConsolaAdmin />
            </ProtectedRoute>
          }
        />

        {/* 🛠️ Ruta de desarrollo */}
        {import.meta.env.DEV && (
          <Route path="/dev-Dashboard" element={<Perfil />} />
        )}

        {/* ❌ 404 - Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}