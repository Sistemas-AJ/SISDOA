import React, { useState, useEffect } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import BACKEND_URL from '../../service/backend';
import VisualizadorArchivos from '../VisualizadorArchivos/VisualizadorArchivos';

const ListaArchivos = ({ carpetaId, onUpload, modoVista = 'iconos-grandes' }) => {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showVisualizador, setShowVisualizador] = useState(false);
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
  }, [carpetaId]);

  const handleDownload = async (documento) => {
    try {
      const response = await fetch(`${BACKEND_URL}/documentos/download/${documento.id}`, {
        method: 'GET'
      });
      
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
        fetchDocumentos(); // Recargar lista
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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (tipoArchivo) => {
    if (!tipoArchivo) return '📄';
    
    // Imágenes
    if (tipoArchivo.startsWith('image/')) return '🖼️';
    
    // Videos
    if (tipoArchivo.startsWith('video/')) return '🎥';
    
    // Audio
    if (tipoArchivo.startsWith('audio/')) return '🎵';
    
    // Documentos específicos
    if (tipoArchivo.includes('pdf')) return '📋';
    
    // Microsoft Office
    if (tipoArchivo.includes('word') || tipoArchivo.includes('msword') || 
        tipoArchivo.includes('officedocument.wordprocessing')) return '📝';
    if (tipoArchivo.includes('excel') || tipoArchivo.includes('spreadsheet') || 
        tipoArchivo.includes('msexcel') || tipoArchivo.includes('officedocument.spreadsheet')) return '📊';
    if (tipoArchivo.includes('powerpoint') || tipoArchivo.includes('presentation') || 
        tipoArchivo.includes('mspowerpoint') || tipoArchivo.includes('officedocument.presentation')) return '📈';
    
    // Archivos comprimidos
    if (tipoArchivo.includes('zip') || tipoArchivo.includes('rar') || tipoArchivo.includes('tar') || 
        tipoArchivo.includes('gzip') || tipoArchivo.includes('7z') || tipoArchivo.includes('compressed')) return '🗜️';
    
    // Código fuente
    if (tipoArchivo.includes('javascript')) return '📜';
    if (tipoArchivo.includes('json')) return '🔧';
    if (tipoArchivo.includes('css')) return '🎨';
    if (tipoArchivo.includes('html') || tipoArchivo.includes('xml')) return '🌐';
    if (tipoArchivo.includes('python')) return '🐍';
    if (tipoArchivo.includes('java')) return '☕';
    
    // Texto plano
    if (tipoArchivo.startsWith('text/')) return '📃';
    
    // Ejecutables y aplicaciones
    if (tipoArchivo.includes('executable') || tipoArchivo.includes('msi') || 
        tipoArchivo.includes('exe') || tipoArchivo.includes('application/x-')) return '⚙️';
    
    // Fuentes
    if (tipoArchivo.includes('font') || tipoArchivo.includes('truetype') || 
        tipoArchivo.includes('opentype') || tipoArchivo.includes('woff')) return '🔤';
    
    // Base de datos
    if (tipoArchivo.includes('database') || tipoArchivo.includes('sqlite') || 
        tipoArchivo.includes('sql')) return '🗃️';
    
    // Por defecto
    return '📄';
  };

  // Renderizado en modo iconos grandes (XL)
  const renderIconosGrandes = () => {
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
        {documentos.map((documento) => (
          <div
            key={documento.id}
            style={{...cardStyle, cursor: 'pointer'}}
            onClick={() => handlePreview(documento)}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, hoverStyle);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e0e0e0';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ 
              fontSize: '80px', 
              marginBottom: '16px',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
              lineHeight: '1'
            }}>
              {getFileIcon(documento.tipo_archivo)}
            </div>
            
            <div style={{ 
              fontWeight: '600', 
              color: '#333', 
              fontSize: '16px',
              marginBottom: '8px',
              wordBreak: 'break-word',
              lineHeight: '1.3'
            }}>
              {documento.nombre_archivo}
            </div>
            
            <div style={{ 
              fontSize: '13px', 
              color: '#666',
              marginBottom: '12px'
            }}>
              {formatFileSize(documento.tamaño_bytes)}
            </div>
            
            <div style={{
              fontSize: '11px',
              color: '#999',
              fontStyle: 'italic',
              marginBottom: '12px'
            }}>
              {new Date(documento.fecha_creacion).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                onClick={(e) => { e.stopPropagation(); handleDownload(documento); }}
                style={{
                  padding: '6px 10px',
                  background: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '10px'
                }}
                title="Descargar"
              >
                ⬇️
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(documento); }}
                style={{
                  padding: '6px 10px',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '10px'
                }}
                title="Eliminar"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Renderizado en modo iconos medianos (L)
  const renderIconosMedianos = () => {
    const gridStyle = {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
      gap: '16px',
      padding: '16px 0'
    };

    const cardStyle = {
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e0e0e0',
      padding: '16px 12px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'center',
      position: 'relative'
    };

    const hoverStyle = {
      borderColor: '#2196f3',
      boxShadow: '0 4px 12px rgba(33, 150, 243, 0.15)',
      transform: 'translateY(-2px)'
    };

    return (
      <div style={gridStyle}>
        {documentos.map((documento) => (
          <div
            key={documento.id}
            style={cardStyle}
            onClick={() => handlePreview(documento)}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, hoverStyle);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e0e0e0';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ 
              fontSize: '56px', 
              marginBottom: '12px',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              lineHeight: '1'
            }}>
              {getFileIcon(documento.tipo_archivo)}
            </div>
            
            <div style={{ 
              fontWeight: '500', 
              color: '#333', 
              fontSize: '13px',
              marginBottom: '6px',
              wordBreak: 'break-word',
              lineHeight: '1.3',
              height: '32px',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              {documento.nombre_archivo}
            </div>
            
            <div style={{ 
              fontSize: '11px', 
              color: '#666',
              marginBottom: '8px'
            }}>
              {formatFileSize(documento.tamaño_bytes)}
            </div>

            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
              <button
                onClick={(e) => { e.stopPropagation(); handleDownload(documento); }}
                style={{
                  padding: '4px 6px',
                  background: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '9px'
                }}
                title="Descargar"
              >
                ⬇️
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(documento); }}
                style={{
                  padding: '4px 6px',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '9px'
                }}
                title="Eliminar"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Renderizado en modo iconos pequeños (M)
  const renderIconosPequenos = () => {
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
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, hoverStyle);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e0e0e0';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ 
              fontSize: '32px', 
              marginBottom: '8px',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
              lineHeight: '1'
            }}>
              {getFileIcon(documento.tipo_archivo)}
            </div>
            
            <div style={{ 
              fontWeight: '500', 
              color: '#333', 
              fontSize: '11px',
              wordBreak: 'break-word',
              lineHeight: '1.2',
              height: '22px',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              {documento.nombre_archivo}
            </div>

            <div style={{
              position: 'absolute',
              bottom: '4px',
              left: '4px',
              right: '4px',
              display: 'flex',
              gap: '2px',
              justifyContent: 'center'
            }}>
              <button
                onClick={(e) => { e.stopPropagation(); handleDownload(documento); }}
                style={{
                  padding: '2px 4px',
                  background: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  fontSize: '8px'
                }}
                title="Descargar"
              >
                ⬇️
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(documento); }}
                style={{
                  padding: '2px 4px',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  fontSize: '8px'
                }}
                title="Eliminar"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Renderizado en modo mosaicos
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
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, hoverStyle);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e0e0e0';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ 
              fontSize: '48px',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              flexShrink: 0
            }}>
              {getFileIcon(documento.tipo_archivo)}
            </div>
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ 
                fontWeight: '600', 
                color: '#333', 
                fontSize: '16px',
                marginBottom: '8px',
                wordBreak: 'break-word',
                lineHeight: '1.3'
              }}>
                {documento.nombre_archivo}
              </div>
              
              <div style={{ 
                fontSize: '12px', 
                color: '#666',
                marginBottom: '4px'
              }}>
                Tamaño: {formatFileSize(documento.tamaño_bytes)}
              </div>
              
              <div style={{ 
                fontSize: '11px', 
                color: '#999',
                fontStyle: 'italic'
              }}>
                {new Date(documento.fecha_creacion).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={(e) => { e.stopPropagation(); handleDownload(documento); }}
                style={{
                  padding: '6px 12px',
                  background: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
                title="Descargar archivo"
              >
                ⬇️ Descargar
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(documento); }}
                style={{
                  padding: '6px 12px',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
                title="Eliminar archivo"
              >
                🗑️ Eliminar
              </button>
            </div>

            <div style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              fontSize: '10px',
              color: '#999',
              backgroundColor: '#f5f5f5',
              padding: '2px 6px',
              borderRadius: '10px'
            }}>
              Archivo
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Renderizado en modo detalles
  const renderDetalles = () => {
    const tableStyle = {
      width: '100%',
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e0e0e0',
      overflow: 'hidden',
      marginTop: '16px'
    };

    const headerStyle = {
      backgroundColor: '#f5f5f5',
      padding: '12px 16px',
      fontWeight: '600',
      color: '#333',
      fontSize: '14px',
      borderBottom: '1px solid #e0e0e0'
    };

    const rowStyle = {
      padding: '12px 16px',
      borderBottom: '1px solid #f0f0f0',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      display: 'grid',
      gridTemplateColumns: '40px 1fr 120px 120px 100px',
      alignItems: 'center',
      gap: '16px'
    };

    const hoverRowStyle = {
      backgroundColor: '#f8f9fa'
    };

    return (
      <div style={tableStyle}>
        <div style={{
          ...headerStyle,
          display: 'grid',
          gridTemplateColumns: '40px 1fr 120px 120px 100px',
          alignItems: 'center',
          gap: '16px'
        }}>
          <span></span>
          <span>Nombre</span>
          <span>Tamaño</span>
          <span>Fecha</span>
          <span>Acciones</span>
        </div>
        
        {documentos.map((documento) => (
          <div
            key={documento.id}
            style={{...rowStyle, cursor: 'pointer'}}
            onClick={() => handlePreview(documento)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = hoverRowStyle.backgroundColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div style={{ 
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {getFileIcon(documento.tipo_archivo)}
            </div>
            
            <div style={{ 
              fontWeight: '500', 
              color: '#333',
              wordBreak: 'break-word'
            }}>
              {documento.nombre_archivo}
            </div>
            
            <div style={{ 
              fontSize: '13px', 
              color: '#666'
            }}>
              {formatFileSize(documento.tamaño_bytes)}
            </div>
            
            <div style={{ 
              fontSize: '13px', 
              color: '#666'
            }}>
              {new Date(documento.fecha_creacion).toLocaleDateString('es-ES')}
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={(e) => { e.stopPropagation(); handleDownload(documento); }}
                style={{
                  padding: '4px 8px',
                  background: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px'
                }}
                title="Descargar"
              >
                ⬇️
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(documento); }}
                style={{
                  padding: '4px 8px',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px'
                }}
                title="Eliminar"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Renderizado en modo contenido
  const renderContenido = () => {
    const containerStyle = {
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e0e0e0',
      padding: '20px',
      marginTop: '16px'
    };

    const itemStyle = {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
      padding: '16px',
      borderBottom: '1px solid #f0f0f0',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      borderRadius: '6px',
      margin: '0 -8px'
    };

    const hoverStyle = {
      backgroundColor: '#f8f9fa'
    };

    return (
      <div style={containerStyle}>
        <h3 style={{
          margin: '0 0 20px 0',
          fontSize: '18px',
          fontWeight: '600',
          color: '#333'
        }}>
          Archivos del Período
        </h3>
        
        {documentos.map((documento, index) => (
          <div
            key={documento.id}
            style={{
              ...itemStyle,
              borderBottom: index === documentos.length - 1 ? 'none' : itemStyle.borderBottom,
              cursor: 'pointer'
            }}
            onClick={() => handlePreview(documento)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div style={{ 
              fontSize: '48px',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              flexShrink: 0
            }}>
              {getFileIcon(documento.tipo_archivo)}
            </div>
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ 
                fontWeight: '600', 
                color: '#333', 
                fontSize: '16px',
                marginBottom: '8px',
                wordBreak: 'break-word'
              }}>
                {documento.nombre_archivo}
              </div>
              
              <div style={{ 
                fontSize: '14px', 
                color: '#666',
                marginBottom: '8px',
                lineHeight: '1.5'
              }}>
                <strong>Tamaño:</strong> {formatFileSize(documento.tamaño_bytes)}
                <br />
                <strong>Tipo:</strong> {documento.tipo_archivo.toUpperCase()}
                <br />
                <strong>Creado:</strong> {new Date(documento.fecha_creacion).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              
              {documento.descripcion && (
                <div style={{ 
                  fontSize: '13px', 
                  color: '#777',
                  fontStyle: 'italic',
                  marginTop: '8px',
                  padding: '8px 12px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  borderLeft: '3px solid #2196f3'
                }}>
                  {documento.descripcion}
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignSelf: 'flex-start' }}>
              <button
                onClick={(e) => { e.stopPropagation(); handleDownload(documento); }}
                style={{
                  padding: '8px 16px',
                  background: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Descargar archivo"
              >
                ⬇️ Descargar
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(documento); }}
                style={{
                  padding: '8px 16px',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Eliminar archivo"
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
        
        {documentos.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#666',
            fontStyle: 'italic'
          }}>
            No hay archivos en este período
          </div>
        )}
      </div>
    );
  };

  // Renderizado en modo lista (legacy)
  const renderLista = () => {
    const containerStyle = {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    };

    const headerStyle = {
      display: 'grid',
      gridTemplateColumns: '40px 1fr 100px 120px 140px',
      gap: '16px',
      padding: '12px 16px',
      backgroundColor: '#f8f9fa',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#666',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    };

    return (
      <div style={containerStyle}>
        {/* Cabecera */}
        <div style={headerStyle}>
          <div>Tipo</div>
          <div>Nombre</div>
          <div>Tamaño</div>
          <div>Fecha</div>
          <div style={{ textAlign: 'center' }}>Acciones</div>
        </div>
        
        {/* Filas de archivos */}
        {documentos.map((documento) => (
          <div
            key={documento.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '40px 1fr 100px 120px 140px',
              gap: '16px',
              padding: '12px 16px',
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              transition: 'all 0.2s',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => handlePreview(documento)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#2196f3';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(33, 150, 243, 0.1)';
              e.currentTarget.style.backgroundColor = '#f8f9ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e0e0e0';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            <div style={{ 
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {getFileIcon(documento.tipo_archivo)}
            </div>
            
            <div>
              <div style={{ 
                fontWeight: '500', 
                color: '#333', 
                fontSize: '14px',
                marginBottom: '2px',
                wordBreak: 'break-word'
              }}>
                {documento.nombre_archivo}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#666'
              }}>
                {documento.tipo_archivo || 'Archivo'}
              </div>
            </div>
            
            <div style={{ 
              fontSize: '12px', 
              color: '#666'
            }}>
              {formatFileSize(documento.tamaño_bytes)}
            </div>
            
            <div style={{ 
              fontSize: '12px', 
              color: '#666'
            }}>
              {new Date(documento.fecha_creacion).toLocaleDateString('es-ES')}
            </div>
            
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                onClick={() => handleDownload(documento)}
                style={{
                  padding: '6px 12px',
                  background: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
                title="Descargar archivo"
              >
                ⬇️ Descargar
              </button>
              <button
                onClick={() => handleDelete(documento)}
                style={{
                  padding: '6px 12px',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
                title="Eliminar archivo"
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px', 
        color: '#666',
        fontStyle: 'italic'
      }}>
        Cargando archivos...
      </div>
    );
  }

  if (documentos.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        color: '#666',
        fontStyle: 'italic',
        border: '2px dashed #ddd',
        borderRadius: '8px',
        margin: '20px 0'
      }}>
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
      <h4 style={{ 
        margin: '0 0 16px 0', 
        color: '#333',
        borderBottom: '2px solid #f0f0f0',
        paddingBottom: '8px'
      }}>
        Archivos ({documentos.length})
      </h4>
      
      {(() => {
        switch (modoVista) {
          case 'iconos-grandes':
            return renderIconosGrandes();
          case 'iconos-medianos':
            return renderIconosMedianos();
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

      {/* Visualizador de archivos */}
      <VisualizadorArchivos
        documento={selectedDocument}
        isOpen={showVisualizador}
        onClose={handleCloseVisualizador}
      />
    </div>
  );
};

export default ListaArchivos;