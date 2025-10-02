
import React, { useState, useEffect } from "react";
import "./DetallesProyectoModal.css";
import BACKEND_URL from "../../service/backend";

// Campos de metadatos que se pueden editar
const METADATA_FIELDS = [
  { name: "autor_asignado", label: "Autor Asignado" },
  { name: "editor_asignado", label: "Editor Asignado" },
  { name: "tipo_contenido", label: "Tipo de Contenido" },
  { name: "fecha_asignada", label: "Fecha Asignada", type: "date" },
  { name: "estado", label: "Estado" },
  { name: "descripcion", label: "Descripción", type: "textarea" },
];

const EditarProyectoModal = ({ open, onClose, proyecto, onUpdated }) => {
  // Estado para los campos principales
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [id_bloque, setIdBloque] = useState(1);
  // Estado para los metadatos
  const [metadatos, setMetadatos] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Al abrir el modal, mapea los datos del proyecto y sus metadatos
  useEffect(() => {
    if (proyecto) {
      setNombre(proyecto.nombre || "");
      setTipo(proyecto.tipo || "PROYECTO");
      setIdBloque(proyecto.id_bloque || 1);
      // Mapea los metadatos a un objeto {clave: valor}
      const metaObj = {};
      if (Array.isArray(proyecto.metadatos)) {
        proyecto.metadatos.forEach(m => { metaObj[m.clave] = m.valor; });
      }
      setMetadatos(metaObj);
    }
  }, [proyecto, open]);

  if (!open || !proyecto) return null;

  const handleMetaChange = (e) => {
    setMetadatos({ ...metadatos, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Construye el array de metadatos para el backend
      const metadatosArr = METADATA_FIELDS.map(f => ({ clave: f.name, valor: metadatos[f.name] || "" }));
      const body = {
        nombre,
        tipo,
        id_bloque,
        metadatos: metadatosArr
      };
      const res = await fetch(`${BACKEND_URL}/modulos/${proyecto.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("No se pudo actualizar el proyecto");
      const actualizado = await res.json();
      onUpdated && onUpdated(actualizado);
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
        <h2 style={{ color: '#007bff', marginBottom: 8 }}>Editar Proyecto</h2>
        <form onSubmit={handleSubmit} className="modal-form" style={{ gridTemplateColumns: '1fr' }}>
          <label>Nombre
            <input name="nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
          </label>
          {METADATA_FIELDS.map(f => (
            <label key={f.name}>{f.label}
              {f.type === "textarea" ? (
                <textarea name={f.name} value={metadatos[f.name] || ""} onChange={handleMetaChange} />
              ) : f.type === "date" ? (
                <input type="date" name={f.name} value={metadatos[f.name] || ""} onChange={handleMetaChange} />
              ) : (
                <input name={f.name} value={metadatos[f.name] || ""} onChange={handleMetaChange} />
              )}
            </label>
          ))}
          {error && <div className="modal-error">{error}</div>}
          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={loading}>Cancelar</button>
            <button type="submit" className="modal-btn-primary" disabled={loading}>Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarProyectoModal;
