import React from "react";
import "./BotonNuevoProyecto.css";

const BotonNuevoProyecto = ({ onClick }) => (
  <button className="boton-nuevo-proyecto" onClick={onClick}>
   + Crear Proyecto
  </button>
);

export default BotonNuevoProyecto;
