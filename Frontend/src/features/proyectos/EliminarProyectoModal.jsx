import React from "react";
import "./DetallesProyectoModal.css";

const EliminarProyectoModal = ({ open, onClose, proyecto, onConfirm }) => {
  if (!open || !proyecto) return null;
  return (
    <div className="modal-overlay">
      <div className="modal" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>
          Confirmar Eliminación
        </h3>
        <p style={{ margin: '0 0 24px 0', color: '#666', lineHeight: 1.4 }}>
          ¿Estás seguro de que deseas eliminar el proyecto <strong>"{proyecto.nombre}"</strong>?
        </p>
        <div className="modal-actions">
          <button type="button" onClick={onClose} className="modal-btn-primary" style={{ background: '#888', marginRight: 8 }}>Cancelar</button>
          <button type="button" onClick={() => onConfirm(proyecto)} className="modal-btn-primary" style={{ background: '#d32f2f' }}>Eliminar</button>
        </div>
      </div>
    </div>
  );
};

export default EliminarProyectoModal;
