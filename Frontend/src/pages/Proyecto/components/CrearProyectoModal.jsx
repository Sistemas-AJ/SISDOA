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

const CrearProyectoModal = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const id_bloque = 1;

      // --- CORRECCIÓN APLICADA AQUÍ ---
      // Si el usuario seleccionó una fecha, la convertimos a formato ISO.
      // Si no, enviamos un texto vacío.
      const fechaParaEnviar = form.fecha_asignada
        ? new Date(form.fecha_asignada).toISOString()
        : "";

      const metadatos = [
        { clave: "autor_asignado", valor: form.autor_asignado },
        { clave: "editor_asignado", valor: form.editor_asignado },
        { clave: "tipo_contenido", valor: form.tipo_contenido },
        // Usamos la variable con la fecha en el formato correcto.
        { clave: "fecha_asignada", valor: fechaParaEnviar },
        { clave: "estado", valor: form.estado },
        { clave: "descripcion", valor: form.descripcion },
      ];

      const res = await fetch(`${BACKEND_URL}/modulos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre_proyecto,
          tipo: "PROYECTO",
          id_bloque,
          metadatos,
        }),
      });

      if (!res.ok)
        throw new Error("No se pudo crear el proyecto. Revisa los campos.");

      const nuevoProyecto = await res.json();
      setLoading(false);
      setForm(initialState);
      onSubmit && onSubmit(nuevoProyecto);
      onClose();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Crear Nuevo Proyecto</h2>
          <button
            onClick={onClose}
            className="close-button"
            aria-label="Cerrar modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group full-width">
            <label htmlFor="nombre_proyecto">Nombre del proyecto</label>
            <div className="input-with-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
              </svg>
              <input
                id="nombre_proyecto"
                name="nombre_proyecto"
                value={form.nombre_proyecto}
                onChange={handleChange}
                required
                placeholder="Ej: Lanzamiento Q4"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="autor_asignado">Autor Asignado</label>
            <div className="input-with-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.41-1.412A6.97 6.97 0 0010 11.5a6.97 6.97 0 00-6.535 2.993z" />
              </svg>
              <input
                id="autor_asignado"
                name="autor_asignado"
                value={form.autor_asignado}
                onChange={handleChange}
                placeholder="Nombre del autor"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="editor_asignado">Editor Asignado</label>
            <div className="input-with-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.41-1.412A6.97 6.97 0 0010 11.5a6.97 6.97 0 00-6.535 2.993z" />
              </svg>
              <input
                id="editor_asignado"
                name="editor_asignado"
                value={form.editor_asignado}
                onChange={handleChange}
                placeholder="Nombre del editor"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="fecha_asignada">Fecha Límite</label>
            <div className="input-with-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zM4.5 8.5a.75.75 0 000 1.5h11a.75.75 0 000-1.5h-11z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                id="fecha_asignada"
                type="date"
                name="fecha_asignada"
                value={form.fecha_asignada}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tipo_contenido">Tipo de Contenido</label>
            <div className="select-wrapper">
              <select
                id="tipo_contenido"
                name="tipo_contenido"
                value={form.tipo_contenido}
                onChange={handleChange}
              >
                <option>Articulo</option>
                <option>Video</option>
                <option>Infografía</option>
                <option>Podcast</option>
              </select>
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="estado">Estado Actual</label>
            <div className="select-wrapper">
              <select
                id="estado"
                name="estado"
                value={form.estado}
                onChange={handleChange}
              >
                <option>Borrador</option>
                <option>En Revisión</option>
                <option>Aprobado</option>
                <option>Publicado</option>
              </select>
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows="4"
              placeholder="Añade una breve descripción del proyecto..."
            />
          </div>

          {error && <div className="modal-error">{error}</div>}

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? "Creando..." : "Crear Proyecto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearProyectoModal;