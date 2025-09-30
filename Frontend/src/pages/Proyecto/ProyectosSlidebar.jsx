import React from "react";
import Slidebar from "../../components/Slidebar/Slidebar";
import { FaProjectDiagram } from "react-icons/fa";

const proyectos = [
  { id: 1, nombre: "Proyecto Alpha" },
  { id: 2, nombre: "Proyecto Beta" },
  { id: 3, nombre: "Proyecto Gamma" },
];

const ProyectosSlidebar = () => (
  <Slidebar
    items={proyectos}
    icon={FaProjectDiagram}
    onItemClick={(item) => alert(`Seleccionaste ${item.nombre}`)}
  />
);

export default ProyectosSlidebar;