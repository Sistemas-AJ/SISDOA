import React, { useState } from "react";
import "./CrearPeriodoModal.css";
import BACKEND_URL from "../../../service/backend";

const initialState = {
  nombre: "",
  estado_proyecto: "Activo",
  responsable_proyecto: "",
  fecha_inicio: "",
  fecha_fin_estimada: "",
  periodo_ejecucion: "",
  cliente_asociado: "",
  presupuesto_id: "",
  tipo_proyecto: "Desarrollo Interno",
  prioridad: "Alta",
  fecha_ultima_revision: ""
};

const CrearPeriodoModal = ({ open, onClose, onCreated }) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Construir el array de metadatos (clave/valor)
      const metadatos = [
        { clave: "estado_proyecto", valor: form.estado_proyecto },
        { clave: "responsable_proyecto", valor: form.responsable_proyecto },
        { clave: "fecha_inicio", valor: form.fecha_inicio },
        { clave: "fecha_fin_estimada", valor: form.fecha_fin_estimada },
        { clave: "periodo_ejecucion", valor: form.periodo_ejecucion },
        { clave: "cliente_asociado", valor: form.cliente_asociado },
        { clave: "presupuesto_id", valor: form.presupuesto_id },
        { clave: "tipo_proyecto", valor: form.tipo_proyecto },
        { clave: "prioridad", valor: form.prioridad },
        { clave: "fecha_ultima_revision", valor: form.fecha_ultima_revision }
      ];

      // Aquí debes poner el id_bloque correspondiente al bloque de periodos (ajusta según tu lógica)
      const id_bloque = 2; // <-- Cambia esto si tu id de bloque de periodos es diferente

      // Enviar todo en un solo request al endpoint de módulos
      const res = await fetch(`${BACKEND_URL}/modulos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          tipo: "PERIODO",
          id_bloque,
          metadatos
        })
      });

      if (!res.ok) throw new Error("No se pudo crear el periodo");
      setLoading(false);
      setForm(initialState);
      onCreated && onCreated();
      onClose();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Crear Nuevo Periodo</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Columna 1 */}
          <label>Nombre del Periodo
            <input name="nombre" value={form.nombre} onChange={handleChange} required />
          </label>
          <label>Estado del Proyecto
            <select name="estado_proyecto" value={form.estado_proyecto} onChange={handleChange}>
              <option>Activo</option>
              <option>Planificación</option>
              <option>En Pausa</option>
              <option>Completado</option>
            </select>
          </label>

          <label>Responsable
            <input name="responsable_proyecto" value={form.responsable_proyecto} onChange={handleChange} />
          </label>
          <label>Fecha de Inicio
            <input type="date" name="fecha_inicio" value={form.fecha_inicio} onChange={handleChange} />
          </label>

          <label>Fecha Fin Estimada
            <input type="date" name="fecha_fin_estimada" value={form.fecha_fin_estimada} onChange={handleChange} />
          </label>
          <label>Periodo de Ejecución
            <input name="periodo_ejecucion" value={form.periodo_ejecucion} onChange={handleChange} />
          </label>

          <label>Cliente Asociado
            <input name="cliente_asociado" value={form.cliente_asociado} onChange={handleChange} />
          </label>
          <label>Presupuesto ID
            <input name="presupuesto_id" value={form.presupuesto_id} onChange={handleChange} />
          </label>

          <label>Tipo de Proyecto
            <select name="tipo_proyecto" value={form.tipo_proyecto} onChange={handleChange}>
              <option>Desarrollo Interno</option>
              <option>Consultoría</option>
              <option>Marketing</option>
              <option>Investigación</option>
            </select>
          </label>
          <label>Prioridad
            <select name="prioridad" value={form.prioridad} onChange={handleChange}>
              <option>Alta</option>
              <option>Media</option>
              <option>Baja</option>
            </select>
          </label>

          <label>Última Revisión
            <input type="date" name="fecha_ultima_revision" value={form.fecha_ultima_revision} onChange={handleChange} />
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

export default CrearPeriodoModal;
