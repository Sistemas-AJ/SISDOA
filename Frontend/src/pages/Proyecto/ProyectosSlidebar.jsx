
import React, { useEffect, useState } from "react";
import Slidebar from "../../components/Slidebar/Slidebar";
import { FaProjectDiagram } from "react-icons/fa";
import BACKEND_URL from "../../service/backend";
import CrearProyectoModal from "./components/CrearProyectoModal";
import BotonNuevoProyecto from "./components/BotonNuevoProyecto";

const ProyectosSlidebar = () => {
  const [proyectos, setProyectos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchProyectos = () => {
    fetch(`${BACKEND_URL}/proyectos/`)
      .then((res) => res.json())
      .then((data) => setProyectos(data))
      .catch(() => setProyectos([]));
  };

  useEffect(() => {
    fetchProyectos();
  }, []);

  const handleCrearProyecto = (nuevoProyecto) => {
    // Aquí deberías hacer el POST al backend para crear el proyecto
    // y luego refrescar la lista
    fetch(`${BACKEND_URL}/proyectos/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoProyecto),
    })
      .then((res) => {
        if (res.ok) fetchProyectos();
      })
      .finally(() => setModalOpen(false));
  };

  return (
    <>
      <Slidebar
        items={Array.isArray(proyectos) ? proyectos : []}
        icon={FaProjectDiagram}
        onItemClick={(item) => alert(`Seleccionaste ${item.nombre}`)}
        extraTop={<BotonNuevoProyecto onClick={() => setModalOpen(true)} />}
      />
      <CrearProyectoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCrearProyecto}
      />
    </>
  );
};

export default ProyectosSlidebar;