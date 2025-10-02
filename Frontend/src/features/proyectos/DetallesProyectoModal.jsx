import React from "react";
import "./DetallesProyectoModal.css";

const DetallesProyectoModal = ({ open, onClose, proyecto }) => {
  if (!open || !proyecto) return null;

  // Puedes adaptar estos campos según tu modelo de proyecto
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 style={{ color: '#007bff', marginBottom: 8 }}>Detalles del Proyecto</h2>
        <h3 style={{ margin: 0 }}>{proyecto.nombre}</h3>
        <hr style={{ margin: '16px 0' }} />
        <div className="modal-details-grid">
          <div><b>ID:</b> <br />{proyecto.id}</div>
          <div><b>Fecha de Creación:</b> <br />{proyecto.fecha_creacion ? new Date(proyecto.fecha_creacion).toLocaleDateString() : 'No especificado'}</div>
          <div><b>Tipo:</b> <br />{proyecto.tipo || 'No especificado'}</div>
          {/* Mostrar metadatos si existen */}
          {Array.isArray(proyecto.metadatos) && proyecto.metadatos.length > 0 ? (
            proyecto.metadatos.map((meta) => (
              <div key={meta.clave}><b>{meta.clave.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</b> <br />{meta.valor || 'No especificado'}</div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', color: '#888' }}>Sin metadatos adicionales</div>
          )}
        </div>
        <div className="modal-actions" style={{ marginTop: 24, textAlign: 'right' }}>
          <button className="modal-btn-primary" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default DetallesProyectoModal;
