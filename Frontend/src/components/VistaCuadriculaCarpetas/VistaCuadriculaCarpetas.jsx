import React from 'react';

const VistaCuadriculaCarpetas = ({ carpetas, onEntrarCarpeta, onContextMenu }) => {
  if (carpetas.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: '#666',
        fontStyle: 'italic'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>📁</div>
        <p style={{ margin: '0', fontSize: '16px' }}>No hay carpetas para mostrar</p>
      </div>
    );
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '16px',
    padding: '16px 0'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    padding: '20px 16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
    position: 'relative'
  };

  const hoverStyle = {
    borderColor: '#2196f3',
    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.15)',
    transform: 'translateY(-2px)'
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
          fontSize: '48px', 
          marginBottom: '12px',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
        }}>
          📁
        </div>
        
        <div style={{ 
          fontWeight: '500', 
          color: '#333', 
          fontSize: '14px',
          marginBottom: '8px',
          wordBreak: 'break-word',
          lineHeight: '1.3'
        }}>
          {carpeta.nombre}
        </div>
        
        <div style={{ 
          fontSize: '12px', 
          color: '#666',
          marginBottom: '8px'
        }}>
          {new Date(carpeta.fecha_creacion).toLocaleDateString('es-ES')}
        </div>
        
        <div style={{
          fontSize: '10px',
          color: '#999',
          fontStyle: 'italic'
        }}>
          Click para abrir
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

export default VistaCuadriculaCarpetas;