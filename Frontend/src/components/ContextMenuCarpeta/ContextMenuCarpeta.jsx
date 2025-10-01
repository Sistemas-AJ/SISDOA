import React from 'react';

const ContextMenuCarpeta = ({ x, y, visible, onClose, onEdit, onDelete, carpeta }) => {
  if (!visible) return null;

  const menuStyle = {
    position: 'fixed',
    top: y,
    left: x,
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    zIndex: 1000,
    minWidth: '160px'
  };

  const itemStyle = {
    padding: '12px 16px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px'
  };

  const lastItemStyle = {
    ...itemStyle,
    borderBottom: 'none'
  };

  return (
    <div style={menuStyle}>
      <div 
        style={itemStyle}
        onClick={() => {
          onEdit(carpeta);
          onClose();
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
      >
        <span>✏️</span>
        <span>Editar nombre</span>
      </div>
      <div 
        style={{...lastItemStyle, color: '#d32f2f'}}
        onClick={() => {
          onDelete(carpeta);
          onClose();
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#ffebee'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
      >
        <span>🗑️</span>
        <span>Eliminar carpeta</span>
      </div>
    </div>
  );
};

export default ContextMenuCarpeta;