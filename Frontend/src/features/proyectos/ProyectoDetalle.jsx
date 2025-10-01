import React, { useState } from "react";
import "./ProyectoDetalle.css";
import AgregarArchivoModal from "./AgregarArchivoModal";
import ProyectoCarpetasDetalle from "./ProyectoCarpetasDetalle";

const ProyectoDetalle = ({ proyecto }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleAgregarArchivo = (archivo) => {
    // Aquí puedes manejar el archivo subido (enviar a backend, etc)
    // console.log(archivo);
  };

  if (!proyecto) {
    return <div className="proyecto-detalle-vacio">Selecciona un proyecto para ver detalles</div>;
  }

  // Buscar autor en metadatos
  const autor = proyecto.metadatos?.find(m => m.clave === "autor_asignado")?.valor || "Sin autor";

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, marginTop: 32 }}>
        <div style={{ marginLeft: 24 }}>
          <h2 style={{ margin: 0 }}>{proyecto.nombre}</h2>
          <p style={{ margin: 0 }}><b>Autor:</b> {autor}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn-agregar-archivo" onClick={() => setModalOpen(true)}>Agregar archivo</button>
          <input
            type="text"
            placeholder="Buscar..."
            className="proyecto-buscar-input"
            style={{ padding: 6, width: 150 }}
          />
        </div>
      </div>
      {/* Gestión de carpetas y archivos del proyecto */}
      <ProyectoCarpetasDetalle proyecto={proyecto} />
    </>
  );
};

export default ProyectoDetalle;
