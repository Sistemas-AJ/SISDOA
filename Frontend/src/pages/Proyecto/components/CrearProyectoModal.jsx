import React, { useState } from "react";
import "./CrearProyectoModal.css";
import BACKEND_URL from "../../../service/backend";

const initialState = {
  nombre_proyecto: "",
  autor_asignado: "",
  editor_asignado: "",
  descripcion: "",
  tipo_contenido: "Articulo",
  fecha_asignada: "",
  estado: "Borrador",
};

// CAMBIO 1: Aceptamos "isOpen" y "onSubmit" en lugar de "open" y "onCreated"
const CrearProyectoModal = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // CAMBIO 2: Usamos "isOpen" para decidir si se muestra el modal
  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // IMPORTANTE: La lógica de creación de proyecto ya está aquí dentro.
    // La función que pasas como "onSubmit" en el componente padre 
    // está duplicando la lógica. Deberías elegir una de las dos.
    
    // Por ahora, mantendremos la lógica detallada que ya teníamos aquí.
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BACKEND_URL}/proyectos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: form.nombre_proyecto, descripcion: form.descripcion })
      });
      if (!res.ok) throw new Error("No se pudo crear el proyecto");
      
      const proyecto = await res.json();
      const metadatos = [
        { clave: "autor_asignado", valor: form.autor_asignado },
        { clave: "editor_asignado", valor: form.editor_asignado },
        { clave: "tipo_contenido", valor: form.tipo_contenido },
        { clave: "fecha_asignada", valor: form.fecha_asignada },
        { clave: "estado", valor: form.estado },
      ];

      for (const meta of metadatos) {
        await fetch(`${BACKEND_URL}/metadatos/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_documento: proyecto.id, clave: meta.clave, valor: meta.valor })
        });
      }

      setLoading(false);
      setForm(initialState);
      
      // CAMBIO 3: Llamamos a onSubmit para que el padre refresque la lista de proyectos
      onSubmit && onSubmit(); 
      
      onClose();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Crear Nuevo Proyecto</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          {/* El resto del formulario sigue igual... */}
          <label>Nombre del proyecto
            <input name="nombre_proyecto" value={form.nombre_proyecto} onChange={handleChange} required />
          </label>
          <label>Autor Asignado
            <input name="autor_asignado" value={form.autor_asignado} onChange={handleChange} />
          </label>
          <label>Editor Asignado
            <input name="editor_asignado" value={form.editor_asignado} onChange={handleChange} />
          </label>
          <label>Fecha Asignada
            <input type="date" name="fecha_asignada" value={form.fecha_asignada} onChange={handleChange} />
          </label>
          <label>Tipo de Contenido
            <select name="tipo_contenido" value={form.tipo_contenido} onChange={handleChange}>
              <option>Articulo</option>
              <option>Video</option>
              <option>Infografía</option>
              <option>Podcast</option>
            </select>
          </label>
          <label>Estado
            <select name="estado" value={form.estado} onChange={handleChange}>
              <option>Borrador</option>
              <option>En Revisión</option>
              <option>Aprobado</option>
              <option>Publicado</option>
            </select>
          </label>
          <label style={{ gridColumn: '1 / -1' }}>Descripción
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows="3" />
          </label>
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

export default CrearProyectoModal;