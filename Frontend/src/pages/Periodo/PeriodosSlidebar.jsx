import React, { useEffect, useState } from "react";
import Slidebar from "../../components/Slidebar/Slidebar";
import { FaCalendarAlt } from "react-icons/fa";
import BACKEND_URL from "../../service/backend";

import CrearPeriodoModal from "./components/CrearPeriodoModal";

import BotonNuevoPeriodo from "./components/BotonNuevoPeriodo";

const BLOQUE_PERIODOS_ID = 2; // Cambia esto si tu id de bloque de periodos es diferente

const PeriodosSlidebar = () => {
  const [periodos, setPeriodos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchPeriodos = () => {
    fetch(`${BACKEND_URL}/bloques/${BLOQUE_PERIODOS_ID}`)
      .then((res) => res.json())
      .then((data) => {
        // Solo módulos de tipo "PERIODO"
        const periodos = (data.modulos || []).filter((m) => m.tipo === "PERIODO");
        setPeriodos(periodos);
      })
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