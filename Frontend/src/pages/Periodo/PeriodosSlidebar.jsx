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
    // Obtener todos los módulos y filtrar por tipo PERIODO
    fetch(`${BACKEND_URL}/modulos/`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Filtrar solo los módulos de tipo PERIODO
          const periodoModulos = data.filter(modulo => modulo.tipo === 'PERIODO');
          setPeriodos(periodoModulos);
        } else {
          setPeriodos([]);
        }
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