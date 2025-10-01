import React, { useState } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import BACKEND_URL from '../../service/backend';

const SubirArchivoModal = ({ isOpen, onClose, carpetaId, onUploaded }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { showSuccess, showError } = useNotification();

  if (!isOpen) return null;

  const handleFileSelect = (file) => {
    setSelectedFile(file);
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
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '16px', 
            marginBottom: '20px',
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