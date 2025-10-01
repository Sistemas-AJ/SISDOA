import React, { useState } from "react";
import "./ProyectoDetalle.css";

const initialState = {
  nombre: "",
  fecha_creacion: "",
  archivo: null,
};

const AgregarArchivoModal = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "archivo" && files.length > 0) {
      setForm({ ...form, archivo: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.fecha_creacion || !form.archivo) {
      setError("Todos los campos son obligatorios");
      return;
    }
    setError("");
    onSubmit && onSubmit(form);
    setForm(initialState);
    setPreview(null);
    onClose();
  };

  // Detectar tipo de archivo
  const tipoArchivo = form.archivo ? form.archivo.type : "";

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Agregar Archivo</h2>
        <form onSubmit={handleSubmit} className="modal-form" style={{ gridTemplateColumns: '1fr' }}>
          <label>Nombre del archivo
            <input name="nombre" value={form.nombre} onChange={handleChange} required />
          </label>
          <label>Fecha de creación
            <input type="date" name="fecha_creacion" value={form.fecha_creacion} onChange={handleChange} required />
          </label>
          <label>Archivo
            <input type="file" name="archivo" accept="*" onChange={handleChange} required />
          </label>
          {form.archivo && (
            <div style={{ margin: '10px 0' }}>
              <b>Tipo de archivo:</b> {tipoArchivo}
              {preview && tipoArchivo.startsWith('image/') && (
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
