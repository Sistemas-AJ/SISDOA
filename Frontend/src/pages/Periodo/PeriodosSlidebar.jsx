
import React, { useEffect, useState } from "react";
import Slidebar from "../../components/Slidebar/Slidebar";
import { FaCalendarAlt } from "react-icons/fa";
import BACKEND_URL from "../../service/backend";

import CrearPeriodoModal from "./components/CrearPeriodoModal";

import BotonNuevoPeriodo from "./components/BotonNuevoPeriodo";


const PeriodosSlidebar = () => {
  const [periodos, setPeriodos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchPeriodos = () => {
    fetch(`${BACKEND_URL}/periodos/`)
      .then((res) => res.json())
      .then((data) => setPeriodos(data))
      .catch(() => setPeriodos([]));
  };

  useEffect(() => {
    fetchPeriodos();
  }, []);

  return (
    <>
      <Slidebar
        items={periodos}
        icon={FaCalendarAlt}
        onItemClick={(item) => alert(`Seleccionaste el periodo ${item.nombre}`)}
        extraTop={<BotonNuevoPeriodo onClick={() => setModalOpen(true)} />}
      />
      <CrearPeriodoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={fetchPeriodos}
      />
    </>
  );
};

export default PeriodosSlidebar;