import React, { useState } from 'react';

const ContextMenu = ({ x, y, visible, onClose, onEdit, onDelete, item }) => {
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
    minWidth: '150px'
  };

  const itemStyle = {
    padding: '8px 12px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee'
  };

  const itemHoverStyle = {
    backgroundColor: '#f5f5f5'
  };

  return (
    <div style={menuStyle}>
      <div 
        style={itemStyle}
        onClick={() => {
          onEdit(item);
          onClose();
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
      >
        Ver detalles
      </div>
      <div 
        style={itemStyle}
        onClick={() => {
          onEdit && onEdit(item, 'edit');
          onClose();
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
      >
        Editar período
      </div>
      <div 
        style={{...itemStyle, color: '#d32f2f', borderBottom: 'none'}}
        onClick={() => {
          onDelete(item);
          onClose();
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#ffebee'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
      >
        Eliminar período
      </div>
    </div>
  );
};

export default ContextMenu;