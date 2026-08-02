import React, { useState, useRef, useEffect } from 'react';
import HeaderDashboard from '../Desafios/headerDash/HeaderDash';
import avatarUser from '../../../assets/Foto_perfil.png'; 
import './Configuracion.css';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../config/api';

function Configuracion() {
  const { profile, refreshProfile } = useAuth();
  const [showHeader, setShowHeader] = useState(false);

  // Datos del formulario
  const [formData, setFormData] = useState({
    nombre: profile?.nombre || '',
    email: profile?.email || '',
    password: '*************'
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      nombre: profile?.nombre || '',
      email: profile?.email || '',
    }));
  }, [profile?.nombre, profile?.email]);

  // Estados para saber qué campos están en modo edición
  const [isEditing, setIsEditing] = useState({
    nombre: false,
    email: false,
    password: false
  });

  // Estado para controlar la visibilidad del modal de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Referencias para hacer auto-focus al hacer clic en el lápiz
  const nombreInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const refs = {
    nombre: nombreInputRef,
    email: emailInputRef,
    password: passwordInputRef
  };

  // Cambiar valor de los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Activar la edición de un campo específico
  const toggleEdit = (field) => {
    setIsEditing(prev => {
      const newState = { ...prev, [field]: !prev[field] };
      
      // Si pasa a estar activo, le hacemos focus automático al input
      if (newState[field]) {
        setTimeout(() => {
          refs[field].current?.focus();
        }, 50);
      }
      return newState;
    });
  };

  // Guardar Cambios
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsEditing({ nombre: false, email: false, password: false });
    try {
      await api.put('/usuarios/perfil', { nombre: formData.nombre });
      await refreshProfile?.();
      alert('¡Cambios guardados con éxito!');
    } catch (err) {
      console.error(err);
      alert('No se pudieron guardar los cambios. Intentá de nuevo.');
    }
  };

  // Eliminar Cuenta
  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    alert('Cuenta eliminada correctamente.');
    // Redirigir a inicio o hacer logout según la lógica de tu App
  };

  return (
    <div className="config-page-container">
      <HeaderDashboard showHeader={showHeader} setShowHeader={setShowHeader} />

      <main className="config-main-content">
        <div className="config-card">
          
          <h1 className="config-title">Configuración</h1>

          {/* Imagen de Perfil */}
          <div className="config-avatar-wrapper">
            <img src={avatarUser} alt="Foto de perfil" className="config-avatar-img" />
          </div>

          <form onSubmit={handleSaveChanges} className="config-form">
            
            {/* Campo Nombre */}
            <div className="config-field-group">
              <label htmlFor="nombre">Nombre</label>
              <div className={`config-input-wrapper ${isEditing.nombre ? 'is-active' : ''}`}>
                <input
                  id="nombre"
                  ref={nombreInputRef}
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  disabled={!isEditing.nombre}
                />
                <button
                  type="button"
                  className="pencil-btn"
                  onClick={() => toggleEdit('nombre')}
                  aria-label="Editar nombre"
                >
                  ✏️
                </button>
              </div>
            </div>

            {/* Campo Email */}
            <div className="config-field-group">
              <label htmlFor="email">Email</label>
              <div className={`config-input-wrapper ${isEditing.email ? 'is-active' : ''}`}>
                <input
                  id="email"
                  ref={emailInputRef}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing.email}
                />
                <button
                  type="button"
                  className="pencil-btn"
                  onClick={() => toggleEdit('email')}
                  aria-label="Editar email"
                >
                  ✏️
                </button>
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="config-field-group">
              <label htmlFor="password">Contraseña</label>
              <div className={`config-input-wrapper ${isEditing.password ? 'is-active' : ''}`}>
                <input
                  id="password"
                  ref={passwordInputRef}
                  type={isEditing.password ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={!isEditing.password}
                />
                <button
                  type="button"
                  className="pencil-btn"
                  onClick={() => toggleEdit('password')}
                  aria-label="Editar contraseña"
                >
                  ✏️
                </button>
              </div>
            </div>

            {/* Botón Eliminar Cuenta */}
            <div className="delete-account-wrapper">
              <button
                type="button"
                className="delete-account-btn"
                onClick={() => setShowDeleteModal(true)}
              >
                Quiero eliminar mi cuenta
              </button>
            </div>

            {/* Botón Principal Guardar Cambios */}
            <button type="submit" className="save-changes-btn">
              Guardar cambios
            </button>

          </form>

        </div>
      </main>

      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      {showDeleteModal && (
        <div className="config-modal-overlay">
          <div className="config-modal-card">
            <div className="modal-icon">⚠️</div>
            <h2>¿Eliminar cuenta?</h2>
            <p>
              Esta acción es irreversible y perderás todo tu progreso en MATE+. ¿Estás seguro/a de que deseas continuar?
            </p>

            <div className="modal-actions">
              <button 
                type="button" 
                className="modal-cancel-btn" 
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className="modal-confirm-delete-btn" 
                onClick={handleConfirmDelete}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Configuracion;

