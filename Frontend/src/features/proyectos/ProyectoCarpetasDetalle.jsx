import React, { useState, useEffect } from "react";
import CrearCarpetaModal from "./CrearCarpetaModal";
import BACKEND_URL from "../../service/backend";
import { useNotification } from "../../contexts/NotificationContext";
import ContextMenuCarpeta from "../../components/ContextMenuCarpeta/ContextMenuCarpeta";
import EditarCarpetaModal from "../../components/EditarCarpetaModal/EditarCarpetaModal";
import ConfirmarEliminarCarpetaModal from "../../components/ConfirmarEliminarCarpetaModal/ConfirmarEliminarCarpetaModal";
import SubirArchivoModal from "../../components/SubirArchivoModal/SubirArchivoModal";
import ListaArchivos from "../../components/ListaArchivos/ListaArchivos";

const ProyectoCarpetasDetalle = ({ proyecto }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [carpetas, setCarpetas] = useState([]);
  const [carpetaPadre, setCarpetaPadre] = useState(null);
  const [carpetaActual, setCarpetaActual] = useState(null);
  const [rutaCarpetas, setRutaCarpetas] = useState([]);
  const { showSuccess, showError } = useNotification();
  const [contextMenuCarpeta, setContextMenuCarpeta] = useState({ visible: false, x: 0, y: 0, carpeta: null });
  const [editarCarpetaModal, setEditarCarpetaModal] = useState(false);
  const [carpetaAEditar, setCarpetaAEditar] = useState(null);
  const [eliminarCarpetaModal, setEliminarCarpetaModal] = useState(false);
  const [carpetaAEliminar, setCarpetaAEliminar] = useState(null);
  const [subirArchivoModal, setSubirArchivoModal] = useState(false);
  const [carpetaParaArchivo, setCarpetaParaArchivo] = useState(null);

  const fetchCarpetas = async () => {
    if (!proyecto) return;
    try {
      const response = await fetch(`${BACKEND_URL}/carpetas-proyecto/carpetas/`);
      if (response.ok) {
        const todasLasCarpetas = await response.json();
        const carpetasDelProyecto = todasLasCarpetas.filter(carpeta => carpeta.id_modulo === proyecto.id);
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
      if (contextMenuCarpeta.visible) cerrarContextMenuCarpeta();
    };
    if (contextMenuCarpeta.visible) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
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
  const confirmarEliminarCarpeta = async (carpetaId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/carpetas-proyecto/carpetas/${carpetaId}`, { method: 'DELETE' });
      if (response.ok) {
        showSuccess('Carpeta eliminada correctamente');
        fetchCarpetas();
        setEliminarCarpetaModal(false);
        setCarpetaAEliminar(null);
        if (carpetaActual && carpetaActual.id === carpetaId) volverAtras();
      } else {
        throw new Error('Error al eliminar la carpeta');
      }
    } catch (error) {
      showError('Error al eliminar la carpeta: ' + error.message);
    }
  };
  const actualizarNombreCarpeta = async (carpetaId, nuevoNombre) => {
    try {
      const response = await fetch(`${BACKEND_URL}/carpetas-proyecto/carpetas/${carpetaId}`, {
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
  };
  const renderBreadcrumb = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', padding: '8px 12px', background: '#f8f9fa', borderRadius: '6px', fontSize: '14px' }}>
      <span onClick={() => irACarpeta(null, -1)} style={{ cursor: 'pointer', color: '#2196f3', textDecoration: 'none' }} onMouseEnter={e => e.target.style.textDecoration = 'underline'} onMouseLeave={e => e.target.style.textDecoration = 'none'}>🏠 Raíz</span>
      {rutaCarpetas.map((carpeta, index) => (
        <React.Fragment key={carpeta.id}>
          <span style={{ color: '#666' }}>/</span>
          <span onClick={() => irACarpeta(carpeta, index)} style={{ cursor: 'pointer', color: index === rutaCarpetas.length - 1 ? '#333' : '#2196f3', fontWeight: index === rutaCarpetas.length - 1 ? 'bold' : 'normal' }} onMouseEnter={e => { if (index !== rutaCarpetas.length - 1) e.target.style.textDecoration = 'underline'; }} onMouseLeave={e => e.target.style.textDecoration = 'none'}>{carpeta.nombre}</span>
        </React.Fragment>
      ))}
    </div>
  );
  const renderCarpeta = (carpeta) => (
    <div key={carpeta.id} style={{ padding: '16px', background: 'white', borderRadius: '6px', border: '1px solid #ddd', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }} onClick={() => entrarEnCarpeta(carpeta)} onContextMenu={e => handleContextMenuCarpeta(e, carpeta)} onMouseEnter={e => { e.currentTarget.style.borderColor = '#2196f3'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(33, 150, 243, 0.2)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.boxShadow = 'none'; }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '32px', height: '32px', background: '#1976d2', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px' }}>
          <img src={require("../../assets/carpeta-compartida.png")} alt="carpeta" style={{ width: 24, height: 24 }} />
        </div>
        <div>
          <div style={{ fontWeight: '500', color: '#333', fontSize: '14px' }}>{carpeta.nombre}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>Creada: {new Date(carpeta.fecha_creacion).toLocaleDateString('es-ES')}</div>
        </div>
      </div>
      <div style={{ fontSize: '12px', color: '#888' }}>Click derecho para opciones →</div>
    </div>
  );
  if (!proyecto) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#666', fontStyle: 'italic' }}>Selecciona un proyecto para ver detalles</div>;
  }
  const autor = proyecto.metadatos?.find(m => m.clave === "autor_asignado")?.valor || "Sin autor";
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, marginTop: 32 }}>
        <div style={{ marginLeft: 24 }}>
          <h2 style={{ margin: 0, color: '#333' }}>{proyecto.nombre}</h2>
          <p style={{ margin: '8px 0 0 0', color: '#555' }}><b>Autor:</b> {autor}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!carpetaActual && (
            <button onClick={() => { setCarpetaPadre(null); setModalOpen(true); }} style={{ backgroundColor: '#2196f3', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'background-color 0.2s' }} onMouseEnter={e => e.target.style.backgroundColor = '#1976d2'} onMouseLeave={e => e.target.style.backgroundColor = '#2196f3'}>Crear Carpeta Principal</button>
          )}
          {carpetaActual && (
            <button onClick={volverAtras} style={{ backgroundColor: '#757575', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', marginRight: '12px' }}>← Volver Atrás</button>
          )}
          <input type="text" placeholder="Buscar..." style={{ padding: '8px 12px', width: '180px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
        </div>
      </div>
      <div style={{ margin: '20px 24px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>Carpetas del Proyecto</h3>
        {(carpetaActual || rutaCarpetas.length > 0) && renderBreadcrumb()}
        {carpetaActual && (
          <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={() => { setCarpetaPadre(carpetaActual); setModalOpen(true); }} style={{ backgroundColor: '#4caf50', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>+ Crear Subcarpeta en "{carpetaActual.nombre}"</button>
            <button onClick={() => abrirModalSubirArchivo(carpetaActual)} style={{ backgroundColor: '#ff9800', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>📄 Subir Archivo</button>
          </div>
        )}
        {(() => {
          const carpetasAMostrar = obtenerCarpetasAMostrar();
          if (carpetasAMostrar.length === 0) {
            return <div style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', padding: '20px' }}>{carpetaActual ? `No hay subcarpetas en "${carpetaActual.nombre}". Haz clic en "Crear Subcarpeta" para agregar una.` : "No hay carpetas en este proyecto aún. Haz clic en 'Crear Carpeta Principal' para comenzar."}</div>;
          }
          return <div>{carpetasAMostrar.map(carpeta => renderCarpeta(carpeta))}</div>;
        })()}
        {(carpetaActual || rutaCarpetas.length === 0) && (
          <ListaArchivos carpetaId={carpetaActual ? carpetaActual.id : (carpetas.find(c => c.id_padre === c.id)?.id || null)} onUpload={handleArchivoSubido} />
        )}
      </div>
      <CrearCarpetaModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setCarpetaPadre(null); }} onCreated={handleAgregarCarpeta} id_modulo={proyecto.id} id_padre={carpetaPadre ? carpetaPadre.id : null} />
      <ContextMenuCarpeta x={contextMenuCarpeta.x} y={contextMenuCarpeta.y} visible={contextMenuCarpeta.visible} carpeta={contextMenuCarpeta.carpeta} onClose={cerrarContextMenuCarpeta} onEdit={editarCarpeta} onDelete={eliminarCarpeta} />
      <EditarCarpetaModal isOpen={editarCarpetaModal} carpeta={carpetaAEditar} onClose={() => { setEditarCarpetaModal(false); setCarpetaAEditar(null); }} onUpdate={actualizarNombreCarpeta} />
      <ConfirmarEliminarCarpetaModal isOpen={eliminarCarpetaModal} carpeta={carpetaAEliminar} onClose={() => { setEliminarCarpetaModal(false); setCarpetaAEliminar(null); }} onConfirm={confirmarEliminarCarpeta} />
      <SubirArchivoModal isOpen={subirArchivoModal} carpetaId={carpetaParaArchivo?.id} onClose={() => { setSubirArchivoModal(false); setCarpetaParaArchivo(null); }} onUploaded={handleArchivoSubido} />
    </>);
};

export default ProyectoCarpetasDetalle;
