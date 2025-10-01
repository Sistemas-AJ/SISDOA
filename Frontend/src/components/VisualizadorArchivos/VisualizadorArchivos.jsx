import React, { useState, useEffect } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import BACKEND_URL from '../../service/backend';
import './VisualizadorArchivos.css';

const VisualizadorArchivos = ({ documento, isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);
  const [canPreview, setCanPreview] = useState(false);
  const { showError } = useNotification();

  useEffect(() => {
    if (isOpen && documento) {
      loadDocumentData();
    }
  }, [isOpen, documento]);

  const loadDocumentData = async () => {
    setLoading(true);
    try {
      // Generar metadatos del archivo
      const fileMetadata = generateMetadata(documento);
      setMetadata(fileMetadata);

      // Verificar si se puede previsualizar
      const preview = checkPreviewCapability(documento.tipo_archivo);
      setCanPreview(preview.canPreview);
      
      if (preview.canPreview) {
        const url = `${BACKEND_URL}/documentos/download/${documento.id}`;
        setPreviewUrl(url);
      }
    } catch (error) {
      showError('Error al cargar datos del archivo');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateMetadata = (doc) => {
    return {
      nombre: doc.nombre_archivo,
      extension: doc.nombre_archivo.split('.').pop()?.toUpperCase() || 'N/A',
      tipoMime: doc.tipo_archivo || 'application/octet-stream',
      tamaño: formatFileSize(doc.tamaño_bytes),
      tamañoBytes: doc.tamaño_bytes,
      fechaCreacion: new Date(doc.fecha_creacion),
      fechaModificacion: doc.fecha_modificacion ? new Date(doc.fecha_modificacion) : null,
      id: doc.id,
      carpetaId: doc.id_carpeta,
      categoria: getCategoryFromMime(doc.tipo_archivo),
      icono: getFileIcon(doc.tipo_archivo)
    };
  };

  const checkPreviewCapability = (mimeType) => {
    if (!mimeType) return { canPreview: false, reason: 'Tipo de archivo desconocido' };
    
    // Tipos que se pueden previsualizar directamente
    const previewableTypes = [
      'image/',           // Todas las imágenes
      'text/',           // Todos los archivos de texto
      'application/pdf', // PDFs
      'application/json', // JSON
      'application/xml',  // XML
      'application/javascript', // JavaScript
      'application/x-javascript', // JavaScript alternativo
      'text/html',       // HTML
      'text/css',        // CSS
      'text/javascript', // JavaScript como texto
      'text/xml',        // XML como texto
      'text/csv',        // CSV
      'text/markdown',   // Markdown
      'application/x-httpd-php', // PHP
      'application/x-python-code', // Python
      'text/x-python',   // Python como texto
      'text/x-java-source', // Java
      'text/x-c',        // C
      'text/x-c++',      // C++
      'application/x-sh', // Shell scripts
      'text/x-shellscript' // Shell scripts como texto
    ];
    
    const canPreview = previewableTypes.some(type => mimeType.startsWith(type) || mimeType.includes(type));
    return {
      canPreview,
      reason: canPreview ? null : 'Tipo de archivo no compatible para previsualización directa'
    };
  };

  const getCategoryFromMime = (mimeType) => {
    if (!mimeType) return 'Documento';
    
    // Imágenes
    if (mimeType.startsWith('image/')) return 'Imagen';
    
    // Videos
    if (mimeType.startsWith('video/')) return 'Video';
    
    // Audio
    if (mimeType.startsWith('audio/')) return 'Audio';
    
    // Documentos PDF
    if (mimeType.includes('pdf')) return 'PDF';
    
    // Microsoft Office
    if (mimeType.includes('word') || mimeType.includes('document') || 
        mimeType.includes('msword') || mimeType.includes('officedocument.wordprocessing')) return 'Documento Word';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet') || 
        mimeType.includes('msexcel') || mimeType.includes('officedocument.spreadsheet')) return 'Hoja de Cálculo';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation') || 
        mimeType.includes('mspowerpoint') || mimeType.includes('officedocument.presentation')) return 'Presentación';
    
    // Archivos comprimidos
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('compressed') ||
        mimeType.includes('tar') || mimeType.includes('gzip') || mimeType.includes('7z')) return 'Archivo Comprimido';
    
    // Documentos de texto
    if (mimeType.startsWith('text/')) return 'Documento de Texto';
    
    // Código fuente
    if (mimeType.includes('javascript') || mimeType.includes('json') || 
        mimeType.includes('css') || mimeType.includes('html') || 
        mimeType.includes('xml') || mimeType.includes('python') ||
        mimeType.includes('java') || mimeType.includes('cpp')) return 'Código Fuente';
    
    // Ejecutables
    if (mimeType.includes('executable') || mimeType.includes('msi') || 
        mimeType.includes('application/x-') || mimeType.includes('exe')) return 'Ejecutable';
    
    // Por defecto
    return 'Documento';
  };

  const getFileIcon = (mimeType) => {
    if (!mimeType) return '📄';
    
    // Imágenes
    if (mimeType.startsWith('image/')) return '🖼️';
    
    // Videos
    if (mimeType.startsWith('video/')) return '🎥';
    
    // Audio
    if (mimeType.startsWith('audio/')) return '🎵';
    
    // Documentos específicos
    if (mimeType.includes('pdf')) return '📋';
    
    // Microsoft Office
    if (mimeType.includes('word') || mimeType.includes('msword') || 
        mimeType.includes('officedocument.wordprocessing')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet') || 
        mimeType.includes('msexcel') || mimeType.includes('officedocument.spreadsheet')) return '📊';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation') || 
        mimeType.includes('mspowerpoint') || mimeType.includes('officedocument.presentation')) return '📈';
    
    // Archivos comprimidos
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar') || 
        mimeType.includes('gzip') || mimeType.includes('7z') || mimeType.includes('compressed')) return '🗜️';
    
    // Código fuente
    if (mimeType.includes('javascript')) return '📜';
    if (mimeType.includes('json')) return '🔧';
    if (mimeType.includes('css')) return '🎨';
    if (mimeType.includes('html') || mimeType.includes('xml')) return '🌐';
    if (mimeType.includes('python')) return '🐍';
    if (mimeType.includes('java')) return '☕';
    
    // Texto plano
    if (mimeType.startsWith('text/')) return '📃';
    
    // Ejecutables y aplicaciones
    if (mimeType.includes('executable') || mimeType.includes('msi') || 
        mimeType.includes('exe') || mimeType.includes('application/x-')) return '⚙️';
    
    // Fuentes
    if (mimeType.includes('font') || mimeType.includes('truetype') || 
        mimeType.includes('opentype') || mimeType.includes('woff')) return '🔤';
    
    // Base de datos
    if (mimeType.includes('database') || mimeType.includes('sqlite') || 
        mimeType.includes('sql')) return '🗃️';
    
    // Por defecto
    return '📄';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = async () => {
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
      } else {
        throw new Error('Error al descargar archivo');
      }
    } catch (error) {
      showError('Error al descargar archivo: ' + error.message);
    }
  };

  const renderPreview = () => {
    if (!canPreview) {
      return (
        <div className="visualizador__no-preview">
          <div className="visualizador__icon-large">
            {metadata.icono}
          </div>
          <p>Vista previa no disponible para este tipo de archivo</p>
        </div>
      );
    }

    if (metadata.tipoMime?.startsWith('image/')) {
      return (
        <div className="visualizador__preview-image">
          <img 
            src={previewUrl} 
            alt={metadata.nombre}
            onError={() => setCanPreview(false)}
          />
        </div>
      );
    }

    if (metadata.tipoMime?.startsWith('text/') || metadata.tipoMime?.includes('json')) {
      return (
        <div className="visualizador__preview-text">
          <iframe 
            src={previewUrl}
            title={metadata.nombre}
            onError={() => setCanPreview(false)}
          />
        </div>
      );
    }

    if (metadata.tipoMime?.includes('pdf')) {
      return (
        <div className="visualizador__preview-pdf">
          <embed 
            src={previewUrl}
            type="application/pdf"
            width="100%"
            height="100%"
          />
        </div>
      );
    }

    return (
      <div className="visualizador__no-preview">
        <div className="visualizador__icon-large">
          {metadata.icono}
        </div>
        <p>Vista previa no compatible</p>
      </div>
    );
  };

  if (!isOpen || !documento) return null;

  return (
    <div className="visualizador__overlay" onClick={onClose}>
      <div className="visualizador__modal" onClick={(e) => e.stopPropagation()}>
        <div className="visualizador__header">
          <h2 className="visualizador__title">
            {metadata.icono} {metadata.nombre}
          </h2>
          <button 
            className="visualizador__close" 
            onClick={onClose}
            title="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="visualizador__content">
          {/* Panel de previsualización */}
          <div className="visualizador__preview-panel">
            {loading ? (
              <div className="visualizador__loading">
                <div className="visualizador__spinner"></div>
                <p>Cargando vista previa...</p>
              </div>
            ) : (
              renderPreview()
            )}
          </div>

          {/* Panel de metadatos estilo Mendeley */}
          <div className="visualizador__metadata-panel">
            <div className="visualizador__metadata-header">
              <h3>Información del Archivo</h3>
            </div>

            <div className="visualizador__metadata-content">
              {/* Información básica */}
              <div className="visualizador__metadata-section">
                <h4>Archivo</h4>
                <div className="visualizador__metadata-grid">
                  <div className="visualizador__metadata-item">
                    <label>Nombre:</label>
                    <span title={metadata.nombre}>{metadata.nombre}</span>
                  </div>
                  <div className="visualizador__metadata-item">
                    <label>Extensión:</label>
                    <span className="visualizador__extension">{metadata.extension}</span>
                  </div>
                  <div className="visualizador__metadata-item">
                    <label>Categoría:</label>
                    <span className="visualizador__category">{metadata.categoria}</span>
                  </div>
                  <div className="visualizador__metadata-item">
                    <label>Tipo MIME:</label>
                    <span className="visualizador__mime">{metadata.tipoMime}</span>
                  </div>
                </div>
              </div>

              {/* Información de tamaño */}
              <div className="visualizador__metadata-section">
                <h4>Propiedades</h4>
                <div className="visualizador__metadata-grid">
                  <div className="visualizador__metadata-item">
                    <label>Tamaño:</label>
                    <span>{metadata.tamaño}</span>
                  </div>
                  <div className="visualizador__metadata-item">
                    <label>Bytes:</label>
                    <span>{metadata.tamañoBytes?.toLocaleString()} bytes</span>
                  </div>
                </div>
              </div>

              {/* Información de fechas */}
              <div className="visualizador__metadata-section">
                <h4>Fechas</h4>
                <div className="visualizador__metadata-grid">
                  <div className="visualizador__metadata-item">
                    <label>Creado:</label>
                    <span>{metadata.fechaCreacion?.toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                  {metadata.fechaModificacion && (
                    <div className="visualizador__metadata-item">
                      <label>Modificado:</label>
                      <span>{metadata.fechaModificacion?.toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Información del sistema */}
              <div className="visualizador__metadata-section">
                <h4>Sistema</h4>
                <div className="visualizador__metadata-grid">
                  <div className="visualizador__metadata-item">
                    <label>ID Documento:</label>
                    <span>#{metadata.id}</span>
                  </div>
                  <div className="visualizador__metadata-item">
                    <label>ID Carpeta:</label>
                    <span>#{metadata.carpetaId}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="visualizador__actions">
              <button 
                className="visualizador__btn visualizador__btn--download"
                onClick={handleDownload}
                title="Descargar archivo"
              >
                ⬇️ Descargar
              </button>
              <button 
                className="visualizador__btn visualizador__btn--secondary"
                onClick={onClose}
                title="Cerrar visualizador"
              >
                ✕ Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizadorArchivos;