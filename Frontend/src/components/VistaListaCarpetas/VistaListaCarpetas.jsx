import React from 'react';

const VistaListaCarpetas = ({ carpetas, onEntrarCarpeta, onContextMenu }) => {
  if (carpetas.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px 20px',
        color: '#666',
        fontStyle: 'italic',
        border: '2px dashed #ddd',
        borderRadius: '8px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
        <p style={{ margin: '0', fontSize: '16px' }}>No hay carpetas para mostrar</p>
      </div>
    );
  }

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  };

  const headerStyle = {
    display: 'grid',
    gridTemplateColumns: '40px 1fr 120px 100px',
    gap: '16px',
    padding: '12px 16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: '40px 1fr 120px 100px',
    gap: '16px',
    padding: '12px 16px',
    backgroundColor: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    alignItems: 'center'
  };

  const hoverStyle = {
    borderColor: '#2196f3',
    boxShadow: '0 2px 8px rgba(33, 150, 243, 0.1)',
    backgroundColor: '#f8f9ff'
  };

  const renderCarpeta = (carpeta) => {
    return (
      <div
        key={carpeta.id}
        style={rowStyle}
        onClick={() => onEntrarCarpeta(carpeta)}
        onContextMenu={(e) => onContextMenu(e, carpeta)}
        onMouseEnter={(e) => {
          Object.assign(e.currentTarget.style, hoverStyle);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#e0e0e0';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.backgroundColor = 'white';
        }}
      >
        <div style={{ 
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          📁
        </div>
        
        <div>
          <div style={{ 
            fontWeight: '500', 
            color: '#333', 
            fontSize: '14px',
            marginBottom: '2px'
          }}>
            {carpeta.nombre}
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: '#666'
          }}>
            Carpeta
          </div>
        </div>
        
        <div style={{ 
          fontSize: '12px', 
          color: '#666'
        }}>
          {new Date(carpeta.fecha_creacion).toLocaleDateString('es-ES')}
        </div>
        
        <div style={{
          fontSize: '12px',
          color: '#999',
          textAlign: 'right'
        }}>
          --
        </div>
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      {/* Cabecera */}
      <div style={headerStyle}>
        <div>Tipo</div>
        <div>Nombre</div>
        <div>Fecha creación</div>
        <div style={{ textAlign: 'right' }}>Tamaño</div>
      </div>
      
      {/* Filas de carpetas */}
      {carpetas.map(carpeta => renderCarpeta(carpeta))}
    </div>
  );
};

export default VistaListaCarpetas;