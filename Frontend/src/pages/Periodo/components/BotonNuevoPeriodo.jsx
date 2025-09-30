import React from "react";
import "./BotonNuevoPeriodo.css";

const BotonNuevoPeriodo = ({ onClick }) => (
  <button className="boton-nuevo-periodo" onClick={onClick}>
    + Nuevo Periodo
  </button>
);

export default BotonNuevoPeriodo;
