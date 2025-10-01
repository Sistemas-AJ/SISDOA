import React from 'react';

const ToggleModoVista = ({ modoVista, onCambiarModo }) => {
  const containerStyle = {
    display: 'flex',
    backgroundColor: '#f0f0f0',
    borderRadius: '6px',
    padding: '2px',
    gap: '1px',
    flexWrap: 'wrap'
  };

  const buttonStyle = {
    padding: '6px 10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    minWidth: '70px',
    justifyContent: 'center'
  };

  const activeStyle = {
    ...buttonStyle,
    backgroundColor: '#2196f3',
    color: 'white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
  };

  const inactiveStyle = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: '#666'
  };

  const modos = [
    { key: 'iconos-grandes', icon: '🔳', label: 'XL', title: 'Iconos muy grandes' },
    { key: 'iconos-medianos', icon: '⬜', label: 'L', title: 'Iconos grandes' },
    { key: 'iconos-pequenos', icon: '▫️', label: 'M', title: 'Iconos medianos' },
    { key: 'lista', icon: '☰', label: 'Lista', title: 'Vista en lista' },
    { key: 'detalles', icon: '📋', label: 'Detalles', title: 'Vista detallada' },
    { key: 'mosaicos', icon: '⊞', label: 'Tiles', title: 'Vista en mosaicos' },
    { key: 'contenido', icon: '📄', label: 'Info', title: 'Vista de contenido' }
  ];

  return (
    <div style={containerStyle}>
      {modos.map(modo => (
        <button
          key={modo.key}
          onClick={() => onCambiarModo(modo.key)}
          style={modoVista === modo.key ? activeStyle : inactiveStyle}
          title={modo.title}
        >
          <span style={{ fontSize: '12px' }}>{modo.icon}</span>
          <span style={{ fontSize: '10px' }}>{modo.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ToggleModoVista;