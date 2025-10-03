import React, { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
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
  // --- ESTADOS PRINCIPALES ---
  const [modalOpen, setModalOpen] = useState(false);
  const [carpetas, setCarpetas] = useState([]);
  const [carpetaPadre, setCarpetaPadre] = useState(null);
  const [carpetaActual, setCarpetaActual] = useState(null); // Para navegación
  const [rutaCarpetas, setRutaCarpetas] = useState([]); // Para breadcrumb
  const { showSuccess, showError } = useNotification();

  // --- ESTADOS PARA MENÚ CONTEXTUAL Y MODALES DE CARPETAS ---
  const [contextMenuCarpeta, setContextMenuCarpeta] = useState({
    visible: false,
    x: 0,
    y: 0,
    carpeta: null,
  });
  const [editarCarpetaModal, setEditarCarpetaModal] = useState(false);
  const [carpetaAEditar, setCarpetaAEditar] = useState(null);
  const [eliminarCarpetaModal, setEliminarCarpetaModal] = useState(false);
  const [carpetaAEliminar, setCarpetaAEliminar] = useState(null);

  // --- ESTADOS PARA ARCHIVOS ---
  const [subirArchivoModal, setSubirArchivoModal] = useState(false);
  const [carpetaParaArchivo, setCarpetaParaArchivo] = useState(null);
  const [refreshArchivos, setRefreshArchivos] = useState(0); // Para forzar refresh de archivos

  // --- ESTADOS DE UI (VISTA Y BÚSQUEDA) ---
  const [modoVista, setModoVista] = useState('iconos-grandes');
  const [busqueda, setBusqueda] = useState("");

  // --- CARGA DE DATOS ---
  const fetchCarpetas = async () => {
    if (!periodo) return;
    try {
      const response = await fetch(`${BACKEND_URL}/carpetas/`);
      if (response.ok) {
        const todasLasCarpetas = await response.json();
        const carpetasDelPeriodo = todasLasCarpetas.filter(
          (carpeta) => carpeta.id_modulo === periodo.id
        );
        setCarpetas(carpetasDelPeriodo);
      }
    } catch (error) {
      console.error('Error al cargar carpetas:', error);
      showError('No se pudieron cargar las carpetas.');
      setCarpetas([]);
    }
  };

  // --- EFECTOS ---
  // Cargar carpetas y restaurar navegación cuando cambia el período
  useEffect(() => {
    fetchCarpetas();

    if (periodo) {
      const navegacionGuardada = localStorage.getItem(`navegacion_periodo_${periodo.id}`);
      if (navegacionGuardada) {
        try {
          const { carpetaActual: ca, rutaCarpetas: rc } = JSON.parse(navegacionGuardada);
          setCarpetaActual(ca);
          setRutaCarpetas(rc || []);
        } catch (error) {
          console.error('Error al restaurar navegación:', error);
          setCarpetaActual(null);
          setRutaCarpetas([]);
        }
      } else {
        setCarpetaActual(null);
        setRutaCarpetas([]);
      }
    } else {
      setCarpetaActual(null);
      setRutaCarpetas([]);
    }
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

  // --- MANEJO DE NAVEGACIÓN ENTRE CARPETAS ---
  const guardarNavegacion = (nuevaCarpeta, nuevaRuta) => {
    if (periodo) {
      localStorage.setItem(`navegacion_periodo_${periodo.id}`, JSON.stringify({
        carpetaActual: nuevaCarpeta,
        rutaCarpetas: nuevaRuta,
      }));
    }
  };

  const entrarEnCarpeta = (carpeta) => {
    const nuevaRuta = [...rutaCarpetas, carpeta];
    setCarpetaActual(carpeta);
    setRutaCarpetas(nuevaRuta);
    guardarNavegacion(carpeta, nuevaRuta);
  };

  const volverAtras = () => {
    const nuevaRuta = rutaCarpetas.slice(0, -1);
    const nuevaCarpeta = nuevaRuta.length > 0 ? nuevaRuta[nuevaRuta.length - 1] : null;
    setRutaCarpetas(nuevaRuta);
    setCarpetaActual(nuevaCarpeta);
    guardarNavegacion(nuevaCarpeta, nuevaRuta);
  };

  const irACarpeta = (carpeta, index) => {
    const esRaiz = index === -1;
    const nuevaRuta = esRaiz ? [] : rutaCarpetas.slice(0, index + 1);
    const nuevaCarpeta = esRaiz ? null : carpeta;
    setRutaCarpetas(nuevaRuta);
    setCarpetaActual(nuevaCarpeta);
    guardarNavegacion(nuevaCarpeta, nuevaRuta);
  };

  // --- LÓGICA DE VISUALIZACIÓN ---
  const obtenerCarpetasAMostrar = () => {
    let carpetasVisibles;
    if (!carpetaActual) {
      // Carpetas en la raíz (id_padre se autoreferencia)
      // Nota: Una alternativa común es id_padre === null para las carpetas raíz.
      // Se mantiene la lógica original.
      carpetasVisibles = carpetas.filter(carpeta => carpeta.id_padre === carpeta.id);
    } else {
      // Subcarpetas de la carpeta actual
      carpetasVisibles = carpetas.filter(
        (carpeta) => carpeta.id_padre === carpetaActual.id && carpeta.id !== carpetaActual.id
      );
    }

    if (busqueda.trim() !== "") {
      const textoBusqueda = busqueda.trim().toLowerCase();
      return carpetasVisibles.filter((carpeta) =>
        carpeta.nombre.toLowerCase().includes(textoBusqueda)
      );
    }
    return carpetasVisibles;
  };

  // --- MANEJADORES DE EVENTOS (CRUD CARPETAS) ---
  const handleAgregarCarpeta = (carpeta) => {
    showSuccess(`Carpeta "${carpeta.nombre}" creada exitosamente`);
    fetchCarpetas();
  };

  const actualizarNombreCarpeta = async (carpetaId, nuevoNombre) => {
    try {
      const response = await fetch(`${BACKEND_URL}/carpetas/${carpetaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nuevoNombre }),
      });
      if (response.ok) {
        showSuccess('Nombre de carpeta actualizado');
        fetchCarpetas();
        setEditarCarpetaModal(false);
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('Error al actualizar carpeta:', error);
      showError('No se pudo actualizar la carpeta.');
    }
  };

  const confirmarEliminarCarpeta = async (carpetaId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/carpetas/${carpetaId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        showSuccess('Carpeta eliminada correctamente');
        setEliminarCarpetaModal(false);
        fetchCarpetas();
        if (carpetaActual && carpetaActual.id === carpetaId) {
          volverAtras();
        }
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('Error al eliminar carpeta:', error);
      showError('No se pudo eliminar la carpeta.');
    }
  };

  // --- MANEJADORES DE EVENTOS (MENÚ CONTEXTUAL) ---
  const handleContextMenuCarpeta = (e, carpeta) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuCarpeta({ visible: true, x: e.clientX, y: e.clientY, carpeta });
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

  // --- MANEJADORES DE EVENTOS (ARCHIVOS) ---
  const abrirModalSubirArchivo = (carpeta) => {
    setCarpetaParaArchivo(carpeta);
    setSubirArchivoModal(true);
  };

  const handleArchivoSubido = (documento) => {
    showSuccess(`Archivo "${documento.nombre_archivo}" subido correctamente`);
    setSubirArchivoModal(false);
    setRefreshArchivos((prev) => prev + 1); // Forzar actualización de ListaArchivos
  };

  // --- RENDERIZADO DE COMPONENTES ---
  const renderBreadcrumb = () => (
    <div className="periodo-detalle__breadcrumb">
      <span onClick={() => irACarpeta(null, -1)} className="periodo-detalle__breadcrumb-item">
        🏠 Raíz
      </span>
      {rutaCarpetas.map((carpeta, index) => (
        <React.Fragment key={carpeta.id}>
          <span className="periodo-detalle__breadcrumb-separator">/</span>
          <span
            onClick={() => irACarpeta(carpeta, index)}
            className={`periodo-detalle__breadcrumb-item ${index === rutaCarpetas.length - 1 ? 'periodo-detalle__breadcrumb-item--current' : ''}`}
          >
            {carpeta.nombre}
          </span>
        </React.Fragment>
      ))}
    </div>
  );

  const renderizarCarpetas = () => {
    const carpetasAMostrar = obtenerCarpetasAMostrar();
    if (carpetasAMostrar.length === 0) return null;

    const props = {
      carpetas: carpetasAMostrar,
      onEntrarCarpeta: entrarEnCarpeta,
      onContextMenu: handleContextMenuCarpeta,
    };

    switch (modoVista) {
      case 'iconos-grandes': return <VistaIconosGrandes {...props} textoBusqueda={busqueda} />;
      case 'iconos-medianos': return <VistaIconosMedianos {...props} />;
      case 'iconos-pequenos': return <VistaIconosPequenos {...props} />;
      case 'detalles': return <VistaDetalles {...props} />;
      case 'mosaicos': return <VistaMosaicos {...props} />;
      case 'contenido': return <VistaContenido {...props} />;
      case 'lista-carpetas':
      default: return <VistaListaCarpetas {...props} />;
    }
  };

  // --- RENDERIZADO PRINCIPAL ---
  if (!periodo) {
    return (
      <div className="periodo-detalle__empty-message">
        Selecciona un período para ver detalles
      </div>
    );
  }

  const responsable = periodo.metadatos?.find(m => m.clave === "responsable_proyecto")?.valor || "Sin responsable";
  const estado = periodo.metadatos?.find(m => m.clave === "estado_proyecto")?.valor || "Sin estado";
  const getEstadoClass = (est) => {
    switch (est) {
      case 'Activo': return 'periodo-detalle__status--activo';
      case 'Completado': return 'periodo-detalle__status--completado';
      case 'En Pausa': return 'periodo-detalle__status--pausa';
      default: return 'periodo-detalle__status--default';
    }
  };

  const carpetasAMostrar = obtenerCarpetasAMostrar();

  return (
    <div className="periodo-detalle">
      {/* Cabecera */}
      <div className="periodo-detalle__header">
        <div>
          <h2 className="periodo-detalle__title">{periodo.nombre}</h2>
          <div className="periodo-detalle__meta">
            <span className="periodo-detalle__meta-item"><b>Responsable:</b> {responsable}</span>
            <span className="periodo-detalle__meta-item">
              <b>Estado:</b> <span className={`periodo-detalle__status ${getEstadoClass(estado)}`}>{estado}</span>
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
            <button onClick={volverAtras} className="periodo-detalle__btn periodo-detalle__btn--secondary">
              ← Volver Atrás
            </button>
          )}
        </div>
      </div>

      {/* Área de contenido */}
      <div className="periodo-detalle__content">
        <div className="periodo-detalle__card">
          <div className="periodo-detalle__toolbar">
            <h3 className="periodo-detalle__toolbar-title">
              {carpetaActual ? `Contenido de "${carpetaActual.nombre}"` : 'Carpetas del Período'}
            </h3>
            <div className="periodo-detalle__toolbar-controls">
              {carpetaActual && (
                <>
                  <button
                    onClick={() => {
                      setCarpetaPadre(carpetaActual);
                      setModalOpen(true);
                    }}
                    className="periodo-detalle__btn--small periodo-detalle__btn--success"
                    title="Crear nueva subcarpeta"
                  >
                    <span>📁</span> Subcarpeta
                  </button>
                  <button
                    onClick={() => abrirModalSubirArchivo(carpetaActual)}
                    className="periodo-detalle__btn--small periodo-detalle__btn--warning"
                    title="Subir archivo nuevo"
                  >
                    <span>📄</span> Archivo
                  </button>
                </>
              )}
              <AcordeonVista modoVista={modoVista} onModoVistaChange={setModoVista} />
            </div>
          </div>

          {(carpetaActual || rutaCarpetas.length > 0) && renderBreadcrumb()}

          <div className="periodo-detalle__scroll-area">
            {carpetasAMostrar.length === 0 && !carpetaActual ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '45vh', color: '#4a5a6a', background: 'linear-gradient(135deg, #f8fafc 60%, #e3eaf5 100%)', borderRadius: '18px', boxShadow: '0 4px 24px 0 rgba(80,100,120,0.07)', margin: '32px', fontSize: '1.2rem', transition: 'box-shadow 0.3s' }}>
                <FaCalendarAlt size={60} color="#7da0fa" style={{ marginBottom: 24, opacity: 0.7 }} />
                <div style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: 8 }}>¡Aún no hay carpetas!</div>
                <div style={{ color: '#6c7a89', fontSize: '1.1rem', textAlign: 'center' }}>
                  Crea una carpeta principal para comenzar a organizar tus archivos.
                </div>
              </div>
            ) : (
              <>
                {renderizarCarpetas()}
                {carpetaActual && (
                  <div className="periodo-detalle__section-divider">
                    <ListaArchivos
                      carpetaId={carpetaActual.id}
                      onUpload={handleArchivoSubido}
                      modoVista={modoVista}
                      refresh={refreshArchivos}
                      esDeProyecto={false}
                    />
                  </div>
                )}
                {carpetaActual && carpetasAMostrar.length === 0 && (
                  <div className="periodo-detalle__empty-message periodo-detalle__empty-message--compact">
                    No hay subcarpetas en "{carpetaActual.nombre}".
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      <CrearCarpetaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleAgregarCarpeta}
        id_modulo={periodo.id}
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
        onClose={() => setEditarCarpetaModal(false)}
        onUpdate={actualizarNombreCarpeta}
      />
      <ConfirmarEliminarCarpetaModal
        isOpen={eliminarCarpetaModal}
        carpeta={carpetaAEliminar}
        onClose={() => setEliminarCarpetaModal(false)}
        onConfirm={confirmarEliminarCarpeta}
      />
      <SubirArchivoModal
        isOpen={subirArchivoModal}
        carpetaId={carpetaParaArchivo?.id}
        onClose={() => setSubirArchivoModal(false)}
        onUploaded={handleArchivoSubido}
      />
    </div>
  );
};

export default PeriodoDetalle;