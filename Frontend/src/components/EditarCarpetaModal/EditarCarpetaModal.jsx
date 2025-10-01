import React, { useState, useEffect } from 'react';

const EditarCarpetaModal = ({ isOpen, onClose, carpeta, onUpdate }) => {
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (carpeta && isOpen) {
      setNombre(carpeta.nombre);
    }
  }, [carpeta, isOpen]);

  if (!isOpen || !carpeta) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    
    setLoading(true);
    await onUpdate(carpeta.id, nombre.trim());
    setLoading(false);
  };

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
    maxWidth: '90%'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  };

  const buttonStyle = {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#2196f3',
    color: 'white'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f5f5f5',
    color: '#333'
  };

  return (
    <div style={modalStyle}>
      <div style={contentStyle}>
        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Editar Carpeta</h3>
        
        <form onSubmit={handleSubmit} style={formStyle}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Nombre de la carpeta:
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={inputStyle}
              placeholder="Ingresa el nuevo nombre"
              required
              disabled={loading}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              onClick={onClose}
              style={secondaryButtonStyle}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              style={primaryButtonStyle}
              disabled={loading || !nombre.trim()}
            >
              {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarCarpetaModal;