import React, { useState, useEffect } from 'react';
import ArchivoDetallePlus from '../../features/proyectos/plus/ArchivoDetallePlus';
import { useNotification } from '../../contexts/NotificationContext';
import BACKEND_URL from '../../service/backend';
import './VisualizadorArchivos.css';

const VisualizadorArchivos = ({ documento, isOpen, onClose, esDeProyecto = false, etiquetas = [], comentarios = [], versiones = [], permisos = {}, onEtiquetasChange, onNuevoComentario, onRestaurarVersion, onPermisosChange }) => {
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);
  const [canPreview, setCanPreview] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const { showError } = useNotification();

  useEffect(() => {
    if (isOpen && documento) {
      loadDocumentData();
    }
  }, [isOpen, documento]);

  // Timeout para detectar cuando la vista previa no carga
  useEffect(() => {
    if (showPreview && !previewError) {
      const timeout = setTimeout(() => {
        // Si después de 10 segundos no hay respuesta del iframe, mostrar error
        const iframe = document.querySelector('iframe[title*="Vista previa"]');
        if (iframe) {
          try {
            // Intentar acceder al contenido del iframe
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (!iframeDoc || iframeDoc.body?.children.length === 0) {
              setPreviewError(true);
            }
          } catch (e) {
            // Si no podemos acceder al iframe, probablemente cargó correctamente
            console.log('Vista previa cargada (contenido externo)');
          }
        }
      }, 10000); // 10 segundos

      return () => clearTimeout(timeout);
    }
  }, [showPreview, previewError]);

  const loadDocumentData = async () => {
    setLoading(true);
    setShowPreview(false); // Resetear vista previa
    setPreviewError(false); // Resetear error de vista previa
    
    try {
      // Generar metadatos del archivo
      const fileMetadata = generateMetadata(documento);
      setMetadata(fileMetadata);

      // Verificar si se puede previsualizar
      const preview = checkPreviewCapability(documento.tipo_archivo, documento.nombre_archivo);
      setCanPreview(preview.canPreview);
      
      // Generar URL para previsualización (no fuerza descarga)
      const url = `${BACKEND_URL}/documentos/preview/${documento.id}`;
      setPreviewUrl(url);
    } catch (error) {
      showError('Error al cargar datos del archivo');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryFromFileName = (fileName, mimeType) => {
    const extension = fileName?.split('.').pop()?.toLowerCase() || '';
    
    // Debug: log para verificar extensión y archivo
    console.log('Categorizando archivo:', fileName, 'Extensión:', extension, 'MIME:', mimeType);
    
    // Priorizar extensión para archivos Office
    if (extension === 'docx' || extension === 'doc') {
      console.log('Detectado como Word');
      return 'Documento Word';
    }
    if (extension === 'xlsx' || extension === 'xls') {
      console.log('Detectado como Excel');
      return 'Hoja de Cálculo Excel';
    }
    if (extension === 'pptx' || extension === 'ppt') return 'Presentación PowerPoint';
    
    // Otras extensiones comunes
    if (extension === 'pdf') return 'PDF';
    if (extension.match(/^(jpg|jpeg|png|gif|bmp|svg|webp|ico|tiff)$/)) return 'Imagen';
    if (extension.match(/^(mp4|avi|mov|wmv|flv|webm|mkv|m4v)$/)) return 'Video';
    if (extension.match(/^(mp3|wav|flac|aac|ogg|wma|m4a)$/)) return 'Audio';
    if (extension.match(/^(txt|rtf|md|markdown)$/)) return 'Documento de Texto';
    if (extension.match(/^(zip|rar|7z|tar|gz|bz2|xz)$/)) return 'Archivo Comprimido';
    if (extension.match(/^(js|html|css|json|xml|py|java|cpp|c|cs|php|rb|go|rs)$/)) return 'Código Fuente';
    
    // Si no se puede determinar por extensión, usar MIME type como respaldo
    return getCategoryFromMime(mimeType);
  };

  const getIconFromFileName = (fileName, mimeType) => {
    const extension = fileName?.split('.').pop()?.toLowerCase() || '';
    
    // Debug: log para verificar extensión y archivo  
    console.log('Icono para archivo:', fileName, 'Extensión:', extension);
    
    // Priorizar extensión para archivos Office
    if (extension === 'docx' || extension === 'doc') {
      console.log('Icono Word asignado');
      return '📝';
    }
    if (extension === 'xlsx' || extension === 'xls') {
      console.log('Icono Excel asignado');
      return '📊';
    }
    if (extension === 'pptx' || extension === 'ppt') return '📈';
    
    // Otras extensiones comunes
    if (extension === 'pdf') return '📋';
    if (extension.match(/^(jpg|jpeg|png|gif|bmp|svg|webp|ico|tiff)$/)) return '🖼️';
    if (extension.match(/^(mp4|avi|mov|wmv|flv|webm|mkv|m4v)$/)) return '🎥';
    if (extension.match(/^(mp3|wav|flac|aac|ogg|wma|m4a)$/)) return '🎵';
    if (extension.match(/^(txt|rtf|md|markdown)$/)) return '📃';
    if (extension.match(/^(zip|rar|7z|tar|gz|bz2|xz)$/)) return '🗜️';
    
    // Si no se puede determinar por extensión, usar MIME type como respaldo
    return getFileIcon(mimeType);
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
      categoria: getCategoryFromFileName(doc.nombre_archivo, doc.tipo_archivo),
      icono: getIconFromFileName(doc.nombre_archivo, doc.tipo_archivo),
      comentario: doc.comentario || ""
    };
  };

  const checkPreviewCapability = (mimeType, fileName) => {
    // Siempre permitir previsualización - mostraremos diferentes tipos de vista según el archivo
    return {
      canPreview: true,
      previewType: getPreviewType(mimeType, fileName),
      reason: null
    };
  };

  const getPreviewType = (mimeType, fileName) => {
    if (!mimeType) return 'info';
    
    // Debug: log para verificar el tipo de preview
    console.log('Determinando preview type para:', fileName, 'MIME:', mimeType);
    
    // Verificar por extensión también para archivos Office
    const extension = fileName?.split('.').pop()?.toLowerCase() || '';
    if (extension === 'docx' || extension === 'doc' || extension === 'xlsx' || extension === 'xls' || extension === 'pptx' || extension === 'ppt') {
      console.log('Preview type: office (por extensión)');
      return 'office';
    }
    
    // Tipos que se pueden previsualizar directamente en el navegador
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.startsWith('text/') || 
        mimeType.includes('json') || 
        mimeType.includes('xml') || 
        mimeType.includes('javascript') ||
        mimeType.includes('css') ||
        mimeType.includes('html') ||
        mimeType.includes('csv') ||
        mimeType.includes('markdown')) return 'text';
    
    // Para archivos de Office, mostrar información detallada
    if (mimeType.includes('word') || 
        mimeType.includes('excel') || 
        mimeType.includes('powerpoint') ||
        mimeType.includes('document') ||
        mimeType.includes('spreadsheet') ||
        mimeType.includes('presentation') ||
        mimeType.includes('officedocument') ||
        mimeType.includes('msword') ||
        mimeType.includes('ms-excel') ||
        mimeType.includes('ms-powerpoint') ||
        mimeType === 'application/vnd.ms-excel' ||
        mimeType === 'application/vnd.ms-powerpoint' ||
        mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
      console.log('Preview type: office (por MIME)');
      return 'office';
    }
    
    // Para archivos multimedia, mostrar información
    if (mimeType.startsWith('video/') || mimeType.startsWith('audio/')) return 'media';
    
    // Para archivos comprimidos, mostrar información
    if (mimeType.includes('zip') || 
        mimeType.includes('rar') || 
        mimeType.includes('7z') ||
        mimeType.includes('tar') ||
        mimeType.includes('gz') ||
        mimeType.includes('compressed')) return 'archive';
    
    // Por defecto, mostrar información del archivo
    return 'info';
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
    const previewType = getPreviewType(metadata.tipoMime, metadata.nombre);
    console.log('Rendering preview type:', previewType, 'para archivo:', metadata.nombre);

    switch (previewType) {
      case 'image':
        return (
          <div className="visualizador__preview-image">
            <img 
              src={previewUrl} 
              alt={metadata.nombre}
              onLoad={(e) => {
                // Imagen cargada exitosamente
                e.target.style.display = 'block';
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div style={{ display: 'none', textAlign: 'center', padding: '20px' }}>
              <div className="visualizador__icon-large">{metadata.icono}</div>
              <p>Error al cargar la imagen - Descarga el archivo para verlo</p>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="visualizador__preview-text">
            <iframe 
              src={previewUrl}
              title={metadata.nombre}
              sandbox="allow-same-origin"
              onLoad={(e) => {
                // Verificar si el iframe cargó correctamente
                try {
                  const iframeDoc = e.target.contentDocument || e.target.contentWindow.document;
                  if (!iframeDoc || iframeDoc.body.children.length === 0) {
                    throw new Error('Contenido vacío');
                  }
                } catch (error) {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div style={{ display: 'none', textAlign: 'center', padding: '20px' }}>
              <div className="visualizador__icon-large">{metadata.icono}</div>
              <p>Vista de texto no disponible - Descarga el archivo para verlo</p>
            </div>
          </div>
        );

      case 'pdf':
        return (
          <div className="visualizador__preview-pdf">
            <iframe 
              src={`${previewUrl}#toolbar=1&navpanes=0&scrollbar=1&page=1&zoom=FitWidth`}
              type="application/pdf"
              width="100%"
              height="100%"
              style={{
                border: 'none',
                minHeight: '600px',
                minWidth: '900px'
              }}
              title={`Vista previa PDF: ${metadata.nombre}`}
            />
          </div>
        );

      case 'office':
        return (
          <div className="visualizador__preview-office">
            <div className="visualizador__icon-large">{metadata.icono}</div>
            <h3>Vista Previa No Disponible</h3>
            <p><strong>Archivo:</strong> {metadata.nombre}</p>
            <p><strong>Formato:</strong> {metadata.extension}</p>
            <p><strong>Tamaño:</strong> {metadata.tamaño}</p>
            
            <div style={{ 
              margin: '20px 0', 
              padding: '16px', 
              background: '#fff3cd', 
              borderRadius: '8px',
              border: '1px solid #ffeaa7'
            }}>
              <h4 style={{ color: '#856404', marginBottom: '12px', textAlign: 'center' }}>Vista Previa No Disponible</h4>
              <p style={{ color: '#856404', marginBottom: '16px', textAlign: 'center' }}>
                Los archivos de Office (Word, Excel, PowerPoint) no se pueden previsualizar en el navegador.
              </p>
            </div>
          </div>
        );

      case 'media':
        return (
          <div className="visualizador__preview-media">
            <div className="visualizador__icon-large">{metadata.icono}</div>
            <h3>Archivo Multimedia</h3>
            <p><strong>Archivo:</strong> {metadata.nombre}</p>
            <p><strong>Tipo:</strong> {metadata.categoria}</p>
            <p><strong>Tamaño:</strong> {metadata.tamaño}</p>
            <div style={{ marginTop: '20px', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
              <h4>Información del Medio</h4>
              <p>🎵 Este es un archivo multimedia ({metadata.extension})</p>
              <p>💡 Para reproducir, descarga el archivo</p>
              <p>📱 Compatible con reproductores multimedia estándar</p>
            </div>
          </div>
        );

      case 'archive':
        return (
          <div className="visualizador__preview-archive">
            <div className="visualizador__icon-large">{metadata.icono}</div>
            <h3>Archivo Comprimido</h3>
            <p><strong>Archivo:</strong> {metadata.nombre}</p>
            <p><strong>Tipo:</strong> {metadata.categoria}</p>
            <p><strong>Tamaño:</strong> {metadata.tamaño}</p>
            <div style={{ marginTop: '20px', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
              <h4>Información del Archivo</h4>
              <p>📦 Este es un archivo comprimido ({metadata.extension})</p>
              <p>💡 Descarga y extrae para acceder al contenido</p>
              <p>🛠️ Compatible con WinRAR, 7-Zip, y otros extractores</p>
            </div>
          </div>
        );

      default: // 'info'
        return (
          <div className="visualizador__preview-info">
            <div className="visualizador__icon-large">{metadata.icono}</div>
            <h3>Vista de Información</h3>
            <p><strong>Archivo:</strong> {metadata.nombre}</p>
            <p><strong>Tipo:</strong> {metadata.categoria}</p>
            <p><strong>Tamaño:</strong> {metadata.tamaño}</p>
            <div style={{ marginTop: '20px', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
              <h4>Información del Archivo</h4>
              <p>📄 Archivo de tipo {metadata.extension}</p>
              <p>💡 Descarga el archivo para abrirlo con la aplicación apropiada</p>
              <p>🖥️ El sistema detectó este tipo de archivo automáticamente</p>
            </div>
          </div>
        );
    }
  };

  if (!isOpen || !documento) return null;

  return (
    <div className="visualizador__overlay" onClick={onClose}>
      <div className="visualizador__modal" onClick={(e) => e.stopPropagation()}>
        <div className="visualizador__header">
          <h2 className="visualizador__title">
            {metadata.icono} {metadata.nombre}
          </h2>
          <div className="visualizador__header-actions">
            <button 
              className="visualizador__close" 
              onClick={onClose}
              title="Cerrar"
            >
              ✕
            </button>
          </div>
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
                  {metadata.comentario && (
                    <div className="visualizador__metadata-item" style={{ gridColumn: '1 / -1' }}>
                      <label>Comentario:</label>
                      <span style={{ background: '#f3f6fa', borderRadius: 6, padding: '6px 10px', display: 'block', color: '#333' }}>{metadata.comentario}</span>
                    </div>
                  )}
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

              {/* Opciones avanzadas (PLUS) solo para proyectos */}
              {esDeProyecto && (
                <ArchivoDetallePlus
                  archivoId={metadata.id}
                  etiquetas={etiquetas}
                  comentarios={comentarios}
                  versiones={versiones}
                  permisos={permisos}
                  onEtiquetasChange={onEtiquetasChange}
                  onNuevoComentario={onNuevoComentario}
                  onRestaurarVersion={onRestaurarVersion}
                  onPermisosChange={onPermisosChange}
                />
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizadorArchivos;