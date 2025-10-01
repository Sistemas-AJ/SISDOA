import React from 'react';

const ConfirmarEliminarModal = ({ isOpen, onClose, onConfirm, periodo }) => {
  if (!isOpen || !periodo) return null;

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
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center'
  };

  const buttonStyle = {
    padding: '8px 16px',
    margin: '0 8px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
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
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ color: '#f44336', marginTop: 0 }}>Confirmar Eliminación</h3>
        
        <p style={{ margin: '16px 0', color: '#333' }}>
          ¿Estás seguro de que deseas eliminar el período <strong>"{periodo.nombre}"</strong>?
        </p>
        
        <p style={{ margin: '16px 0', color: '#666', fontSize: '14px' }}>
          Esta acción no se puede deshacer y se eliminarán todas las carpetas y documentos asociados.
        </p>

        <div style={{ marginTop: '24px' }}>
          <button 
            style={cancelButtonStyle}
            onClick={onClose}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#e0e0e0'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#f5f5f5'}
          >
            Cancelar
          </button>
          <button 
            style={deleteButtonStyle}
            onClick={() => {
              onConfirm(periodo.id);
              onClose();
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#d32f2f'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#f44336'}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmarEliminarModal;