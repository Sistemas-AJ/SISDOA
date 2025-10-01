import React from 'react';

const VistaIconosPequenos = ({ carpetas, onEntrarCarpeta, onContextMenu }) => {
  if (carpetas.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px 20px',
        color: '#666',
        fontStyle: 'italic'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
        <p style={{ margin: '0', fontSize: '14px' }}>No hay carpetas para mostrar</p>
      </div>
    );
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '12px',
    padding: '12px 0'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '6px',
    border: '1px solid #e0e0e0',
    padding: '12px 8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
    position: 'relative'
  };

  const hoverStyle = {
    borderColor: '#2196f3',
    boxShadow: '0 2px 8px rgba(33, 150, 243, 0.15)',
    transform: 'translateY(-1px)'
  };

  const renderCarpeta = (carpeta) => {
    return (
      <div
        key={carpeta.id}
        style={cardStyle}
        onClick={() => onEntrarCarpeta(carpeta)}
        onContextMenu={(e) => onContextMenu(e, carpeta)}
        onMouseEnter={(e) => {
          Object.assign(e.currentTarget.style, hoverStyle);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#e0e0e0';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <div style={{ 
          fontSize: '32px', 
          marginBottom: '8px',
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
          lineHeight: '1'
        }}>
          📁
        </div>
        
        <div style={{ 
          fontWeight: '500', 
          color: '#333', 
          fontSize: '11px',
          wordBreak: 'break-word',
          lineHeight: '1.2',
          height: '22px',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {carpeta.nombre}
        </div>
      </div>
    );
  };

  return (
    <div style={gridStyle}>
      {carpetas.map(carpeta => renderCarpeta(carpeta))}
    </div>
  );
};

export default VistaIconosPequenos;