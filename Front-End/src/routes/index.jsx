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
  const { isAuthenticated, shouldShowOnboarding, loading, initialized } = useAuth();
  const location = useLocation();

  // ⏳ Esperar a que termine la inicialización
  if (loading || !initialized) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  // 🔐 Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // 🎯 Si requiere onboarding y el usuario es nuevo, redirigir
  if (requireOnboarding && shouldShowOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  // ✅ Si todo está bien, mostrar la ruta
  return children;
};

// ✅ Componente para rutas públicas (no autenticadas)
const PublicRoute = ({ children, redirectAuthenticated = true }) => {
  const { isAuthenticated, shouldShowOnboarding, loading, initialized, registerLoading } = useAuth();

  // ⏳ Esperar a que termine la inicialización
  if (loading || !initialized) {
    return <LoadingSpinner message="Iniciando sesión..." />;
  }

  // ⏳ Mostrar spinner durante el registro
  if (registerLoading) {
    return <LoadingSpinner message="Creando tu cuenta..." />;
  }

  // 🔓 Si no está autenticado, mostrar la ruta pública
  if (!isAuthenticated) {
    return children;
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
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto"></div>
          <p className="text-white mt-4">Iniciando sesión...</p>
        </div>
      </div>
    );
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