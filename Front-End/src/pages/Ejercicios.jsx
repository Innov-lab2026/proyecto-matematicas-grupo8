import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Oval } from "react-loader-spinner"; // ✅ npm install react-loader-spinner
import EjercicioInput from "../components/layouts/Ejercicios/Ejercicio1";
import EjercicioChoice from "../components/layouts/Ejercicios/Ejercicio2";
import api from "../config/api";
import { useAuth } from "../context/AuthContext";
import { useMascotContext } from "../mascotas/core/MascotProvider";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import '../components/layouts/Ejercicios/ModuloEjercicios.css';

const SECCION_ID_POR_DEFECTO = 7;

function ModuloEjercicios() {
  const navigate = useNavigate();
  const { seccionId } = useParams();
  const { profile, refreshProfile } = useAuth();
  const { mascotId, setMascot, setState } = useMascotContext();
  const idSeccionActual = seccionId || SECCION_ID_POR_DEFECTO;

  const [escenarios, setEscenarios] = useState([]);
  const [indexActual, setIndexActual] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [ultimoResultado, setUltimoResultado] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    correctas: 0,
    respondidas: 0,
    xpGanado: 0,
    monedasGanadas: 0,
    racha: profile?.racha ?? 0,
    seccionNombre: null,
    seccionAprobada: false,
  });

  const progresoRonda = escenarios.length
    ? Math.round(((indexActual + 1) / escenarios.length) * 100)
    : 0;

  useEffect(() => {
    const mascotaSeleccionada = profile?.mascota || mascotId;
    if (mascotaSeleccionada && mascotId !== mascotaSeleccionada) {
      setMascot(mascotaSeleccionada);
    }
    setState("idle");
  }, [profile?.mascota, mascotId, setMascot, setState]);

  useEffect(() => {
    let activo = true;
    const loadingTimer = window.setTimeout(() => {
      if (!activo) return;
      setCargando(true);
      setError(null);
    }, 0);

    api
      .get(`/secciones/${idSeccionActual}/escenarios`)
      .then((res) => {
        if (!activo) return;
        setEscenarios(res.data || []);
        setIndexActual(0);
      })
      .catch((err) => {
        if (!activo) return;
        console.error("Error al cargar ejercicios:", err);
        setError(
          "No se pudieron cargar los ejercicios. Intentá de nuevo más tarde.",
        );
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
      window.clearTimeout(loadingTimer);
    };
  }, [idSeccionActual]);

  const ejercicioActual = escenarios[indexActual];

  const manejarRespuesta = async ({ opcionId, respuestaUsuario }) => {
    if (!ejercicioActual || enviando) return;

    try {
      setEnviando(true);
      setUltimoResultado(null);
      const res = await api.post("/progreso", {
        escenarioId: ejercicioActual.id,
        ...(opcionId ? { opcionId } : { respuestaUsuario }),
      });
      setUltimoResultado(res.data);
      // Desbloquear UI antes de refrescar perfil (el refresh no debe trabar el feedback)
      setEnviando(false);

      setSessionStats((prev) => ({
        correctas: prev.correctas + (res.data.esCorrecto ? 1 : 0),
        respondidas: prev.respondidas + 1,
        xpGanado: prev.xpGanado + (res.data.puntosGanados ?? 0),
        monedasGanadas: prev.monedasGanadas + (res.data.tokensGanados ?? 0),
        racha: res.data.racha ?? prev.racha,
        seccionNombre: res.data.seccionAprobada || prev.seccionNombre,
        seccionAprobada: prev.seccionAprobada || Boolean(res.data.seccionAprobada),
      }));

      if (
        res.data.esCorrecto ||
        Boolean(res.data.seccionAprobada) ||
        (res.data.tokensGanados ?? 0) > 0 ||
        (res.data.nuevosDesbloqueos?.length ?? 0) > 0
      ) {
        refreshProfile().catch((err) =>
          console.warn("No se pudo refrescar el perfil:", err),
        );
      }
    } catch (err) {
      console.error("Error al registrar progreso:", err);
      setEnviando(false);
    }
  };

  const manejarAtras = () => {
    if (indexActual > 0) {
      setIndexActual(indexActual - 1);
      setUltimoResultado(null);
    } else {
      navigate("/dashboard");
    }
  };

  const manejarContinuar = async () => {
    if (indexActual < escenarios.length - 1) {
      setIndexActual(indexActual + 1);
      setUltimoResultado(null);
      return;
    }

    try {
      await refreshProfile();
    } catch {
      /* ignore */
    }

    const total = Math.max(sessionStats.respondidas, escenarios.length, 1);
    const porcentajeCorrectas = Math.round(
      (sessionStats.correctas / total) * 100,
    );
    // Si acabamos de aprobar, el perfil en memoria puede estar un tick atrasado.
    const aprobadas =
      (profile?.seccionesAprobadasCount ?? 0) +
      (sessionStats.seccionAprobada && sessionStats.monedasGanadas > 0 ? 1 : 0);
    const progresoGlobal =
      profile?.totalSecciones > 0
        ? Math.min(
            100,
            Math.round((aprobadas / profile.totalSecciones) * 100),
          )
        : null;

    navigate("/leccion-completa", {
      replace: true,
      state: {
        rewards: {
          racha: sessionStats.racha || profile?.racha || 1,
          xpGanado: sessionStats.xpGanado,
          xpTotal: (profile?.puntos ?? 0) + sessionStats.xpGanado,
          monedasGanadas: sessionStats.monedasGanadas,
          porcentajeCorrectas,
          progresoGlobal,
          seccionNombre:
            sessionStats.seccionNombre ||
            ejercicioActual?.categoria ||
            "Módulo completado",
          seccionAprobada: sessionStats.seccionAprobada,
        },
      },
    });
  };

  if (cargando) {
    return <LoadingSpinner message="Cargando ejercicios..." />;
  }

  if (error) {
    return (
      <div
        className="ejercicio-page-container"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          gap: "1rem",
          padding: "2rem",
        }}
      >
        <p style={{ color: "#dc2626", fontSize: "1rem", textAlign: "center" }}>
          {error}
        </p>
        <button
          onClick={() => {
            setCargando(true);
            setError(null);
            api
              .get(`/secciones/${idSeccionActual}/escenarios`)
              .then((res) => {
                setEscenarios(res.data || []);
                setIndexActual(0);
                setCargando(false);
              })
              .catch((err) => {
                console.error("Error al cargar ejercicios:", err);
                setError("No se pudieron cargar los ejercicios. Intentá de nuevo más tarde.");
                setCargando(false);
              });
          }}
          style={{
            padding: "0.5rem 1.5rem",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (escenarios.length === 0) {
    return (
      <div
        className="ejercicio-page-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <p style={{ padding: "2rem", color: "#666", fontSize: "1.1rem" }}>
          Todavía no hay ejercicios cargados para esta sección.
        </p>
      </div>
    );
  }

  // ✅ Renderizar con overlay de carga
  return (
    <div className="ejercicio-wrapper">
      {/* Contenido principal */}
      <div className="ejercicio-content">
        {ejercicioActual.tipo === "numerico" ? (
          <EjercicioInput
            pregunta={ejercicioActual.pregunta}
            imagenUrl={ejercicioActual.imagenUrl}
            respuestaCorrecta={ejercicioActual.respuestaCorrecta}
            onBack={manejarAtras}
            onContinue={manejarContinuar}
            onResponder={(respuestaUsuario) =>
              manejarRespuesta({ respuestaUsuario })
            }
            ultimoResultado={ultimoResultado}
            enviando={enviando} // ✅ Pasar el estado
            progreso={progresoRonda}
          />
        ) : (
          <EjercicioChoice
            pregunta={ejercicioActual.pregunta}
            imagenUrl={ejercicioActual.imagenUrl}
            opciones={ejercicioActual.opciones || []}
            onBack={manejarAtras}
            onContinue={manejarContinuar}
            onResponder={(opcionId) => manejarRespuesta({ opcionId })}
            ultimoResultado={ultimoResultado}
            enviando={enviando} // ✅ Pasar el estado
            progreso={progresoRonda}
          />
        )}
      </div>

      {/* ✅ Spinner overlay - transparente, no tapa a la mascota */}
      {enviando && (
        <div className="spinner-overlay" style={{ backgroundColor: "transparent !important" }}>
          <div className="spinner-container">
            <Oval
              height={50}
              width={50}
              color="#28a745"
              secondaryColor="#e8f5e9"
              strokeWidth={4}
              strokeWidthSecondary={4}
              ariaLabel="verificando-respuesta"
            />
            <p className="spinner-text">Verificando respuesta...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModuloEjercicios;