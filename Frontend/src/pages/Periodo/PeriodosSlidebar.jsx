import React, { useEffect, useState } from "react";
import Slidebar from "../../components/Slidebar/Slidebar";
import { FaCalendarAlt } from "react-icons/fa";
import BACKEND_URL from "../../service/backend";
import CrearPeriodoModal from "./components/CrearPeriodoModal";
import BotonNuevoPeriodo from "./components/BotonNuevoPeriodo";
import PeriodoDetalle from "../../features/periodos/PeriodoDetalle";
import ContextMenu from "../../components/ContextMenu/ContextMenu";
import DetallesPeriodoModal from "../../components/DetallesPeriodoModal/DetallesPeriodoModal";
import ConfirmarEliminarModal from "../../components/ConfirmarEliminarModal/ConfirmarEliminarModal";
import EditarPeriodoModal from "../../components/EditarPeriodoModal/EditarPeriodoModal";
import { useNotification } from "../../contexts/NotificationContext";

const BLOQUE_PERIODOS_ID = 2; // Cambia esto si tu id de bloque de periodos es diferente

const PeriodosSlidebar = () => {
  const [periodos, setPeriodos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPeriodo, setSelectedPeriodo] = useState(null);
  const { showSuccess, showError } = useNotification();
  
  // Estados para el menú contextual
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    item: null
  });
  
  // Estados para los modales
  const [detallesModalOpen, setDetallesModalOpen] = useState(false);
  const [eliminarModalOpen, setEliminarModalOpen] = useState(false);
  const [editarModalOpen, setEditarModalOpen] = useState(false);
  const [periodoParaAccion, setPeriodoParaAccion] = useState(null);

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

  const handlePeriodoClick = (periodo) => {
    setSelectedPeriodo(periodo);
  };

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      item: item
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, item: null });
  };

  const handleVerDetalles = (periodo, accion = 'detalles') => {
    setPeriodoParaAccion(periodo);
    if (accion === 'edit') {
      setEditarModalOpen(true);
    } else {
      setDetallesModalOpen(true);
    }
  };

  const handleEliminar = (periodo) => {
    setPeriodoParaAccion(periodo);
    setEliminarModalOpen(true);
  };

  const confirmarEliminar = async (periodoId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/modulos/${periodoId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Refrescar la lista de períodos
        fetchPeriodos();
        // Si el período eliminado era el seleccionado, limpiar la selección
        if (selectedPeriodo && selectedPeriodo.id === periodoId) {
          setSelectedPeriodo(null);
        }
        showSuccess('Período eliminado correctamente');
      } else {
        throw new Error('Error al eliminar el período');
      }
    } catch (error) {
      console.error('Error:', error);
      showError('Error al eliminar el período: ' + error.message);
    }
  };

  // Cerrar menú contextual al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        closeContextMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [contextMenu.visible]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Slidebar
        items={periodos}
        icon={FaCalendarAlt}
        onItemClick={handlePeriodoClick}
        onContextMenu={handleContextMenu}
        extraTop={<BotonNuevoPeriodo onClick={() => setModalOpen(true)} />}
      />
      
      <div style={{ flexGrow: 1, overflowY: 'auto' }}>
        <PeriodoDetalle periodo={selectedPeriodo} />
      </div>

      {/* Menú contextual */}
      <ContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        onClose={closeContextMenu}
        onEdit={handleVerDetalles}
        onDelete={handleEliminar}
        item={contextMenu.item}
      />

      {/* Modal crear período */}
      <CrearPeriodoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={fetchPeriodos}
      />

      {/* Modal detalles período */}
      <DetallesPeriodoModal
        isOpen={detallesModalOpen}
        onClose={() => setDetallesModalOpen(false)}
        periodo={periodoParaAccion}
      />

      {/* Modal confirmar eliminar */}
      <ConfirmarEliminarModal
        isOpen={eliminarModalOpen}
        onClose={() => setEliminarModalOpen(false)}
        onConfirm={confirmarEliminar}
        periodo={periodoParaAccion}
      />

      {/* Modal editar período */}
      <EditarPeriodoModal
        open={editarModalOpen}
        onClose={() => setEditarModalOpen(false)}
        periodo={periodoParaAccion}
        onUpdated={fetchPeriodos}
      />
    </div>
  );
};

export default PeriodosSlidebar;