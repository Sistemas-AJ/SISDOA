import React, { useState, useEffect } from "react";
import "./ProyectoDetalle.css";
import CrearCarpetaModal from "./CrearCarpetaModal";
import BACKEND_URL from "../../service/backend";
import { useNotification } from "../../contexts/NotificationContext";
import ContextMenuCarpeta from "../../components/ContextMenuCarpeta/ContextMenuCarpeta";
import EditarCarpetaModal from "../../components/EditarCarpetaModal/EditarCarpetaModal";
import ConfirmarEliminarCarpetaModal from "../../components/ConfirmarEliminarCarpetaModal/ConfirmarEliminarCarpetaModal";
import SubirArchivoModal from "../../components/SubirArchivoModal/SubirArchivoModal";
import ListaArchivos from "../../components/ListaArchivos/ListaArchivos";
import AcordeonVista from "../../components/AcordeonVista/AcordeonVista";
import VistaIconosGrandes from "../../components/VistaIconosGrandes/VistaIconosGrandes";
import VistaIconosMedianos from "../../components/VistaIconosMedianos/VistaIconosMedianos";
import VistaIconosPequenos from "../../components/VistaIconosPequenos/VistaIconosPequenos";
import VistaDetalles from "../../components/VistaDetalles/VistaDetalles";
import VistaMosaicos from "../../components/VistaMosaicos/VistaMosaicos";
import VistaContenido from "../../components/VistaContenido/VistaContenido";
import VistaListaCarpetas from "../../components/VistaListaCarpetas/VistaListaCarpetas";

const ProyectoDetalle = ({ proyecto, onVolver }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [carpetas, setCarpetas] = useState([]);
  const [carpetaPadre, setCarpetaPadre] = useState(null);
  const [carpetaActual, setCarpetaActual] = useState(null);
  const [rutaCarpetas, setRutaCarpetas] = useState([]);
  const { showSuccess, showError } = useNotification();

  // Estados para menú contextual de carpetas
  const [contextMenuCarpeta, setContextMenuCarpeta] = useState({
    visible: false,
    x: 0,
    y: 0,
    carpeta: null
  });

  // Estados para modales de carpeta
  const [editarCarpetaModal, setEditarCarpetaModal] = useState(false);
  const [carpetaAEditar, setCarpetaAEditar] = useState(null);
  const [eliminarCarpetaModal, setEliminarCarpetaModal] = useState(false);
  const [carpetaAEliminar, setCarpetaAEliminar] = useState(null);

  // Estados para archivos
  const [subirArchivoModal, setSubirArchivoModal] = useState(false);
  const [refreshArchivos, setRefreshArchivos] = useState(0);
  const [carpetaParaArchivo, setCarpetaParaArchivo] = useState(null);

  // Estado para el modo de vista
  const [modoVista, setModoVista] = useState('iconos-grandes');

  // --- Lógica de carpetas y navegación ---
  const fetchCarpetas = async () => {
    if (!proyecto) return;
    try {
      const response = await fetch(`${BACKEND_URL}/carpetas/`);
      if (response.ok) {
        const todasLasCarpetas = await response.json();
        const carpetasDelProyecto = todasLasCarpetas.filter(carpeta => 
          carpeta.id_modulo === proyecto.id
        );
        setCarpetas(carpetasDelProyecto);
      }
    } catch (error) {
      setCarpetas([]);
    }
  };

  const handleAgregarCarpeta = (carpeta) => {
    showSuccess(`Carpeta "${carpeta.nombre}" creada exitosamente`);
    fetchCarpetas();
  };

  useEffect(() => {
    fetchCarpetas();
    setCarpetaActual(null);
    setRutaCarpetas([]);
  }, [proyecto]);

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenuCarpeta.visible) {
        cerrarContextMenuCarpeta();
      }
    };
    if (contextMenuCarpeta.visible) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenuCarpeta.visible]);

  const entrarEnCarpeta = (carpeta) => {
    setCarpetaActual(carpeta);
    setRutaCarpetas([...rutaCarpetas, carpeta]);
  };

  const volverAtras = () => {
    if (rutaCarpetas.length > 1) {
      const nuevaRuta = rutaCarpetas.slice(0, -1);
      setRutaCarpetas(nuevaRuta);
      setCarpetaActual(nuevaRuta[nuevaRuta.length - 1]);
    } else {
      setCarpetaActual(null);
      setRutaCarpetas([]);
    }
  };

  const irACarpeta = (carpeta, index) => {
    if (index === -1) {
      setCarpetaActual(null);
      setRutaCarpetas([]);
    } else {
      const nuevaRuta = rutaCarpetas.slice(0, index + 1);
      setRutaCarpetas(nuevaRuta);
      setCarpetaActual(carpeta);
    }
  };

  const obtenerCarpetasAMostrar = () => {
    if (!carpetaActual) {
      return carpetas.filter(carpeta => carpeta.id_padre === carpeta.id);
    } else {
      return carpetas.filter(carpeta => carpeta.id_padre === carpetaActual.id && carpeta.id !== carpetaActual.id);
    }
  };

  const handleContextMenuCarpeta = (e, carpeta) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuCarpeta({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      carpeta: carpeta
    });
  };

  const cerrarContextMenuCarpeta = () => {
    setContextMenuCarpeta({ visible: false, x: 0, y: 0, carpeta: null });
  };

  const editarCarpeta = (carpeta) => {
    setCarpetaAEditar(carpeta);
    setEditarCarpetaModal(true);
    cerrarContextMenuCarpeta();
  };

  const eliminarCarpeta = (carpeta) => {
    setCarpetaAEliminar(carpeta);
    setEliminarCarpetaModal(true);
    cerrarContextMenuCarpeta();
  };

  const confirmarEliminarCarpeta = async (carpetaId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/carpetas/${carpetaId}`, { method: 'DELETE' });
      if (response.ok) {
        showSuccess('Carpeta eliminada correctamente');
        fetchCarpetas();
        setEliminarCarpetaModal(false);
        setCarpetaAEliminar(null);
        if (carpetaActual && carpetaActual.id === carpetaId) {
          volverAtras();
        }
      } else {
        throw new Error('Error al eliminar la carpeta');
      }
    } catch (error) {
      showError('Error al eliminar la carpeta: ' + error.message);
    }
  };

  const actualizarNombreCarpeta = async (carpetaId, nuevoNombre) => {
    try {
      const response = await fetch(`${BACKEND_URL}/carpetas/${carpetaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nuevoNombre })
      });
      if (response.ok) {
        showSuccess('Nombre de carpeta actualizado correctamente');
        fetchCarpetas();
        setEditarCarpetaModal(false);
        setCarpetaAEditar(null);
      } else {
        throw new Error('Error al actualizar la carpeta');
      }
    } catch (error) {
      showError('Error al actualizar la carpeta: ' + error.message);
    }
  };

  const abrirModalSubirArchivo = (carpeta) => {
    setCarpetaParaArchivo(carpeta);
    setSubirArchivoModal(true);
  };

  const handleArchivoSubido = (documento) => {
    showSuccess(`Archivo "${documento.nombre_archivo}" subido correctamente`);
    setSubirArchivoModal(false);
    setCarpetaParaArchivo(null);
    setRefreshArchivos(r => r + 1); // Fuerza recarga de archivos
  };

  const renderBreadcrumb = () => (
    <div className="proyecto-detalle__breadcrumb">
      <span onClick={() => irACarpeta(null, -1)} className="proyecto-detalle__breadcrumb-item">🏠 Raíz</span>
      {rutaCarpetas.map((carpeta, index) => (
        <React.Fragment key={carpeta.id}>
          <span className="proyecto-detalle__breadcrumb-separator">/</span>
          <span
            onClick={() => irACarpeta(carpeta, index)}
            className={`proyecto-detalle__breadcrumb-item ${index === rutaCarpetas.length - 1 ? 'proyecto-detalle__breadcrumb-item--current' : ''}`}
          >
            {carpeta.nombre}
          </span>
        </React.Fragment>
      ))}
    </div>
  );

  if (!proyecto) return null;

  return (
    <div className="proyecto-detalle">
      <div className="proyecto-detalle__header">
        <div>
          <h2 className="proyecto-detalle__title">{proyecto.nombre}</h2>
        </div>
        <div className="proyecto-detalle__controls">
          {!carpetaActual && (
            <button onClick={() => { setCarpetaPadre(null); setModalOpen(true); }} className="proyecto-detalle__btn proyecto-detalle__btn--primary">Crear Carpeta Principal</button>
          )}
          {carpetaActual && (
            <button onClick={volverAtras} className="proyecto-detalle__btn proyecto-detalle__btn--secondary">← Volver Atrás</button>
          )}
          <button onClick={onVolver} className="proyecto-detalle__btn proyecto-detalle__btn--secondary">Volver a la lista</button>
        </div>
      </div>
      <div className="proyecto-detalle__content">
        <div className="proyecto-detalle__card">
          <div className="proyecto-detalle__toolbar">
            <h3 className="proyecto-detalle__toolbar-title">{carpetaActual ? `Contenido de "${carpetaActual.nombre}"` : 'Carpetas del Proyecto'}</h3>
            <div className="proyecto-detalle__toolbar-controls">
              {carpetaActual && (
                <>
                  <button 
                    onClick={() => { setCarpetaPadre(carpetaActual); setModalOpen(true); }} 
                    className="proyecto-detalle__btn--small proyecto-detalle__btn--success"
                    title="Crear nueva subcarpeta"
                  >
                    <span>📁</span>
                    Subcarpeta
                  </button>
                  <button 
                    onClick={() => abrirModalSubirArchivo(carpetaActual)} 
                    className="proyecto-detalle__btn--small proyecto-detalle__btn--warning"
                    title="Subir archivo nuevo"
                  >
                    <span>📄</span>
                    Archivo
                  </button>
                </>
              )}
              <AcordeonVista modoVista={modoVista} onModoVistaChange={setModoVista} />
            </div>
          </div>
          {(carpetaActual || rutaCarpetas.length > 0) && renderBreadcrumb()}
          <div className="proyecto-detalle__scroll-area">
            {(() => {
              const carpetasAMostrar = obtenerCarpetasAMostrar();
              if (carpetasAMostrar.length === 0 && !carpetaActual) {
                return <div className="proyecto-detalle__empty-message">No hay carpetas en este proyecto aún. Haz clic en 'Crear Carpeta Principal' para comenzar.</div>;
              }
              const renderizarCarpetas = () => {
                if (carpetasAMostrar.length === 0) return null;
                const props = { carpetas: carpetasAMostrar, onEntrarCarpeta: entrarEnCarpeta, onContextMenu: handleContextMenuCarpeta };
                switch (modoVista) {
                  case 'iconos-grandes': return <VistaIconosGrandes {...props} />;
                  case 'iconos-medianos': return <VistaIconosMedianos {...props} />;
                  case 'iconos-pequenos': return <VistaIconosPequenos {...props} />;
                  case 'detalles': return <VistaDetalles {...props} />;
                  case 'mosaicos': return <VistaMosaicos {...props} />;
                  case 'contenido': return <VistaContenido {...props} />;
                  case 'lista-carpetas':
                  default: return <VistaListaCarpetas {...props} />;
                }
              };
              return (
                <>
                  {renderizarCarpetas()}
                  {carpetaActual && (
                    <div className="proyecto-detalle__section-divider">
                      <ListaArchivos 
                        carpetaId={carpetaActual.id} 
                        onUpload={handleArchivoSubido} 
                        modoVista={modoVista} 
                        refresh={refreshArchivos}
                        esDeProyecto={true}
                      />
                    </div>
                  )}
                  {carpetaActual && carpetasAMostrar.length === 0 && (
                    <div className="proyecto-detalle__empty-message proyecto-detalle__empty-message--compact">No hay subcarpetas en "{carpetaActual.nombre}". Haz clic en "Subcarpeta" para agregar una.</div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>
      <CrearCarpetaModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setCarpetaPadre(null); }}
        onCreated={handleAgregarCarpeta}
        id_modulo={proyecto.id}
        id_padre={carpetaPadre ? carpetaPadre.id : null}
      />
      <ContextMenuCarpeta
        x={contextMenuCarpeta.x}
        y={contextMenuCarpeta.y}
        visible={contextMenuCarpeta.visible}
        carpeta={contextMenuCarpeta.carpeta}
        onClose={cerrarContextMenuCarpeta}
        onEdit={editarCarpeta}
        onDelete={eliminarCarpeta}
      />
      <EditarCarpetaModal
        isOpen={editarCarpetaModal}
        carpeta={carpetaAEditar}
        onClose={() => { setEditarCarpetaModal(false); setCarpetaAEditar(null); }}
        onUpdate={actualizarNombreCarpeta}
      />
      <ConfirmarEliminarCarpetaModal
        isOpen={eliminarCarpetaModal}
        carpeta={carpetaAEliminar}
        onClose={() => { setEliminarCarpetaModal(false); setCarpetaAEliminar(null); }}
        onConfirm={confirmarEliminarCarpeta}
      />
      <SubirArchivoModal
        isOpen={subirArchivoModal}
        carpetaId={carpetaParaArchivo?.id}
        onClose={() => { setSubirArchivoModal(false); setCarpetaParaArchivo(null); }}
        onUploaded={handleArchivoSubido}
      />
    </div>
  );
};

export default ProyectoDetalle;
