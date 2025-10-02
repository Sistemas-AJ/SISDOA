import React, { useEffect, useState } from "react";
import Slidebar from "../../components/Slidebar/Slidebar";
import { FaProjectDiagram } from "react-icons/fa";
import BACKEND_URL from "../../service/backend";
import CrearProyectoModal from "./components/CrearProyectoModal";
import BotonNuevoProyecto from "./components/BotonNuevoProyecto";
import ProyectosList from '../../features/proyectos/ProyectosList';
import ProyectoDetalle from '../../features/proyectos/ProyectoDetalle';
import DetallesProyectoModal from '../../features/proyectos/DetallesProyectoModal';
import EditarProyectoModal from '../../features/proyectos/EditarProyectoModal';
import EliminarProyectoModal from '../../features/proyectos/EliminarProyectoModal';

import './ProyectosSlidebar.css';

const PROYECTOS_BLOQUE_ID = 1;

const ProyectosSlidebar = ({ onProyectoClick }) => {
  const [proyectos, setProyectos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProyecto, setSelectedProyecto] = useState(null);
  const [modalDetalles, setModalDetalles] = useState({ open: false, proyecto: null });
  const [modalEditar, setModalEditar] = useState({ open: false, proyecto: null });
  const [modalEliminar, setModalEliminar] = useState({ open: false, proyecto: null });


  const fetchProyectos = () => {
    fetch(`${BACKEND_URL}/modulos/`)
      .then((res) => res.json())
      .then((data) => {
        const soloProyectos = Array.isArray(data)
          ? data.filter(m => m.tipo === "PROYECTO" && m.id_bloque === PROYECTOS_BLOQUE_ID)
          : [];
        setProyectos(soloProyectos);
      })
      .catch(() => setProyectos([]));
  };

  useEffect(() => {
    fetchProyectos();
  }, []);

  // Cuando se crea un nuevo proyecto, lo agregamos al principio de la lista
  const handleCrearProyecto = (nuevoProyecto) => {
    setModalOpen(false);
    setProyectos(prev => [nuevoProyecto, ...prev]);
  };

  const handleSelectProyecto = (proy) => {
    setSelectedProyecto(proy);
    if (onProyectoClick) onProyectoClick(proy);
  };

  // Handlers para menú contextual
  const handleVerDetalle = (proyecto) => setModalDetalles({ open: true, proyecto });
  const handleEditar = (proyecto) => setModalEditar({ open: true, proyecto });
  const handleEliminar = (proyecto) => setModalEliminar({ open: true, proyecto });

  // Actualizar proyecto tras edición
  const handleProyectoActualizado = (actualizado) => {
    fetchProyectos();
    setModalEditar({ open: false, proyecto: null });
    // Si el proyecto editado es el seleccionado, actualizarlo
    if (selectedProyecto && actualizado.id === selectedProyecto.id) {
      setSelectedProyecto(actualizado);
    }
  };

  // Eliminar proyecto
  const handleConfirmarEliminar = async (proyecto) => {
    try {
      await fetch(`${BACKEND_URL}/modulos/${proyecto.id}`, { method: 'DELETE' });
      fetchProyectos();
      setModalEliminar({ open: false, proyecto: null });
      if (selectedProyecto && proyecto.id === selectedProyecto.id) {
        setSelectedProyecto(null);
      }
    } catch (err) {
      alert('Error al eliminar el proyecto');
    }
  };

  return (
    <div className="proyectos-layout-container">
      {/* Sidebar SIEMPRE visible */}
      <Slidebar
        extraTop={
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0 }}>
              <BotonNuevoProyecto onClick={() => setModalOpen(true)} />
              <div style={{ width: '100%' }}>
                <ProyectosList
                  proyectos={proyectos}
                  onSelect={handleSelectProyecto}
                  onVerDetalle={handleVerDetalle}
                  onEditar={handleEditar}
                  onEliminar={handleEliminar}
                />
              </div>
            </div>
          </>
        }
      />
      {/* Contenido principal: detalle del proyecto seleccionado o mensaje */}
      <div className="proyectos-main-content">
        {selectedProyecto ? (
          <ProyectoDetalle
            proyecto={selectedProyecto}
            onVolver={() => setSelectedProyecto(null)}
          />
        ) : (
          <div style={{ color: '#888', fontStyle: 'italic', margin: '32px', fontSize: '1.2rem' }}>
            Selecciona un proyecto para ver detalles
          </div>
        )}
      </div>
      <CrearProyectoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCrearProyecto}
      />
      <DetallesProyectoModal
        open={modalDetalles.open}
        proyecto={modalDetalles.proyecto}
        onClose={() => setModalDetalles({ open: false, proyecto: null })}
      />
      <EditarProyectoModal
        open={modalEditar.open}
        proyecto={modalEditar.proyecto}
        onClose={() => setModalEditar({ open: false, proyecto: null })}
        onUpdated={handleProyectoActualizado}
      />
      <EliminarProyectoModal
        open={modalEliminar.open}
        proyecto={modalEliminar.proyecto}
        onClose={() => setModalEliminar({ open: false, proyecto: null })}
        onConfirm={handleConfirmarEliminar}
      />
    </div>
  );
};

export default ProyectosSlidebar;