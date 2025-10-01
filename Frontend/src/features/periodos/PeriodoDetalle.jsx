import React, { useState, useEffect } from "react";
import CrearCarpetaModal from "../proyectos/CrearCarpetaModal";
import BACKEND_URL from "../../service/backend";
import { useNotification } from "../../contexts/NotificationContext";
import ContextMenuCarpeta from "../../components/ContextMenuCarpeta/ContextMenuCarpeta";
import EditarCarpetaModal from "../../components/EditarCarpetaModal/EditarCarpetaModal";
import ConfirmarEliminarCarpetaModal from "../../components/ConfirmarEliminarCarpetaModal/ConfirmarEliminarCarpetaModal";
import SubirArchivoModal from "../../components/SubirArchivoModal/SubirArchivoModal";
import ListaArchivos from "../../components/ListaArchivos/ListaArchivos";

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
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        marginBottom: '16px',
        padding: '8px 12px',
        background: '#f8f9fa',
        borderRadius: '6px',
        fontSize: '14px'
      }}>
        <span 
          onClick={() => irACarpeta(null, -1)}
          style={{ 
            cursor: 'pointer', 
            color: '#2196f3',
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
          onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
        >
          🏠 Raíz
        </span>
        
        {rutaCarpetas.map((carpeta, index) => (
          <React.Fragment key={carpeta.id}>
            <span style={{ color: '#666' }}>/</span>
            <span 
              onClick={() => irACarpeta(carpeta, index)}
              style={{ 
                cursor: 'pointer', 
                color: index === rutaCarpetas.length - 1 ? '#333' : '#2196f3',
                fontWeight: index === rutaCarpetas.length - 1 ? 'bold' : 'normal'
              }}
              onMouseEnter={(e) => {
                if (index !== rutaCarpetas.length - 1) {
                  e.target.style.textDecoration = 'underline';
                }
              }}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              {carpeta.nombre}
            </span>
          </React.Fragment>
        ))}
      </div>
    );
  };

  // Función para renderizar una carpeta
  const renderCarpeta = (carpeta) => {
    return (
      <div 
        key={carpeta.id}
        style={{
          padding: '16px',
          background: 'white',
          borderRadius: '6px',
          border: '1px solid #ddd',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px'
        }}
        onClick={() => entrarEnCarpeta(carpeta)}
        onContextMenu={(e) => handleContextMenuCarpeta(e, carpeta)}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#2196f3';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(33, 150, 243, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#ddd';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            background: '#2196f3', 
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px'
          }}>
            📁
          </div>
          <div>
            <div style={{ fontWeight: '500', color: '#333', fontSize: '14px' }}>
              {carpeta.nombre}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              Creada: {new Date(carpeta.fecha_creacion).toLocaleDateString('es-ES')}
            </div>
          </div>
        </div>
        
        <div style={{ fontSize: '12px', color: '#888' }}>
          Click derecho para opciones →
        </div>
      </div>
    );
  };

  if (!periodo) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#666', fontStyle: 'italic' }}>
      Selecciona un período para ver detalles
    </div>;
  }

  // Buscar metadatos del período
  const responsable = periodo.metadatos?.find(m => m.clave === "responsable_proyecto")?.valor || "Sin responsable";
  const estado = periodo.metadatos?.find(m => m.clave === "estado_proyecto")?.valor || "Sin estado";

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, marginTop: 32 }}>
        <div style={{ marginLeft: 24 }}>
          <h2 style={{ margin: 0, color: '#333' }}>{periodo.nombre}</h2>
          <p style={{ margin: '8px 0 0 0', color: '#555' }}>
            <b>Responsable:</b> {responsable}
          </p>
          <p style={{ margin: '4px 0 0 0' }}>
            <b>Estado:</b> 
            <span style={{
              marginLeft: '8px',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              backgroundColor: estado === 'Activo' ? '#e8f5e8' : 
                             estado === 'Completado' ? '#e3f2fd' : 
                             estado === 'En Pausa' ? '#fff3e0' : '#f5f5f5',
              color: estado === 'Activo' ? '#2e7d32' : 
                     estado === 'Completado' ? '#1565c0' : 
                     estado === 'En Pausa' ? '#ef6c00' : '#757575'
            }}>
              {estado}
            </span>
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!carpetaActual && (
            <button 
              onClick={() => {
                setCarpetaPadre(null); // Para carpeta raíz
                setModalOpen(true);
              }}
              style={{
                backgroundColor: '#2196f3',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1976d2'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#2196f3'}
            >
              Crear Carpeta Principal
            </button>
          )}
          
          {carpetaActual && (
            <button 
              onClick={volverAtras}
              style={{
                backgroundColor: '#757575',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                marginRight: '12px'
              }}
            >
              ← Volver Atrás
            </button>
          )}
          <input
            type="text"
            placeholder="Buscar..."
            style={{ 
              padding: '8px 12px', 
              width: '180px', 
              border: '1px solid #ddd', 
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      {/* Lista de carpetas del período */}
      <div style={{ margin: '20px 24px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>Carpetas del Período</h3>
        
{/* Navegación breadcrumb */}
        {(carpetaActual || rutaCarpetas.length > 0) && renderBreadcrumb()}
        
        {/* Botones para carpeta actual */}
        {carpetaActual && (
          <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => {
                setCarpetaPadre(carpetaActual);
                setModalOpen(true);
              }}
              style={{
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              + Crear Subcarpeta en "{carpetaActual.nombre}"
            </button>
            
            <button 
              onClick={() => abrirModalSubirArchivo(carpetaActual)}
              style={{
                backgroundColor: '#ff9800',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              📄 Subir Archivo
            </button>
          </div>
        )}

        {/* Lista de carpetas */}
        {(() => {
          const carpetasAMostrar = obtenerCarpetasAMostrar();
          
          if (carpetasAMostrar.length === 0) {
            return (
              <div style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', padding: '20px' }}>
                {carpetaActual 
                  ? `No hay subcarpetas en "${carpetaActual.nombre}". Haz clic en "Crear Subcarpeta" para agregar una.`
                  : "No hay carpetas en este período aún. Haz clic en 'Crear Carpeta Principal' para comenzar."
                }
              </div>
            );
          }
          
          return (
            <div>
              {carpetasAMostrar.map(carpeta => renderCarpeta(carpeta))}
            </div>
          );
        })()}
        
        {/* Mostrar archivos cuando estemos dentro de una carpeta */}
        {carpetaActual && (
          <ListaArchivos 
            carpetaId={carpetaActual.id}
            onUpload={handleArchivoSubido}
          />
        )}
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
    </>
  );
};

export default PeriodoDetalle;