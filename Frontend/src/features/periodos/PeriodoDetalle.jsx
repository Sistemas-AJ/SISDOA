import React, { useState, useEffect } from "react";
import "./PeriodoDetalle.css";
import CrearCarpetaModal from "../proyectos/CrearCarpetaModal";
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

const PeriodoDetalle = ({ periodo }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [carpetas, setCarpetas] = useState([]);
  const [carpetaPadre, setCarpetaPadre] = useState(null);
  const [carpetaActual, setCarpetaActual] = useState(null); // Para navegación
  const [rutaCarpetas, setRutaCarpetas] = useState([]); // Para breadcrumb
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
  const [carpetaParaArchivo, setCarpetaParaArchivo] = useState(null);
  
  // Estado para el modo de vista
  const [modoVista, setModoVista] = useState('iconos-grandes'); // Diferentes modos de vista

  const fetchCarpetas = async () => {
    if (!periodo) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/carpetas/`);
      if (response.ok) {
        const todasLasCarpetas = await response.json();
        // Filtrar solo las carpetas de este módulo/período
        const carpetasDelPeriodo = todasLasCarpetas.filter(carpeta => 
          carpeta.id_modulo === periodo.id
        );
        setCarpetas(carpetasDelPeriodo);
      }
    } catch (error) {
      console.error('Error al cargar carpetas:', error);
      setCarpetas([]);
    }
  };

  const handleAgregarCarpeta = (carpeta) => {
    // Carpeta creada exitosamente
    console.log("Carpeta creada:", carpeta);
    showSuccess(`Carpeta "${carpeta.nombre}" creada exitosamente`);
    // Refrescar la lista de carpetas
    fetchCarpetas();
  };

  // Cargar carpetas cuando cambie el período
  useEffect(() => {
    fetchCarpetas();
    setCarpetaActual(null);
    setRutaCarpetas([]);
  }, [periodo]);

  // Cerrar menú contextual al hacer clic fuera
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

  // Función para entrar a una carpeta
  const entrarEnCarpeta = (carpeta) => {
    setCarpetaActual(carpeta);
    setRutaCarpetas([...rutaCarpetas, carpeta]);
  };

  // Función para volver a la carpeta padre
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

  // Función para ir a una carpeta específica en el breadcrumb
  const irACarpeta = (carpeta, index) => {
    if (index === -1) {
      // Ir a raíz
      setCarpetaActual(null);
      setRutaCarpetas([]);
    } else {
      const nuevaRuta = rutaCarpetas.slice(0, index + 1);
      setRutaCarpetas(nuevaRuta);
      setCarpetaActual(carpeta);
    }
  };

  // Función para obtener las carpetas que se deben mostrar
  const obtenerCarpetasAMostrar = () => {
    if (!carpetaActual) {
      // Mostrar carpetas raíz (autoreferenciadas)
      return carpetas.filter(carpeta => carpeta.id_padre === carpeta.id);
    } else {
      // Mostrar subcarpetas de la carpeta actual
      return carpetas.filter(carpeta => carpeta.id_padre === carpetaActual.id && carpeta.id !== carpetaActual.id);
    }
  };

  // Función para manejar el menú contextual de carpetas
  const handleContextMenuCarpeta = (e, carpeta) => {
    e.preventDefault();
    e.stopPropagation(); // Evitar que se ejecute el onClick de la carpeta
    setContextMenuCarpeta({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      carpeta: carpeta
    });
  };

  // Función para cerrar el menú contextual
  const cerrarContextMenuCarpeta = () => {
    setContextMenuCarpeta({ visible: false, x: 0, y: 0, carpeta: null });
  };

  // Función para editar una carpeta
  const editarCarpeta = (carpeta) => {
    setCarpetaAEditar(carpeta);
    setEditarCarpetaModal(true);
    cerrarContextMenuCarpeta();
  };

  // Función para eliminar una carpeta
  const eliminarCarpeta = (carpeta) => {
    setCarpetaAEliminar(carpeta);
    setEliminarCarpetaModal(true);
    cerrarContextMenuCarpeta();
  };

  // Función para confirmar eliminación de carpeta
  const confirmarEliminarCarpeta = async (carpetaId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/carpetas/${carpetaId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        showSuccess('Carpeta eliminada correctamente');
        fetchCarpetas(); // Recargar carpetas
        setEliminarCarpetaModal(false);
        setCarpetaAEliminar(null);
        
        // Si estamos en la carpeta que se eliminó, volver atrás
        if (carpetaActual && carpetaActual.id === carpetaId) {
          volverAtras();
        }
      } else {
        throw new Error('Error al eliminar la carpeta');
      }
    } catch (error) {
      console.error('Error:', error);
      showError('Error al eliminar la carpeta: ' + error.message);
    }
  };

  // Función para actualizar el nombre de una carpeta
  const actualizarNombreCarpeta = async (carpetaId, nuevoNombre) => {
    try {
      const response = await fetch(`${BACKEND_URL}/carpetas/${carpetaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: nuevoNombre
        })
      });

      if (response.ok) {
        showSuccess('Nombre de carpeta actualizado correctamente');
        fetchCarpetas(); // Recargar carpetas
        setEditarCarpetaModal(false);
        setCarpetaAEditar(null);
      } else {
        throw new Error('Error al actualizar la carpeta');
      }
    } catch (error) {
      console.error('Error:', error);
      showError('Error al actualizar la carpeta: ' + error.message);
    }
  };

  // Función para abrir modal de subir archivo
  const abrirModalSubirArchivo = (carpeta) => {
    setCarpetaParaArchivo(carpeta);
    setSubirArchivoModal(true);
  };

  // Función para manejar archivo subido
  const handleArchivoSubido = (documento) => {
    showSuccess(`Archivo "${documento.nombre_archivo}" subido correctamente`);
    setSubirArchivoModal(false);
    setCarpetaParaArchivo(null);
    // Aquí podrías refrescar la lista de archivos si es necesario
  };

  // Función para renderizar el breadcrumb (ruta de navegación)
  const renderBreadcrumb = () => {
    return (
      <div className="periodo-detalle__breadcrumb">
        <span 
          onClick={() => irACarpeta(null, -1)}
          className="periodo-detalle__breadcrumb-item"
        >
          🏠 Raíz
        </span>
        
        {rutaCarpetas.map((carpeta, index) => (
          <React.Fragment key={carpeta.id}>
            <span className="periodo-detalle__breadcrumb-separator">/</span>
            <span 
              onClick={() => irACarpeta(carpeta, index)}
              className={`periodo-detalle__breadcrumb-item ${
                index === rutaCarpetas.length - 1 
                  ? 'periodo-detalle__breadcrumb-item--current' 
                  : ''
              }`}
            >
              {carpeta.nombre}
            </span>
          </React.Fragment>
        ))}
      </div>
    );
  };



  if (!periodo) {
    return (
      <div className="periodo-detalle__empty-message">
        Selecciona un período para ver detalles
      </div>
    );
  }

  // Buscar metadatos del período
  const responsable = periodo.metadatos?.find(m => m.clave === "responsable_proyecto")?.valor || "Sin responsable";
  const estado = periodo.metadatos?.find(m => m.clave === "estado_proyecto")?.valor || "Sin estado";

  // Función para obtener clase CSS del estado
  const getEstadoClass = (estado) => {
    switch (estado) {
      case 'Activo':
        return 'periodo-detalle__status--activo';
      case 'Completado':
        return 'periodo-detalle__status--completado';
      case 'En Pausa':
        return 'periodo-detalle__status--pausa';
      default:
        return 'periodo-detalle__status--default';
    }
  };

  return (
    <div className="periodo-detalle">
      {/* Cabecera compacta */}
      <div className="periodo-detalle__header">
        <div>
          <h2 className="periodo-detalle__title">{periodo.nombre}</h2>
          <div className="periodo-detalle__meta">
            <span className="periodo-detalle__meta-item">
              <b>Responsable:</b> {responsable}
            </span>
            <span className="periodo-detalle__meta-item">
              <b>Estado:</b>
              <span className={`periodo-detalle__status ${getEstadoClass(estado)}`}>
                {estado}
              </span>
            </span>
          </div>
        </div>
        <div className="periodo-detalle__controls">
          {!carpetaActual && (
            <button 
              onClick={() => {
                setCarpetaPadre(null);
                setModalOpen(true);
              }}
              className="periodo-detalle__btn periodo-detalle__btn--primary"
            >
              Crear Carpeta Principal
            </button>
          )}
          
          {carpetaActual && (
            <button 
              onClick={volverAtras}
              className="periodo-detalle__btn periodo-detalle__btn--secondary"
            >
              ← Volver Atrás
            </button>
          )}
          <input
            type="text"
            placeholder="Buscar..."
            className="periodo-detalle__search"
          />
        </div>
      </div>

      {/* Área de contenido con scroll */}
      <div className="periodo-detalle__content">
        <div className="periodo-detalle__card">
          
          {/* Barra de herramientas compacta */}
          <div className="periodo-detalle__toolbar">
            <h3 className="periodo-detalle__toolbar-title">
              {carpetaActual ? `Contenido de "${carpetaActual.nombre}"` : 'Carpetas del Período'}
            </h3>
            
            <div className="periodo-detalle__toolbar-controls">
              {/* Botones para carpeta actual */}
              {carpetaActual && (
                <>
                  <button 
                    onClick={() => {
                      setCarpetaPadre(carpetaActual);
                      setModalOpen(true);
                    }}
                    className="periodo-detalle__btn--small periodo-detalle__btn--success"
                  >
                    + Subcarpeta
                  </button>
                  
                  <button 
                    onClick={() => abrirModalSubirArchivo(carpetaActual)}
                    className="periodo-detalle__btn--small periodo-detalle__btn--warning"
                  >
                    📄 Archivo
                  </button>
                </>
              )}
              
              {/* Acordeón de vista */}
              <AcordeonVista 
                modoVista={modoVista} 
                onModoVistaChange={setModoVista} 
              />
            </div>
          </div>
          
          {/* Navegación breadcrumb */}
          {(carpetaActual || rutaCarpetas.length > 0) && renderBreadcrumb()}

          {/* Contenido principal con scroll */}
          <div className="periodo-detalle__scroll-area">
            {(() => {
              const carpetasAMostrar = obtenerCarpetasAMostrar();
              
              if (carpetasAMostrar.length === 0 && !carpetaActual) {
                return (
                  <div className="periodo-detalle__empty-message">
                    No hay carpetas en este período aún. Haz clic en 'Crear Carpeta Principal' para comenzar.
                  </div>
                );
              }
              
              // Renderizar carpetas si las hay
              const renderizarCarpetas = () => {
                if (carpetasAMostrar.length === 0) return null;
                
                const props = {
                  carpetas: carpetasAMostrar,
                  onEntrarCarpeta: entrarEnCarpeta,
                  onContextMenu: handleContextMenuCarpeta
                };

                switch (modoVista) {
                  case 'iconos-grandes':
                    return <VistaIconosGrandes {...props} />;
                  case 'iconos-medianos':
                    return <VistaIconosMedianos {...props} />;
                  case 'iconos-pequenos':
                    return <VistaIconosPequenos {...props} />;
                  case 'detalles':
                    return <VistaDetalles {...props} />;
                  case 'mosaicos':
                    return <VistaMosaicos {...props} />;
                  case 'contenido':
                    return <VistaContenido {...props} />;
                  case 'lista-carpetas':
                  default:
                    return <VistaListaCarpetas {...props} />;
                }
              };

              return (
                <>
                  {renderizarCarpetas()}
                  
                  {/* Mostrar archivos cuando estemos dentro de una carpeta */}
                  {carpetaActual && (
                    <div className="periodo-detalle__section-divider">
                      <ListaArchivos 
                        carpetaId={carpetaActual.id}
                        onUpload={handleArchivoSubido}
                        modoVista={modoVista}
                      />
                    </div>
                  )}
                  
                  {/* Mensaje cuando no hay subcarpetas en la carpeta actual */}
                  {carpetaActual && carpetasAMostrar.length === 0 && (
                    <div className="periodo-detalle__empty-message periodo-detalle__empty-message--compact">
                      No hay subcarpetas en "{carpetaActual.nombre}". Haz clic en "Subcarpeta" para agregar una.
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>

      <CrearCarpetaModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setCarpetaPadre(null);
        }}
        onCreated={handleAgregarCarpeta}
        id_modulo={periodo.id}
        id_padre={carpetaPadre ? carpetaPadre.id : null}
      />

      {/* Menú contextual para carpetas */}
      <ContextMenuCarpeta
        x={contextMenuCarpeta.x}
        y={contextMenuCarpeta.y}
        visible={contextMenuCarpeta.visible}
        carpeta={contextMenuCarpeta.carpeta}
        onClose={cerrarContextMenuCarpeta}
        onEdit={editarCarpeta}
        onDelete={eliminarCarpeta}
      />

      {/* Modal para editar carpeta */}
      <EditarCarpetaModal
        isOpen={editarCarpetaModal}
        carpeta={carpetaAEditar}
        onClose={() => {
          setEditarCarpetaModal(false);
          setCarpetaAEditar(null);
        }}
        onUpdate={actualizarNombreCarpeta}
      />

      {/* Modal para confirmar eliminación de carpeta */}
      <ConfirmarEliminarCarpetaModal
        isOpen={eliminarCarpetaModal}
        carpeta={carpetaAEliminar}
        onClose={() => {
          setEliminarCarpetaModal(false);
          setCarpetaAEliminar(null);
        }}
        onConfirm={confirmarEliminarCarpeta}
      />

      {/* Modal para subir archivos */}
      <SubirArchivoModal
        isOpen={subirArchivoModal}
        carpetaId={carpetaParaArchivo?.id}
        onClose={() => {
          setSubirArchivoModal(false);
          setCarpetaParaArchivo(null);
        }}
        onUploaded={handleArchivoSubido}
      />
    </div>
  );
};

export default PeriodoDetalle;
        