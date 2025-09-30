import React from "react";
import "./Slidebar.css";
import Card from "../Card/Card";
import { FaProjectDiagram } from "react-icons/fa"; // Ícono de proyecto

const proyectos = [
  { id: 1, nombre: "Proyecto Alpha" },
  { id: 2, nombre: "Proyecto Beta" },
  { id: 3, nombre: "Proyecto Gamma" },
];

const Slidebar = () => {
  return (
    <div className="slidebar">
      <div className="slidebar-cards">
        {proyectos.map((proyecto) => (
          <Card
            key={proyecto.id}
            icon={<FaProjectDiagram />}
            title={proyecto.nombre}
            onClick={() => alert(`Seleccionaste ${proyecto.nombre}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default Slidebar;