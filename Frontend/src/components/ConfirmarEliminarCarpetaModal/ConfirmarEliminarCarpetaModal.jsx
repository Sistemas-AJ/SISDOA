import React from 'react';

const ConfirmarEliminarCarpetaModal = ({ isOpen, onClose, carpeta, onConfirm }) => {
  if (!isOpen || !carpeta) return null;

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const contentStyle = {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    width: '400px',
    maxWidth: '90%',
    textAlign: 'center'
  };

  const buttonStyle = {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    margin: '0 8px'
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f5f5f5',
    color: '#333'
  };

  const deleteButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f44336',
    color: 'white'
  };

  return (
    <div style={modalStyle}>
      <div style={contentStyle}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        
        <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>
          Confirmar Eliminación
        </h3>
        
        <p style={{ margin: '0 0 24px 0', color: '#666', lineHeight: 1.4 }}>
          ¿Estás seguro de que deseas eliminar la carpeta 
          <strong> "{carpeta.nombre}"</strong>?
        </p>
        
        <p style={{ margin: '0 0 24px 0', color: '#f44336', fontSize: '14px' }}>
          Esta acción no se puede deshacer. Se eliminarán también todas las subcarpetas y documentos contenidos.
        </p>
        
        <div>
          <button 
            onClick={onClose}
            style={cancelButtonStyle}
          >
            Cancelar
          </button>
          <button 
            onClick={() => onConfirm(carpeta.id)}
            style={deleteButtonStyle}
          >
            Eliminar Carpeta
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmarEliminarCarpetaModal;