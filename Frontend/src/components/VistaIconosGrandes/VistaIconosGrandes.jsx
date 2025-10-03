import React from 'react';

const VistaIconosGrandes = ({ carpetas, onEntrarCarpeta, onContextMenu, textoBusqueda }) => {
  if (carpetas.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '80px 20px',
        color: '#666',
        fontStyle: 'italic'
      }}>
        <div style={{ fontSize: '96px', marginBottom: '24px' }}>📁</div>
        <p style={{ margin: '0', fontSize: '18px' }}>No hay carpetas para mostrar</p>
      </div>
    );
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '24px',
    padding: '20px 0'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
    padding: '24px 20px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    textAlign: 'center',
    position: 'relative'
  };

  const hoverStyle = {
    borderColor: '#2196f3',
    boxShadow: '0 8px 24px rgba(33, 150, 243, 0.15)',
    transform: 'translateY(-4px)'
  };

  // Función para resaltar coincidencias
  const resaltarCoincidencia = (nombre) => {
    if (!textoBusqueda || textoBusqueda.trim() === "") return nombre;
    const texto = textoBusqueda.trim();
    const partes = nombre.split(new RegExp(`(${texto})`, 'gi'));
    return partes.map((parte, i) =>
      parte.toLowerCase() === texto.toLowerCase() ?
        <span key={i} style={{ background: '#ffe066', color: '#222', borderRadius: '4px', padding: '0 2px' }}>{parte}</span>
        : parte
    );
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
          fontSize: '80px', 
          marginBottom: '16px',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
          lineHeight: '1'
        }}>
          📁
        </div>
        
        <div style={{ 
          fontWeight: '600', 
          color: '#333', 
          fontSize: '16px',
          marginBottom: '8px',
          wordBreak: 'break-word',
          lineHeight: '1.3'
        }}>
          {resaltarCoincidencia(carpeta.nombre)}
        </div>
        
        <div style={{ 
          fontSize: '13px', 
          color: '#666',
          marginBottom: '12px'
        }}>
          {new Date(carpeta.fecha_creacion).toLocaleDateString('es-ES', {
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

export default VistaIconosGrandes;