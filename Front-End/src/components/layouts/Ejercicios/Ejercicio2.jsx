/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import ButtonContinue from "../../ui/ButtonContinue/ButtonContinue";
import "./Ejercicio.css";
import HeaderDesafio from "../Desafios/headerDesafio/HeaderDesafio";
import HeaderMate from "../HeaderMate/HeaderMate";
import { MascotWidget } from "../../../mascotas/components/MascotWidget";
import { useMascotContext } from "../../../mascotas/core/MascotProvider";

function EjercicioChoice({
  pregunta,
  imagenUrl,
  opciones = [], // [{ id, texto, esCorrecta }]
  onContinue,
  onResponder, // (opcionId) => void — informa al padre para registrar el progreso
  progreso = 0,
  mascotPosition = "bottom-left",
  mascotSize = 160,
  enviando = false, // ✅ Nuevo prop
  ultimoResultado = null, // ✅ Nuevo prop para recibir la respuesta del backend
}) {
  const isMobile = window.innerWidth <= 900;
  const datosChoiceDePrueba = {
    pregunta: "¿Cuánto es el 25% de 300?",
    opciones: [
      { id: -1, texto: "75", esCorrecta: true },
      { id: -2, texto: "100", esCorrecta: false },
      { id: -3, texto: "50", esCorrecta: false },
    ],
  };

  const preguntaActual = pregunta || datosChoiceDePrueba.pregunta;
  const opcionesActuales = opciones.length
    ? opciones
    : datosChoiceDePrueba.opciones;

  const [seleccionado, setSeleccionado] = useState(null);
  const [esCorrecto, setEsCorrecto] = useState(null);
  const [respuestaEnviada, setRespuestaEnviada] = useState(false); // ✅ Nuevo estado
  const { react, setState } = useMascotContext();

  // ✅ Resetear estado al cambiar de pregunta
  useEffect(() => {
    setSeleccionado(null);
    setEsCorrecto(null);
    setRespuestaEnviada(false);
    setState("idle");
  }, [preguntaActual, setState]);

  // ✅ Avanzar cuando el backend termina de procesar
  useEffect(() => {
    // Si ya se envió la respuesta y el backend ya respondió (enviando = false)
    if (respuestaEnviada && !enviando && esCorrecto === true) {
      setRespuestaEnviada(false);
      setSeleccionado(null);
      setEsCorrecto(null);
      // Avanzar al siguiente ejercicio
      onContinue();
    }
  }, [enviando, respuestaEnviada, esCorrecto, onContinue]);

  // ✅ Actualizar el estado con la respuesta del backend
  useEffect(() => {
    if (ultimoResultado && respuestaEnviada) {
      // El backend ya respondió, actualizar el estado de correcto
      setEsCorrecto(ultimoResultado.esCorrecto);
      
      if (ultimoResultado.esCorrecto) {
        react("celebration", "¡Excelente! Elegiste la opción correcta.");
      } else {
        react("sad", "Casi. Volvé a intentarlo, vos podés.");
      }
    }
  }, [ultimoResultado, respuestaEnviada, react]);

  const manejarSeleccion = (opcion) => {
    // ✅ No permitir seleccionar si ya está enviando, ya respondió correctamente, o ya se envió
    if (enviando || esCorrecto === true || respuestaEnviada) return;

    setSeleccionado(opcion.id);
    setRespuestaEnviada(true); // ✅ Marcar que se envió la respuesta

    // ❌ Ya no calculamos esCorrecto localmente, esperamos la respuesta del backend
    // El backend decidirá si es correcta o no

    // ✅ Enviar la respuesta al backend
    if (onResponder) {
      onResponder(opcion.id);
    }
  };

  return (
    <div className="ejercicio-page-container">
      <MascotWidget
        size={isMobile ? 90 : mascotSize}
        position={mascotPosition}
        showBubble={true}
      />

      <main className="ejercicio-page-content">
        <HeaderMate />
        <HeaderDesafio progreso={progreso} />

        <div className="ejercicio-choice-container">
          <h2 className="ejercicio-pregunta-centered">{preguntaActual}</h2>

          {imagenUrl && (
            <div
              className="card-imagen-wrapper"
              style={{ marginBottom: "2rem" }}
            >
              <img
                src={imagenUrl}
                alt="Material del ejercicio"
                className="ejercicio-imagen"
              />
            </div>
          )}

          <div className="options-grid">
            {opcionesActuales.map((opcion) => {
              let buttonClass = "option-button";
              
              // ✅ Mostrar feedback visual según la respuesta del backend
              if (seleccionado === opcion.id && !enviando && ultimoResultado) {
                if (ultimoResultado.esCorrecto) {
                  buttonClass += " option-correct";
                } else {
                  buttonClass += " option-incorrect";
                }
              }
              
              // ✅ Si está enviando y esta es la opción seleccionada, mostrar estado de carga
              if (seleccionado === opcion.id && enviando) {
                buttonClass += " option-loading";
              }

              return (
                <button
                  key={opcion.id}
                  className={buttonClass}
                  onClick={() => manejarSeleccion(opcion)}
                  type="button"
                  disabled={enviando || esCorrecto === true || respuestaEnviada}
                >
                  {seleccionado === opcion.id && enviando ? "⏳" : opcion.texto}
                </button>
              );
            })}
          </div>

          <div className="feedback-wrapper">
            {enviando && (
              <div className="alert-message alert-info animate-pop">
                <span>⏳ Verificando tu respuesta...</span>
              </div>
            )}
            {!enviando && ultimoResultado && seleccionado && (
              <>
                {ultimoResultado.esCorrecto === true && (
                  <div className="alert-message alert-success animate-pop">
                    <span>
                      🎉 ¡Excelente trabajo! Respuesta correcta. ¡Sigue así!
                      {ultimoResultado.puntosGanados > 0 && 
                        ` (+${ultimoResultado.puntosGanados} puntos)`}
                    </span>
                  </div>
                )}
                {ultimoResultado.esCorrecto === false && (
                  <div className="alert-message alert-danger animate-pop">
                    <span>
                      💪 ¡Casi lo tienes! Intenta analizar la pregunta nuevamente.
                      {ultimoResultado.feedback && 
                        ` ${ultimoResultado.feedback}`}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="ejercicio-footer">
          <ButtonContinue 
            onClick={onContinue} 
            disabled={esCorrecto !== true || enviando} // ✅ Deshabilitar mientras carga
          />
        </div>
      </main>
    </div>
  );
}

export default EjercicioChoice;