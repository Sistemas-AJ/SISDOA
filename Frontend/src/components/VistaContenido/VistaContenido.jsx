import React from 'react';

const VistaContenido = ({ carpetas, onEntrarCarpeta, onContextMenu }) => {
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

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    position: 'relative'
  };

  const hoverStyle = {
    borderColor: '#2196f3',
    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.1)',
    backgroundColor: '#f8f9ff'
  };

  const renderCarpeta = (carpeta) => {
    const fechaCreacion = new Date(carpeta.fecha_creacion);
    const fechaModificacion = carpeta.fecha_modificacion ? new Date(carpeta.fecha_modificacion) : null;
    
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
          e.currentTarget.style.backgroundColor = 'white';
        }}
      >
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <div style={{ 
            fontSize: '40px',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            flexShrink: 0
          }}>
            📁
          </div>
          
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ 
              fontWeight: '600', 
              color: '#333', 
              fontSize: '18px',
              marginBottom: '8px',
              wordBreak: 'break-word',
              lineHeight: '1.3'
            }}>
              {carpeta.nombre}
            </div>
            
            <div style={{ 
              fontSize: '13px', 
              color: '#666',
              lineHeight: '1.4',
              marginBottom: '12px'
            }}>
              Esta carpeta contiene archivos y documentos organizados del proyecto. 
              Puede contener subcarpetas para una mejor organización del contenido.
            </div>
            
            <div style={{ 
              display: 'flex',
              gap: '20px',
              fontSize: '12px',
              color: '#666'
            }}>
              <div>
                <strong>Creada:</strong> {fechaCreacion.toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              
              {fechaModificacion && (
                <div>
                  <strong>Modificada:</strong> {fechaModificacion.toLocaleDateString('es-ES')}
                </div>
              )}
              
              <div>
                <strong>Tipo:</strong> Carpeta de archivos
              </div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '8px',
            flexShrink: 0
          }}>
            <div style={{
              fontSize: '10px',
              color: '#999',
              backgroundColor: '#f5f5f5',
              padding: '4px 8px',
              borderRadius: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Carpeta
            </div>
            
            <div style={{
              fontSize: '11px',
              color: '#999'
            }}>
              ID: {carpeta.id}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      {carpetas.map(carpeta => renderCarpeta(carpeta))}
    </div>
  );
};

export default VistaContenido;