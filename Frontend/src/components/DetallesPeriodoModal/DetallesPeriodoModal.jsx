import React from 'react';

const DetallesPeriodoModal = ({ isOpen, onClose, periodo }) => {
  if (!isOpen || !periodo) return null;

  // Extraer metadatos del período
  const getMetadato = (clave, valorPorDefecto = 'No especificado') => {
    return periodo.metadatos?.find(m => m.clave === clave)?.valor || valorPorDefecto;
  };

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const contentStyle = {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflowY: 'auto',
    width: '90%'
  };

  const headerStyle = {
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '16px',
    marginBottom: '20px'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '20px'
  };

  const fieldStyle = {
    marginBottom: '12px'
  };

  const labelStyle = {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '4px',
    display: 'block'
  };

  const valueStyle = {
    color: '#666',
    fontSize: '14px'
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0, color: '#2196f3' }}>Detalles del Período</h2>
          <h3 style={{ margin: '8px 0 0 0', color: '#333' }}>{periodo.nombre}</h3>
        </div>

        <div style={gridStyle}>
          <div>
            <div style={fieldStyle}>
              <label style={labelStyle}>ID:</label>
              <span style={valueStyle}>{periodo.id}</span>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Tipo:</label>
              <span style={valueStyle}>{periodo.tipo}</span>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Estado:</label>
              <span style={{...valueStyle, 
                color: getMetadato('estado_proyecto') === 'Activo' ? '#4caf50' : 
                       getMetadato('estado_proyecto') === 'Completado' ? '#2196f3' : '#ff9800',
                fontWeight: 'bold'
              }}>
                {getMetadato('estado_proyecto')}
              </span>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Responsable:</label>
              <span style={valueStyle}>{getMetadato('responsable_proyecto')}</span>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Cliente:</label>
              <span style={valueStyle}>{getMetadato('cliente_asociado')}</span>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Prioridad:</label>
              <span style={{...valueStyle,
                color: getMetadato('prioridad') === 'Alta' ? '#f44336' : 
                       getMetadato('prioridad') === 'Media' ? '#ff9800' : '#4caf50',
                fontWeight: 'bold'
              }}>
                {getMetadato('prioridad')}
              </span>
            </div>
          </div>

          <div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Fecha de Creación:</label>
              <span style={valueStyle}>
                {new Date(periodo.fecha_creacion).toLocaleDateString('es-ES')}
              </span>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Fecha de Inicio:</label>
              <span style={valueStyle}>{getMetadato('fecha_inicio')}</span>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Fecha Fin Estimada:</label>
              <span style={valueStyle}>{getMetadato('fecha_fin_estimada')}</span>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Período de Ejecución:</label>
              <span style={valueStyle}>{getMetadato('periodo_ejecucion')}</span>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Presupuesto ID:</label>
              <span style={valueStyle}>{getMetadato('presupuesto_id')}</span>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Tipo de Proyecto:</label>
              <span style={valueStyle}>{getMetadato('tipo_proyecto')}</span>
            </div>
          </div>
        </div>

        {getMetadato('fecha_ultima_revision') !== 'No especificado' && (
          <div style={fieldStyle}>
            <label style={labelStyle}>Última Revisión:</label>
            <span style={valueStyle}>{getMetadato('fecha_ultima_revision')}</span>
          </div>
        )}

        <div style={{ textAlign: 'right', marginTop: '24px' }}>
          <button 
            onClick={onClose}
            style={{
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetallesPeriodoModal;