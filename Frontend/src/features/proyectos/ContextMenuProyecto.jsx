import React from "react";

const ContextMenuProyecto = ({ x, y, visible, onClose, onVer, onEditar, onEliminar }) => {
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
    minWidth: '180px',
    padding: 0
  };

  const itemStyle = {
    padding: '12px 16px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
    fontSize: '15px',
    background: 'white',
    color: '#222',
    transition: 'background 0.15s'
  };

  const lastItemStyle = {
    ...itemStyle,
    borderBottom: 'none',
    color: '#d32f2f',
    fontWeight: 'bold'
  };

  return (
    <div style={menuStyle}>
      <div
        style={itemStyle}
        onClick={() => { onVer(); onClose(); }}
        onMouseEnter={e => e.target.style.background = '#f5f5f5'}
        onMouseLeave={e => e.target.style.background = 'white'}
      >
        Ver detalles
      </div>
      <div
        style={itemStyle}
        onClick={() => { onEditar(); onClose(); }}
        onMouseEnter={e => e.target.style.background = '#f5f5f5'}
        onMouseLeave={e => e.target.style.background = 'white'}
      >
        Editar proyecto
      </div>
      <div
        style={lastItemStyle}
        onClick={() => { onEliminar(); onClose(); }}
        onMouseEnter={e => e.target.style.background = '#ffebee'}
        onMouseLeave={e => e.target.style.background = 'white'}
      >
        Eliminar proyecto
      </div>
    </div>
  );
};

export default ContextMenuProyecto;
