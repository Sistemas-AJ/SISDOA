import React, { useState, useEffect } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import BACKEND_URL from '../../service/backend';
import VisualizadorArchivos from '../VisualizadorArchivos/VisualizadorArchivos';
import { getEtiquetaFromMetadatos } from '../../service/metadatos';

const ListaArchivos = ({ carpetaId, onUpload, modoVista = 'iconos-grandes', refresh, esDeProyecto = false }) => {
  const [documentos, setDocumentos] = useState([]);
  const [etiquetasArchivos, setEtiquetasArchivos] = useState({}); // { [id]: etiqueta }
  const [loading, setLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showVisualizador, setShowVisualizador] = useState(false);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, documento: null });
  const { showSuccess, showError } = useNotification();

  const fetchDocumentos = async () => {
    if (!carpetaId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/documentos/carpeta/${carpetaId}`);
      if (response.ok) {
        const docs = await response.json();
        setDocumentos(docs);
      } else {
        setDocumentos([]);
      }
    } catch (error) {
      console.error('Error al cargar documentos:', error);
      setDocumentos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentos();
  }, [carpetaId, refresh]);

  useEffect(() => {
    if (documentos.length > 0) {
      Promise.all(
        documentos.map(async (doc) => {
          const etiqueta = await getEtiquetaFromMetadatos(doc.id);
          return { id: doc.id, etiqueta };
        })
      ).then(results => {
        const etiquetasObj = results.reduce((acc, { id, etiqueta }) => {
          acc[id] = etiqueta;
          return acc;
        }, {});
        setEtiquetasArchivos(etiquetasObj);
      });
    } else {
      setEtiquetasArchivos({});
    }
  }, [documentos]);

  const handleDownload = async (documento) => {
    try {
      const response = await fetch(`${BACKEND_URL}/documentos/download/${documento.id}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = documento.nombre_archivo;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showSuccess(`Descargando "${documento.nombre_archivo}"`);
      } else {
        throw new Error('Error al descargar archivo');
      }
    } catch (error) {
      console.error('Error:', error);
      showError('Error al descargar archivo: ' + error.message);
    }
  };

  const handleDelete = async (documento) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${documento.nombre_archivo}"?`)) {
      return;
    }
    try {
      const response = await fetch(`${BACKEND_URL}/documentos/${documento.id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        showSuccess(`Archivo "${documento.nombre_archivo}" eliminado correctamente`);
        fetchDocumentos();
      } else {
        throw new Error('Error al eliminar archivo');
      }
    } catch (error) {
      console.error('Error:', error);
      showError('Error al eliminar archivo: ' + error.message);
    }
  };

  const handlePreview = (documento) => {
    setSelectedDocument(documento);
    setShowVisualizador(true);
  };

  const handleCloseVisualizador = () => {
    setShowVisualizador(false);
    setSelectedDocument(null);
  };

  const handleContextMenu = (e, documento) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      documento
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, documento: null });
  };

  useEffect(() => {
    const handleClickOutside = () => handleCloseContextMenu();
    if (contextMenu.visible) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu.visible]);
  
  const handleContextMenuAction = (action) => {
    if (contextMenu.documento) {
      switch (action) {
        case 'download':
          handleDownload(contextMenu.documento);
          break;
        case 'delete':
          handleDelete(contextMenu.documento);
          break;
        default:
          break;
      }
    }
    handleCloseContextMenu();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (tipoArchivo) => {
    if (!tipoArchivo) return '📄';
    if (tipoArchivo.startsWith('image/')) return '🖼️';
    if (tipoArchivo.startsWith('video/')) return '🎥';
    if (tipoArchivo.startsWith('audio/')) return '🎵';
    if (tipoArchivo.includes('pdf')) return '📋';
    if (tipoArchivo.includes('word')) return '📝';
    if (tipoArchivo.includes('excel')) return '📊';
    if (tipoArchivo.includes('powerpoint')) return '📈';
    if (tipoArchivo.includes('zip') || tipoArchivo.includes('rar')) return '🗜️';
    if (tipoArchivo.includes('javascript') || tipoArchivo.includes('python') || tipoArchivo.includes('java')) return '📜';
    if (tipoArchivo.startsWith('text/')) return '📃';
    return '📄';
  };

  // Renderizado en modo iconos grandes (XL)
  const renderIconosGrandes = () => {
    // ... (El resto de la función es idéntica, solo se elimina el return duplicado)
    const gridStyle = {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '24px',
      padding: '20px 0'
    };

    const cardStyle = {
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #e0e0e0',
      padding: '24px 20px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      textAlign: 'center',
      position: 'relative'
    };

    const hoverStyle = {
      borderColor: '#2196f3',
      boxShadow: '0 8px 24px rgba(33, 150, 243, 0.15)',
      transform: 'translateY(-4px)'
    };

    return (
      <div style={gridStyle}>
        {documentos.map((documento) => {
          const etiqueta = etiquetasArchivos[documento.id] || '';
          const comentario = documento.comentario || '';
          const tooltip = [
            etiqueta ? `Etiqueta: ${etiqueta}` : null,
            comentario ? `Comentario: ${comentario}` : null
          ].filter(Boolean).join('\n');

          return (
            <div
              key={documento.id}
              style={{ ...cardStyle }}
              onClick={() => handlePreview(documento)}
              onContextMenu={(e) => handleContextMenu(e, documento)}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, {
                borderColor: '#e0e0e0',
                boxShadow: 'none',
                transform: 'translateY(0)'
              })}
              title={tooltip || undefined}
            >
              <div style={{ fontSize: '80px', marginBottom: '16px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))', lineHeight: '1' }}>
                {getFileIcon(documento.tipo_archivo)}
              </div>
              <div style={{ fontWeight: '600', color: '#333', fontSize: '16px', marginBottom: etiqueta ? '2px' : '8px', wordBreak: 'break-word', lineHeight: '1.3' }}>
                {documento.nombre_archivo}
              </div>
              {etiqueta && (
                <div style={{ background: 'linear-gradient(90deg,#e3f2fd,#bbdefb)', color: '#1976d2', borderRadius: '12px', padding: '2px 12px', fontSize: '13px', fontWeight: 500, marginBottom: '8px', display: 'inline-block', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {etiqueta}
                </div>
              )}
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
                {formatFileSize(documento.tamaño_bytes)}
              </div>
              <div style={{ fontSize: '11px', color: '#999', fontStyle: 'italic' }}>
                {new Date(documento.fecha_creacion).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            </div>
          );
        })}
      </div>
    );
    // ¡EL RETURN DUPLICADO HA SIDO ELIMINADO DE AQUÍ!
  };
  
  // ✅ FUNCIÓN AÑADIDA PARA SOLUCIONAR EL ERROR
  const renderIconosMedianos = () => {
    // TODO: Implementa el diseño para los iconos medianos.
    // Por ahora, reutilizamos la vista de iconos pequeños para que no falle.
    return renderIconosPequenos(); 
  };

  // Renderizado en modo iconos pequeños (M)
  const renderIconosPequenos = () => {
    // ... (código sin cambios)
    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gap: '12px',
        padding: '12px 0'
    };
    const cardStyle = {
        backgroundColor: 'white',
        borderRadius: '6px',
        border: '1px solid #e0e0e0',
        padding: '12px 8px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textAlign: 'center',
        position: 'relative'
    };
    const hoverStyle = {
        borderColor: '#2196f3',
        boxShadow: '0 2px 8px rgba(33, 150, 243, 0.15)',
        transform: 'translateY(-1px)'
    };
    return (
      <div style={gridStyle}>
        {documentos.map((documento) => (
          <div
            key={documento.id}
            style={{...cardStyle, cursor: 'pointer'}}
            onClick={() => handlePreview(documento)}
            onContextMenu={(e) => handleContextMenu(e, documento)}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, {
              borderColor: '#e0e0e0',
              boxShadow: 'none',
              transform: 'translateY(0)'
            })}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))', lineHeight: '1' }}>
              {getFileIcon(documento.tipo_archivo)}
            </div>
            <div style={{ fontWeight: '500', color: '#333', fontSize: '11px', wordBreak: 'break-word', lineHeight: '1.2', textAlign: 'center', padding: '0 4px' }}>
              {documento.nombre_archivo}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ... (El resto de tus funciones de renderizado: renderMosaicos, renderDetalles, etc., van aquí sin cambios)
  const renderMosaicos = () => {
      const gridStyle = {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          padding: '16px 0'
      };
      const tileStyle = {
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          padding: '16px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
      };
      const hoverStyle = {
          borderColor: '#2196f3',
          boxShadow: '0 4px 12px rgba(33, 150, 243, 0.15)',
          transform: 'translateY(-1px)'
      };
      return (
          <div style={gridStyle}>
              {documentos.map((documento) => (
                  <div
                      key={documento.id}
                      style={{...tileStyle, cursor: 'pointer'}}
                      onClick={() => handlePreview(documento)}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, {
                          borderColor: '#e0e0e0',
                          boxShadow: 'none',
                          transform: 'translateY(0)'
                      })}
                  >
                      <div style={{ fontSize: '48px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))', flexShrink: 0 }}>
                          {getFileIcon(documento.tipo_archivo)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: '600', color: '#333', fontSize: '16px', marginBottom: '8px', wordBreak: 'break-word', lineHeight: '1.3' }}>
                              {documento.nombre_archivo}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                              Tamaño: {formatFileSize(documento.tamaño_bytes)}
                          </div>
                          <div style={{ fontSize: '11px', color: '#999', fontStyle: 'italic' }}>
                              {new Date(documento.fecha_creacion).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      );
  };

  const renderDetalles = () => {
    // ... tu código ...
  };

  const renderContenido = () => {
    // ... tu código ...
  };
  
  const renderLista = () => {
    // ... tu código ...
  };
  
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Cargando archivos...</div>;
  }

  if (documentos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666', border: '2px dashed #ddd', borderRadius: '8px', margin: '20px 0' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
        <p>No hay archivos en esta carpeta</p>
        <p style={{ fontSize: '14px', color: '#999' }}>
          Haz clic en "Subir Archivo" para agregar documentos
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <h4 style={{ margin: '0 0 16px 0', color: '#333', borderBottom: '2px solid #f0f0f0', paddingBottom: '8px' }}>
        Archivos ({documentos.length})
      </h4>
      
      {(() => {
        switch (modoVista) {
          case 'iconos-grandes':
            return renderIconosGrandes();
          case 'iconos-medianos':
            return renderIconosMedianos(); // Ahora esta función existe
          case 'iconos-pequenos':
            return renderIconosPequenos();
          case 'detalles':
            return renderDetalles();
          case 'mosaicos':
            return renderMosaicos();
          case 'contenido':
            return renderContenido();
          case 'lista-carpetas':
          case 'lista':
          default:
            return renderLista();
        }
      })()}

      <VisualizadorArchivos
        documento={selectedDocument}
        isOpen={showVisualizador}
        onClose={handleCloseVisualizador}
        esDeProyecto={esDeProyecto}
      />

      {contextMenu.visible && (
        <div style={{ position: 'fixed', top: contextMenu.y, left: contextMenu.x, backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '6px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', zIndex: 10000, minWidth: '150px', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f0f0f0' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            onClick={() => handleContextMenuAction('download')}
          >
            ⬇️ Descargar
          </div>
          <div style={{ padding: '12px 16px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: '#dc3545' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            onClick={() => handleContextMenuAction('delete')}
          >
            🗑️ Eliminar
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaArchivos;