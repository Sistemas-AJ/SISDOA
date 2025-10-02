import React, { useState, useEffect } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import BACKEND_URL from '../../service/backend';
import './VisualizadorArchivos.css';

const VisualizadorArchivos = ({ documento, isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);
  const [canPreview, setCanPreview] = useState(true);
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
      icono: getFileIcon(doc.tipo_archivo),
      comentario: doc.comentario || ""
    };
  };

  const checkPreviewCapability = (mimeType) => {
    // Siempre permitir previsualización - mostraremos diferentes tipos de vista según el archivo
    return {
      canPreview: true,
      previewType: getPreviewType(mimeType),
      reason: null
    };
  };

  const getPreviewType = (mimeType) => {
    if (!mimeType) return 'info';
    
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
        mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') return 'office';
    
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
    const previewType = getPreviewType(metadata.tipoMime);

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
            <embed 
              src={previewUrl}
              type="application/pdf"
              width="100%"
              height="100%"
            />
          </div>
        );

      case 'office':
        const getOfficeInfo = () => {
          const ext = metadata.extension?.toLowerCase();
          const mime = metadata.tipoMime?.toLowerCase();
          
          if (ext === 'docx' || ext === 'doc' || mime?.includes('word')) {
            return {
              type: 'Documento Word',
              icon: '📝',
              description: 'Documento de procesamiento de texto',
              features: ['✍️ Texto con formato', '📄 Páginas y secciones', '🖼️ Imágenes y tablas', '📝 Comentarios y revisiones']
            };
          } else if (ext === 'xlsx' || ext === 'xls' || mime?.includes('excel')) {
            return {
              type: 'Hoja de Cálculo Excel',
              icon: '📊',
              description: 'Hoja de cálculo con datos y fórmulas',
              features: ['🧮 Cálculos y fórmulas', '📈 Gráficos y tablas dinámicas', '📋 Múltiples hojas', '🔢 Análisis de datos']
            };
          } else if (ext === 'pptx' || ext === 'ppt' || mime?.includes('powerpoint')) {
            return {
              type: 'Presentación PowerPoint',
              icon: '📈',
              description: 'Presentación con diapositivas',
              features: ['🎭 Diapositivas interactivas', '🎨 Animaciones y transiciones', '🖼️ Multimedia integrada', '📊 Gráficos y diagramas']
            };
          }
          
          return {
            type: 'Documento Office',
            icon: '📄',
            description: 'Archivo de Microsoft Office',
            features: ['📁 Compatible con Office Suite', '💾 Formato propietario', '🔧 Requiere software específico']
          };
        };
        
        const officeInfo = getOfficeInfo();
        
        return (
          <div className="visualizador__preview-office">
            <div className="visualizador__icon-large">{officeInfo.icon}</div>
            <h3>{officeInfo.type}</h3>
            <p><strong>Archivo:</strong> {metadata.nombre}</p>
            <p><strong>Formato:</strong> {metadata.extension?.toUpperCase()}</p>
            <p><strong>Tamaño:</strong> {metadata.tamaño}</p>
            
            <div style={{ marginTop: '20px', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
              <h4>📋 Información del Archivo</h4>
              <p style={{ marginBottom: '12px', fontStyle: 'italic' }}>{officeInfo.description}</p>
              
              <h5 style={{ margin: '12px 0 8px 0', fontSize: '14px' }}>🔧 Características:</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {officeInfo.features.map((feature, index) => (
                  <span key={index} style={{ fontSize: '13px' }}>{feature}</span>
                ))}
              </div>
            </div>
            
            <div style={{ marginTop: '16px', padding: '12px', background: '#e3f2fd', borderRadius: '6px', borderLeft: '4px solid #2196f3' }}>
              <h5 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#1976d2' }}>💡 Cómo abrir este archivo:</h5>
              <div style={{ fontSize: '13px', lineHeight: '1.4' }}>
                <p style={{ margin: '4px 0' }}>• <strong>Microsoft Office:</strong> {officeInfo.type.includes('Word') ? 'Word' : officeInfo.type.includes('Excel') ? 'Excel' : 'PowerPoint'}</p>
                <p style={{ margin: '4px 0' }}>• <strong>Alternativas gratuitas:</strong> LibreOffice, Google Docs/Sheets/Slides</p>
                <p style={{ margin: '4px 0' }}>• <strong>Online:</strong> Office 365, Google Workspace</p>
              </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizadorArchivos;