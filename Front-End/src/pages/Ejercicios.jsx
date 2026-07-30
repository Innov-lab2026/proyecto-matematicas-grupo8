import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Oval, ThreeDots } from "react-loader-spinner"; // ✅ npm install react-loader-spinner
import EjercicioInput from "../components/layouts/Ejercicios/Ejercicio1";
import EjercicioChoice from "../components/layouts/Ejercicios/Ejercicio2";
import api from "../config/api";
import { useAuth } from "../context/AuthContext";
import { useMascotContext } from "../mascotas/core/MascotProvider";

// Sección de respaldo si se entra a /ejercicios sin indicar cuál (ej. durante pruebas)
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
  const [enviando, setEnviando] = useState(false); // ✅ Estado para envío de respuesta

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

  // Se llama cuando el usuario responde (elige una opción o envía un número).
  const manejarRespuesta = async ({ opcionId, respuestaUsuario }) => {
    if (!ejercicioActual || enviando) return;
    
    try {
      setEnviando(true);
      const res = await api.post("/progreso", {
        escenarioId: ejercicioActual.id,
        ...(opcionId ? { opcionId } : { respuestaUsuario }),
      });
      setUltimoResultado(res.data);

      if (res.data.esCorrecto) {
        refreshProfile();
      }

      if (res.data.seccionAprobada) {
        console.log(
          `🏆 ¡Sección "${res.data.seccionAprobada}" aprobada! +${res.data.tokensGanados} tokens`,
        );
      }
    } catch (err) {
      console.error("Error al registrar progreso:", err);
    } finally {
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

  const manejarContinuar = () => {
    if (indexActual < escenarios.length - 1) {
      setIndexActual(indexActual + 1);
      setUltimoResultado(null);
    } else {
      alert(
        "🎉 ¡Felicidades! Has completado todos los ejercicios de esta sección.",
      );
      navigate("/dashboard");
    }
  };

  // ✅ Spinner de carga con react-loader-spinner
  if (cargando) {
    return (
      <div 
        className="ejercicio-page-container"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          gap: "1.5rem",
        }}
      >
        <Oval
          height={60}
          width={60}
          color="#28a745"
          secondaryColor="#e8f5e9"
          strokeWidth={4}
          strokeWidthSecondary={4}
          ariaLabel="cargando-ejercicios"
        />
        <p style={{ color: "#666", fontSize: "1rem", fontWeight: 500 }}>
          Cargando ejercicios...
        </p>
      </div>
    );
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

  // Ejercicios de tipo numérico
  if (ejercicioActual.tipo === "numerico") {
    return (
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
        enviando={enviando}
      />
    );
  }

  // Ejercicios de opción múltiple
  return (
    <EjercicioChoice
      pregunta={ejercicioActual.pregunta}
      imagenUrl={ejercicioActual.imagenUrl}
      opciones={ejercicioActual.opciones || []}
      onBack={manejarAtras}
      onContinue={manejarContinuar}
      onResponder={(opcionId) => manejarRespuesta({ opcionId })}
      ultimoResultado={ultimoResultado}
      enviando={enviando}
    />
  );
}

export default ModuloEjercicios;