import React, { useState, useEffect } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import BACKEND_URL from '../../service/backend';

const ListaArchivos = ({ carpetaId, onUpload }) => {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (tipoArchivo) => {
    if (!tipoArchivo) return '📄';
    
    if (tipoArchivo.includes('image/')) return '🖼️';
    if (tipoArchivo.includes('video/')) return '🎥';
    if (tipoArchivo.includes('audio/')) return '🎵';
    if (tipoArchivo.includes('pdf')) return '📋';
    if (tipoArchivo.includes('word')) return '📝';
    if (tipoArchivo.includes('excel') || tipoArchivo.includes('spreadsheet')) return '📊';
    if (tipoArchivo.includes('powerpoint') || tipoArchivo.includes('presentation')) return '📈';
    if (tipoArchivo.includes('zip') || tipoArchivo.includes('rar')) return '🗜️';
    
    return '📄';
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
      
      <div style={{ display: 'grid', gap: '12px' }}>
        {documentos.map((documento) => (
          <div
            key={documento.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px',
              background: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#2196f3';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(33, 150, 243, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e0e0e0';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ 
              fontSize: '24px', 
              marginRight: '12px' 
            }}>
              {getFileIcon(documento.tipo_archivo)}
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontWeight: '500', 
                color: '#333', 
                fontSize: '14px',
                marginBottom: '4px'
              }}>
                {documento.nombre_archivo}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#666',
                display: 'flex',
                gap: '12px'
              }}>
                <span>{formatFileSize(documento.tamaño_bytes)}</span>
                <span>•</span>
                <span>{new Date(documento.fecha_creacion).toLocaleDateString('es-ES')}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
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
    </div>
  );
};

export default ListaArchivos;