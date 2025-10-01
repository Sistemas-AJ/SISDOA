import React from "react";
import "./ProyectoDetalle.css";

const CarpetaDetalle = ({ carpeta }) => {
  if (!carpeta) return null;
  return (
    <div className="carpeta-detalle">
      <h3 style={{ margin: 0 }}>{carpeta.nombre}</h3>
      <p><b>ID:</b> {carpeta.id}</p>
      {carpeta.descripcion && <p><b>Descripción:</b> {carpeta.descripcion}</p>}
      {carpeta.fecha_creacion && <p><b>Fecha de creación:</b> {carpeta.fecha_creacion}</p>}
      {/* Puedes agregar más campos según tu modelo */}
    </div>
  );
};

export default CarpetaDetalle;
