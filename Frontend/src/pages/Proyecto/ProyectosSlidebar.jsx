import React, { useEffect, useState } from "react";
import Slidebar from "../../components/Slidebar/Slidebar";
import { FaProjectDiagram } from "react-icons/fa";
import BACKEND_URL from "../../service/backend";
import CrearProyectoModal from "./components/CrearProyectoModal";
import BotonNuevoProyecto from "./components/BotonNuevoProyecto";
import ProyectosList from '../../features/proyectos/ProyectosList';
import ProyectoCarpetasDetalle from '../../features/proyectos/ProyectoCarpetasDetalle';

import './ProyectosSlidebar.css'; // <-- 1. Importa el nuevo archivo CSS

const PROYECTOS_BLOQUE_ID = 1;
const ProyectosSlidebar = ({ onProyectoClick }) => {
  const [proyectos, setProyectos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProyecto, setSelectedProyecto] = useState(null);

  const fetchProyectos = () => {
    fetch(`${BACKEND_URL}/bloques/${PROYECTOS_BLOQUE_ID}`)
      .then((res) => res.json())
      .then((data) => setProyectos(Array.isArray(data) ? data : []))
      .catch(() => setProyectos([]));
  };

  useEffect(() => {
    fetchProyectos();
  }, []);

  const handleCrearProyecto = (nuevoProyecto) => {
    setModalOpen(false);
    fetchProyectos();
  };

  const handleSelectProyecto = (proy) => {
    setSelectedProyecto(proy);
    if (onProyectoClick) onProyectoClick(proy);
  };

  return (
    // 2. Envuelve todo en un contenedor principal
    <div className="proyectos-layout-container">
      <Slidebar
        items={proyectos}
        icon={FaProjectDiagram}
        onItemClick={onProyectoClick}
        extraTop={
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ marginBottom: 16 }}>
                <BotonNuevoProyecto onClick={() => setModalOpen(true)} />
              </div>
              <div style={{ width: '100%' }}>
                <ProyectosList onSelect={handleSelectProyecto} />
              </div>
            </div>
          </>
        }
      />

      {/* 3. Envuelve el detalle en su propio contenedor para darle estilo */}

      {/* Mostrar detalle de carpetas del proyecto seleccionado */}
      <div className="proyectos-main-content">
        {selectedProyecto && <ProyectoCarpetasDetalle proyecto={selectedProyecto} />}
      </div>


      <CrearProyectoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCrearProyecto}
      />
    </div>
  );
};

export default ProyectosSlidebar;