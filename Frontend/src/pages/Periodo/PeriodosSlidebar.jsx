import React from "react";
import Slidebar from "../../components/Slidebar/Slidebar";
import { FaCalendarAlt } from "react-icons/fa";

const periodos = [
  { id: 1, nombre: "2023-I" },
  { id: 2, nombre: "2023-II" },
  { id: 3, nombre: "2024-I" },
];

const PeriodosSlidebar = () => (
  <Slidebar
    items={periodos}
    icon={FaCalendarAlt}
    onItemClick={(item) => alert(`Seleccionaste el periodo ${item.nombre}`)}
  />
);

export default PeriodosSlidebar;