import React from 'react';
import { LuBookText, LuX } from 'react-icons/lu';
import './SidebarDesafios.css';

const desafiosList = [
    'Porcentajes',
    'Geometría básica',
    'Finanzas cotidianas',
    'Fracciones y proporciones',
    'Estimulación cognitiva'
];

const SidebarDesafios = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Fondo oscuro traslúcido para cerrar al hacer clic afuera */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      {/* Drawer Lateral */}
      <aside className={`sidebar-desafios ${isOpen ? 'open' : ''}`}>
        
        {/* Botón de Cierre (X) */}
        <button className="sidebar-close-btn" onClick={onClose} aria-label="Cerrar menú">
          <LuX size={24} />
        </button>

        <h2 className="sidebar-title">Desafíos</h2>
        <div className="sidebar-divider" />

        {/* Opción Destacada 1 */}
        <div className="sidebar-item item-highlighted active">
          <div className="item-icon-wrapper">
            <LuBookText size={20} color="#111111" />
          </div>
          <span className="item-text text-bold">Porcentajes</span>
        </div>

        {/* Opción Destacada 2 */}
        <div className="sidebar-item item-highlighted">
          <span className="item-text text-bold">Geometría</span>
        </div>

        <div className="sidebar-divider" />

        <p className="sidebar-subtitle">+ desafíos</p>

        {/* Lista de Desafíos Secundarios */}
        <ul className="sidebar-list">
          {desafiosList.map((desafio, index) => (
            <li key={index} className="sidebar-list-item">
              {desafio}
            </li>
          ))}
        </ul>

      </aside>
    </>
  );
};

export default SidebarDesafios;

