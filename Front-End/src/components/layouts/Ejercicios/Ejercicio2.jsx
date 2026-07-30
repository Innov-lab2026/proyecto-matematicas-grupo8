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
  mascotPosition = "bottom-left",
  mascotSize = 160,
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
  const { react, setState } = useMascotContext();

  useEffect(() => {
    setSeleccionado(null);
    setEsCorrecto(null);
    setState("idle");
  }, [preguntaActual, setState]);

  const manejarSeleccion = (opcion) => {
    if (esCorrecto) return;

    setSeleccionado(opcion.id);
    setEsCorrecto(opcion.esCorrecta);

    if (opcion.esCorrecta) {
      react("celebration", "¡Excelente! Elegiste la opción correcta.");
    } else {
      react("sad", "Casi. Volvé a intentarlo, vos podés.");
    }

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
        <HeaderDesafio progreso={100} />

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
              if (seleccionado === opcion.id) {
                buttonClass += esCorrecto
                  ? " option-correct"
                  : " option-incorrect";
              }

              return (
                <button
                  key={opcion.id}
                  className={buttonClass}
                  onClick={() => manejarSeleccion(opcion)}
                  type="button"
                >
                  {opcion.texto}
                </button>
              );
            })}
          </div>

          <div className="feedback-wrapper">
            {esCorrecto === true && (
              <div className="alert-message alert-success animate-pop">
                <span>
                  🎉 ¡Excelente trabajo! Respuesta correcta. ¡Sigue así!
                </span>
              </div>
            )}
            {esCorrecto === false && (
              <div className="alert-message alert-danger animate-pop">
                <span>
                  💪 ¡Casi lo tienes! Intenta analizar la pregunta nuevamente.
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="ejercicio-footer">
          <ButtonContinue onClick={onContinue} disabled={esCorrecto !== true} />
        </div>
      </main>
    </div>
  );
}

export default EjercicioChoice;
