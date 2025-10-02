import React, { useEffect, useState } from "react";
import Slidebar from "../../components/Slidebar/Slidebar";
import calendarioSidebarImg from '../../assets/calendario.png';
import BACKEND_URL from "../../service/backend";
import CrearPeriodoModal from "./components/CrearPeriodoModal";
import BotonNuevoPeriodo from "./components/BotonNuevoPeriodo";
import PeriodoDetalle from "../../features/periodos/PeriodoDetalle";
import calendarioImg from '../../assets/calendario.png';
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

  // Efecto para restaurar el periodo seleccionado después de cargar los periodos
  useEffect(() => {
    if (periodos.length > 0) {
      const savedPeriodoId = localStorage.getItem('selectedPeriodoId');
      if (savedPeriodoId) {
        const savedPeriodo = periodos.find(p => p.id.toString() === savedPeriodoId);
        if (savedPeriodo) {
          setSelectedPeriodo(savedPeriodo);
        }
      }
    }
  }, [periodos]);

  const handlePeriodoClick = (periodo) => {
    setSelectedPeriodo(periodo);
    // Guardar el periodo seleccionado en localStorage
    localStorage.setItem('selectedPeriodoId', periodo.id);
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
        // Limpiar navegación guardada del período eliminado
        localStorage.removeItem(`navegacion_periodo_${periodoId}`);
        localStorage.removeItem('selectedPeriodoId');
        
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
        icon={() => <img src={calendarioSidebarImg} alt="Calendario" style={{ width: 44, height: 44 }} />}
        onItemClick={handlePeriodoClick}
        onContextMenu={handleContextMenu}
        extraTop={<BotonNuevoPeriodo onClick={() => setModalOpen(true)} />}
      />
      
      <div style={{ flexGrow: 1, overflowY: 'auto' }}>
        {selectedPeriodo ? (
          <PeriodoDetalle periodo={selectedPeriodo} />
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh',
            color: '#4a5a6a',
            background: 'linear-gradient(135deg, #f8fafc 60%, #e3eaf5 100%)',
            borderRadius: '18px',
            boxShadow: '0 4px 24px 0 rgba(80,100,120,0.07)',
            margin: '32px',
            fontSize: '1.2rem',
            transition: 'box-shadow 0.3s',
          }}>
            <img src={calendarioImg} alt="Calendario" style={{ width: 72, height: 72, marginBottom: 24, opacity: 0.9, filter: 'drop-shadow(0 2px 8px #b0b8c1)' }} />
            <div style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: 8 }}>
              ¡Selecciona un período!
            </div>
            <div style={{ color: '#6c7a89', fontSize: '1.1rem', marginBottom: 12, textAlign: 'center' }}>
              Selecciona un período de la izquierda<br />
              o crea uno nuevo para comenzar a trabajar.
            </div>
            <div style={{ fontSize: '0.95rem', color: '#b0b8c1', textAlign: 'center' }}>
              Los detalles del período aparecerán aquí.<br />
              ¡Organiza, visualiza y gestiona tus periodos fácilmente!
            </div>
          </div>
        )}
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