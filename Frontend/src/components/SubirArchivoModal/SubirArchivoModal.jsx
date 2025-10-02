import React, { useState } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import BACKEND_URL from '../../service/backend';

const SubirArchivoModal = ({ isOpen, onClose, carpetaId, onUploaded }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [comentario, setComentario] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { showSuccess, showError } = useNotification();

  if (!isOpen) return null;

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setComentario(""); // Limpiar comentario al seleccionar nuevo archivo
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    if (comentario) formData.append('comentario', comentario);

    try {
      const response = await fetch(`${BACKEND_URL}/documentos/upload/${carpetaId}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const documento = await response.json();
        showSuccess(`Archivo "${selectedFile.name}" subido exitosamente`);
        onUploaded && onUploaded(documento);
        onClose();
        setSelectedFile(null);
        setComentario("");
      } else {
        throw new Error('Error al subir archivo');
      }
    } catch (error) {
      console.error('Error:', error);
      showError('Error al subir archivo: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const contentStyle = {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    width: '500px',
    maxWidth: '90%'
  };

  const dropZoneStyle = {
    border: `2px dashed ${dragOver ? '#2196f3' : '#ddd'}`,
    borderRadius: '8px',
    padding: '40px 20px',
    textAlign: 'center',
    backgroundColor: dragOver ? '#f5f5f5' : 'transparent',
    cursor: 'pointer',
    marginBottom: '20px',
    transition: 'all 0.3s'
  };

  const buttonStyle = {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    margin: '0 8px'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#2196f3',
    color: 'white'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f5f5f5',
    color: '#333'
  };

  return (
    <div style={modalStyle}>
      <div style={contentStyle}>
        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Subir Archivo</h3>
        
        {!selectedFile ? (
          <div
            style={dropZoneStyle}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById('fileInput').click()}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
            <p style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>
              Arrastra y suelta tu archivo aquí
            </p>
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
              o haz clic para seleccionar un archivo
            </p>
            <input
              id="fileInput"
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
            />
          </div>
        ) : (
          <>
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '16px', 
              marginBottom: '16px',
              backgroundColor: '#f9f9f9'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '32px' }}>📄</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {selectedFile.name}
                  </div>
                  <div style={{ color: '#666', fontSize: '14px' }}>
                    {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Tipo desconocido'}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#f44336',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
            {/* Campo de comentario opcional con mejor diseño */}
            <div style={{ marginBottom: '22px', paddingLeft: 4, paddingRight: 4 }}>
              <label style={{ fontWeight: 600, color: '#1976d2', display: 'block', marginBottom: 6, fontSize: 16, letterSpacing: 0.2 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="20" height="20" fill="#1976d2" style={{ marginRight: 2 }} viewBox="0 0 24 24"><path d="M12 22c-.28 0-.53-.11-.71-.29l-3.88-3.88H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2h-2.41l-3.88 3.88c-.18.18-.43.29-.71.29zm-7-5h2.59c.27 0 .52.11.71.29L12 19.17l3.71-3.88c.19-.18.44-.29.71-.29H19V5H5v12zm7-2c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                  Comentario <span style={{ color: '#888', fontWeight: 400, fontSize: 14 }}>(opcional)</span>:
                </span>
                <textarea
                  value={comentario}
                  onChange={e => setComentario(e.target.value)}
                  placeholder="Agrega un comentario sobre el archivo..."
                  rows={3}
                  style={{
                    width: '100%',
                    borderRadius: 8,
                    border: '1.5px solid #b6c6e3',
                    padding: '12px 1px',
                    fontSize: 15.5,
                    marginTop: 7,
                    marginBottom: 2,
                    background: '#f7faff',
                    color: '#222',
                    boxShadow: '0 1px 4px rgba(25, 118, 210, 0.07)',
                    outline: 'none',
                    transition: 'border 0.2s',
                    resize: 'vertical',
                  }}
                  onFocus={e => e.target.style.border = '1.5px solid #1976d2'}
                  onBlur={e => e.target.style.border = '1.5px solid #b6c6e3'}
                />
              </label>
            </div>
          </>
        )}
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button 
            onClick={onClose}
            style={secondaryButtonStyle}
            disabled={uploading}
          >
            Cancelar
          </button>
          <button 
            onClick={handleUpload}
            style={primaryButtonStyle}
            disabled={!selectedFile || uploading}
          >
            {uploading ? 'Subiendo...' : 'Subir Archivo'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubirArchivoModal;