import React, { useState } from "react";
import "./ProyectoDetalle.css";

const initialState = {
  nombre: "",
  archivo: null,
  ruta_fisica: "",
  tipo_archivo: "",
  id_carpeta: null,
  fecha_creacion: "",
  fecha_modificacion: "",
};


const AgregarArchivoModal = ({ isOpen, onClose, onSubmit, idCarpeta }) => {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  React.useEffect(() => {
    if (isOpen && idCarpeta) {
      setForm(f => ({ ...initialState, id_carpeta: idCarpeta }));
    }
  }, [isOpen, idCarpeta]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "archivo" && files.length > 0) {
      const file = files[0];
      // Detectar ruta física (fake, solo nombre para frontend), tipo y fecha
      const now = new Date();
      setForm(f => ({
        ...f,
        archivo: file,
        ruta_fisica: file.name,
        tipo_archivo: file.type,
        fecha_creacion: now.toISOString().slice(0, 10),
        fecha_modificacion: now.toISOString().slice(0, 10),
      }));
      setPreview(URL.createObjectURL(file));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.archivo || !form.id_carpeta) {
      setError("Todos los campos son obligatorios");
      return;
    }
    setError("");
    onSubmit && onSubmit(form);
    setForm(initialState);
    setPreview(null);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Agregar Archivo</h2>
        <form onSubmit={handleSubmit} className="modal-form" style={{ gridTemplateColumns: '1fr' }}>
          <label>Nombre del archivo
            <input name="nombre" value={form.nombre} onChange={handleChange} required />
          </label>
          <label>Archivo
            <input type="file" name="archivo" accept="*" onChange={handleChange} required />
          </label>
          {form.archivo && (
            <div style={{ margin: '10px 0' }}>
              <b>Tipo de archivo:</b> {form.tipo_archivo || 'Desconocido'}<br />
              <b>Ruta física:</b> {form.ruta_fisica}<br />
              <b>Fecha de creación:</b> {form.fecha_creacion}<br />
              <b>Fecha de modificación:</b> {form.fecha_modificacion}
              {preview && form.tipo_archivo && form.tipo_archivo.startsWith('image/') && (
                <div><img src={preview} alt="preview" style={{ maxWidth: 120, marginTop: 8 }} /></div>
              )}
            </div>
          )}
          {error && <div className="modal-error">{error}</div>}
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Agregar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgregarArchivoModal;
