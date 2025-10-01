import React from 'react';

const VistaMosaicos = ({ carpetas, onEntrarCarpeta, onContextMenu }) => {
  if (carpetas.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: '#666',
        fontStyle: 'italic'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>📁</div>
        <p style={{ margin: '0', fontSize: '16px' }}>No hay carpetas para mostrar</p>
      </div>
    );
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
    padding: '16px 0'
  };

  const tileStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  };

  const hoverStyle = {
    borderColor: '#2196f3',
    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.15)',
    transform: 'translateY(-1px)'
  };

  const renderCarpeta = (carpeta) => {
    const fechaCreacion = new Date(carpeta.fecha_creacion);
    
    return (
      <div
        key={carpeta.id}
        style={tileStyle}
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
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
          flexShrink: 0
        }}>
          📁
        </div>
        
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ 
            fontWeight: '600', 
            color: '#333', 
            fontSize: '16px',
            marginBottom: '8px',
            wordBreak: 'break-word',
            lineHeight: '1.3'
          }}>
            {carpeta.nombre}
          </div>
          
          <div style={{ 
            fontSize: '12px', 
            color: '#666',
            marginBottom: '4px'
          }}>
            Creada: {fechaCreacion.toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </div>
          
          <div style={{ 
            fontSize: '11px', 
            color: '#999',
            fontStyle: 'italic'
          }}>
            Carpeta • ID: {carpeta.id}
          </div>
        </div>
        
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          fontSize: '10px',
          color: '#999',
          backgroundColor: '#f5f5f5',
          padding: '2px 6px',
          borderRadius: '10px'
        }}>
          Carpeta
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

export default VistaMosaicos;