import React, { useState, useRef, useEffect } from 'react';
import HeaderDashboard from '../Desafios/headerDash/HeaderDash';
import avatarUser from '../../../assets/Foto_perfil.png';
import './Configuracion.css';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../config/api';
import { supabase } from '../../../config/supabaseClient';

const PASSWORD_PLACEHOLDER = '*************';

function Configuracion() {
  const { profile, refreshProfile, logout } = useAuth();
  const [showHeader, setShowHeader] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const [formData, setFormData] = useState({
    nombre: profile?.nombre || '',
    email: profile?.email || '',
    password: PASSWORD_PLACEHOLDER,
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      nombre: profile?.nombre || '',
      email: profile?.email || '',
    }));
  }, [profile?.nombre, profile?.email]);

  const [isEditing, setIsEditing] = useState({
    nombre: false,
    email: false,
    password: false,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const nombreInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const refs = {
    nombre: nombreInputRef,
    email: emailInputRef,
    password: passwordInputRef,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setStatusMsg('');
  };

  const toggleEdit = (field) => {
    setIsEditing((prev) => {
      const turningOn = !prev[field];
      const newState = { ...prev, [field]: turningOn };

      if (turningOn && field === 'password') {
        setFormData((f) => ({ ...f, password: '' }));
      }
      if (!turningOn && field === 'password') {
        setFormData((f) => ({ ...f, password: PASSWORD_PLACEHOLDER }));
      }

      if (turningOn) {
        setTimeout(() => {
          refs[field].current?.focus();
        }, 50);
      }
      return newState;
    });
  };

  const passwordLooksValid = (pwd) =>
    pwd.length >= 8 &&
    /[A-Z]/.test(pwd) &&
    /[0-9]/.test(pwd) &&
    /[!@#$%^&*]/.test(pwd);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setStatusMsg('');
    setSaving(true);

    try {
      const nombreTrim = formData.nombre.trim();
      const emailTrim = formData.email.trim().toLowerCase();
      const passwordChanged =
        isEditing.password &&
        formData.password &&
        formData.password !== PASSWORD_PLACEHOLDER;

      if (!nombreTrim || nombreTrim.length < 2) {
        throw new Error('El nombre debe tener al menos 2 caracteres.');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrim)) {
        throw new Error('Ingresá un email válido.');
      }

      if (passwordChanged && !passwordLooksValid(formData.password)) {
        throw new Error(
          'La contraseña debe tener 8+ caracteres, una mayúscula, un número y un carácter especial.',
        );
      }

      // 1) Nombre / email en nuestra API (Postgres)
      const perfilPayload = {};
      if (nombreTrim !== (profile?.nombre || '')) perfilPayload.nombre = nombreTrim;
      if (emailTrim !== (profile?.email || '').toLowerCase()) perfilPayload.email = emailTrim;

      if (Object.keys(perfilPayload).length > 0) {
        await api.put('/usuarios/perfil', perfilPayload);
      }

      // 2) Email y contraseña en Supabase Auth (login real)
      const authUpdates = {};
      if (perfilPayload.email) authUpdates.email = perfilPayload.email;
      if (passwordChanged) authUpdates.password = formData.password;

      if (Object.keys(authUpdates).length > 0) {
        const { error } = await supabase.auth.updateUser(authUpdates);
        if (error) throw new Error(error.message);
      }

      if (
        Object.keys(perfilPayload).length === 0 &&
        Object.keys(authUpdates).length === 0
      ) {
        setStatusMsg('No hay cambios para guardar.');
        setSaving(false);
        return;
      }

      await refreshProfile?.();
      setIsEditing({ nombre: false, email: false, password: false });
      setFormData((prev) => ({ ...prev, password: PASSWORD_PLACEHOLDER }));

      let msg = '¡Cambios guardados con éxito!';
      if (authUpdates.email) {
        msg +=
          ' Si cambiaste el email, revisá tu correo para confirmarlo (Supabase).';
      }
      setStatusMsg(msg);
      alert(msg);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'No se pudieron guardar los cambios.';
      setStatusMsg(msg);
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    setShowDeleteModal(false);
    try {
      await api.delete('/usuarios/eliminar');
      await logout?.();
      alert('Cuenta eliminada correctamente.');
    } catch (err) {
      console.error(err);
      alert('No se pudo eliminar la cuenta por ahora.');
    }
  };

  return (
    <div className="config-page-container">
      <HeaderDashboard showHeader={showHeader} setShowHeader={setShowHeader} />

      <main className="config-main-content">
        <div className="config-card">
          <h1 className="config-title">Configuración</h1>

          <div className="config-avatar-wrapper">
            <img src={avatarUser} alt="Foto de perfil" className="config-avatar-img" />
          </div>

          <form method="post" onSubmit={handleSaveChanges} className="config-form">
            <div className="config-field-group">
              <label htmlFor="nombre">Nombre</label>
              <div className={`config-input-wrapper ${isEditing.nombre ? 'is-active' : ''}`}>
                <input
                  id="nombre"
                  ref={nombreInputRef}
                  type="text"
                  name="nombre"
                  autoComplete="name"
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

            <div className="config-field-group">
              <label htmlFor="email">Email</label>
              <div className={`config-input-wrapper ${isEditing.email ? 'is-active' : ''}`}>
                <input
                  id="email"
                  ref={emailInputRef}
                  type="email"
                  name="email"
                  autoComplete="email"
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

            <div className="config-field-group">
              <label htmlFor="password">Nueva contraseña</label>
              <div className={`config-input-wrapper ${isEditing.password ? 'is-active' : ''}`}>
                <input
                  id="password"
                  ref={passwordInputRef}
                  type={isEditing.password ? 'text' : 'password'}
                  name="password"
                  autoComplete="new-password"
                  placeholder={isEditing.password ? 'Escribí la nueva contraseña' : ''}
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
              {isEditing.password && (
                <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.35rem 0 0' }}>
                  Mínimo 8 caracteres, una mayúscula, un número y un especial (! @ # $ % ^ & *).
                </p>
              )}
            </div>

            {statusMsg && (
              <p className="small" style={{ color: '#0A3D91', marginTop: '0.5rem' }} role="status">
                {statusMsg}
              </p>
            )}

            <div className="delete-account-wrapper">
              <button
                type="button"
                className="delete-account-btn"
                onClick={() => setShowDeleteModal(true)}
              >
                Quiero eliminar mi cuenta
              </button>
            </div>

            <button type="submit" className="save-changes-btn" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        </div>
      </main>

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
