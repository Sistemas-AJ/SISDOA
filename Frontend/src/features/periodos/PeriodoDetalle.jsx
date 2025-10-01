import React, { useState } from "react";

const PeriodoDetalle = ({ periodo }) => {
  const [modalOpen, setModalOpen] = useState(false);

  if (!periodo) {
    return <div className="periodo-detalle-vacio">Selecciona un período para ver detalles</div>;
  }

  // Buscar metadatos del período
  const responsable = periodo.metadatos?.find(m => m.clave === "responsable_proyecto")?.valor || "Sin responsable";
  const estado = periodo.metadatos?.find(m => m.clave === "estado_proyecto")?.valor || "Sin estado";
  const fechaInicio = periodo.metadatos?.find(m => m.clave === "fecha_inicio")?.valor || "Sin fecha";
  const fechaFin = periodo.metadatos?.find(m => m.clave === "fecha_fin_estimada")?.valor || "Sin fecha";
  const cliente = periodo.metadatos?.find(m => m.clave === "cliente_asociado")?.valor || "Sin cliente";
  const prioridad = periodo.metadatos?.find(m => m.clave === "prioridad")?.valor || "Sin prioridad";

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, marginTop: 32 }}>
        <div style={{ marginLeft: 24 }}>
          <h2 style={{ margin: 0 }}>{periodo.nombre}</h2>
          <p style={{ margin: 0 }}><b>Responsable:</b> {responsable}</p>
          <p style={{ margin: 0 }}><b>Estado:</b> <span className={`estado-${estado.toLowerCase()}`}>{estado}</span></p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn-agregar-archivo" onClick={() => setModalOpen(true)}>Agregar documento</button>
          <input
            type="text"
            placeholder="Buscar..."
            className="periodo-buscar-input"
            style={{ padding: 6, width: 150 }}
          />
        </div>
      </div>

      <div className="periodo-info-grid">
        <div className="info-card">
          <h4>Fechas</h4>
          <p><strong>Inicio:</strong> {fechaInicio}</p>
          <p><strong>Fin Estimado:</strong> {fechaFin}</p>
        </div>
        
        <div className="info-card">
          <h4>Detalles</h4>
          <p><strong>Cliente:</strong> {cliente}</p>
          <p><strong>Prioridad:</strong> <span className={`prioridad-${prioridad.toLowerCase()}`}>{prioridad}</span></p>
        </div>
      </div>

      {/* Aquí se mostrarían los documentos y carpetas del período */}
      <div className="periodo-documentos">
        <h3>Documentos del Período</h3>
        <div className="documentos-placeholder">
          No hay documentos en este período aún.
        </div>
      </div>
    </>
  );
};

export default PeriodoDetalle;