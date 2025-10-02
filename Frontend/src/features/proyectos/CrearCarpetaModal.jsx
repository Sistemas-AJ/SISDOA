import React, { useState } from "react";
import BACKEND_URL from "../../service/backend";
const initialState = {
  nombre: "",
};

const CrearCarpetaModal = ({ isOpen, onClose, id_modulo, id_padre = null, onCreated }) => {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre) {
      setError("El nombre es obligatorio");
      return;
    }
    setError("");
    setLoading(true);
    const carpetaData = {
      nombre: form.nombre,
      id_padre: id_padre,
      id_modulo: id_modulo,
      // La fecha de creación se genera automáticamente en el backend
    };
    try {
  const res = await fetch(`${BACKEND_URL}/carpetas/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(carpetaData),
      });
      if (!res.ok) throw new Error("No se pudo crear la carpeta");
      const nuevaCarpeta = await res.json();
      onCreated && onCreated(nuevaCarpeta);
      setForm(initialState);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Crear Carpeta</h2>
        <form onSubmit={handleSubmit} className="modal-form" style={{ gridTemplateColumns: '1fr' }}>
          <label>Nombre de la carpeta
            <input 
              name="nombre" 
              value={form.nombre} 
              onChange={handleChange} 
              placeholder="Ingresa el nombre de la carpeta"
              required 
            />
          </label>
          <p style={{ fontSize: '12px', color: '#666', margin: '8px 0' }}>
            La fecha de creación se asignará automáticamente
          </p>
          {error && <div className="modal-error">{error}</div>}
          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={loading}>Cancelar</button>
            <button type="submit" disabled={loading}>{loading ? "Creando..." : "Crear"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearCarpetaModal;
