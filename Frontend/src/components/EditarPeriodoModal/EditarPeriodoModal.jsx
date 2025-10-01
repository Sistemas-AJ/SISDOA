import React, { useState, useEffect } from "react";
import BACKEND_URL from "../../service/backend";
import { useNotification } from "../../contexts/NotificationContext";

const EditarPeriodoModal = ({ open, onClose, periodo, onUpdated }) => {
  const [form, setForm] = useState({
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
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showSuccess, showError } = useNotification();

  // Cargar datos del período cuando se abre el modal
  useEffect(() => {
    if (periodo && open) {
      const getMetadato = (clave, valorPorDefecto = '') => {
        return periodo.metadatos?.find(m => m.clave === clave)?.valor || valorPorDefecto;
      };

      setForm({
        nombre: periodo.nombre || "",
        estado_proyecto: getMetadato("estado_proyecto", "Activo"),
        responsable_proyecto: getMetadato("responsable_proyecto"),
        fecha_inicio: getMetadato("fecha_inicio"),
        fecha_fin_estimada: getMetadato("fecha_fin_estimada"),
        periodo_ejecucion: getMetadato("periodo_ejecucion"),
        cliente_asociado: getMetadato("cliente_asociado"),
        presupuesto_id: getMetadato("presupuesto_id"),
        tipo_proyecto: getMetadato("tipo_proyecto", "Desarrollo Interno"),
        prioridad: getMetadato("prioridad", "Alta"),
        fecha_ultima_revision: getMetadato("fecha_ultima_revision")
      });
    }
  }, [periodo, open]);

  if (!open || !periodo) return null;

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

      // Actualizar el módulo
      const res = await fetch(`${BACKEND_URL}/modulos/${periodo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          tipo: "PERIODO",
          id_bloque: periodo.id_bloque,
          metadatos
        })
      });

      if (!res.ok) throw new Error("No se pudo actualizar el período");
      
      setLoading(false);
      onUpdated && onUpdated();
      onClose();
      showSuccess("Período actualizado correctamente");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
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
    maxWidth: '600px',
    maxHeight: '80vh',
    overflowY: 'auto',
    width: '90%'
  };

  const formStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#333'
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  };

  const buttonStyle = {
    padding: '8px 16px',
    margin: '0 8px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginTop: 0, color: '#2196f3' }}>Editar Período</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={formStyle}>
            <div>
              <label style={labelStyle}>Nombre del Período</label>
              <input 
                name="nombre" 
                value={form.nombre} 
                onChange={handleChange} 
                required 
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Estado del Proyecto</label>
              <select name="estado_proyecto" value={form.estado_proyecto} onChange={handleChange} style={inputStyle}>
                <option value="Activo">Activo</option>
                <option value="Planificación">Planificación</option>
                <option value="En Pausa">En Pausa</option>
                <option value="Completado">Completado</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Responsable</label>
              <input name="responsable_proyecto" value={form.responsable_proyecto} onChange={handleChange} style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Fecha de Inicio</label>
              <input type="date" name="fecha_inicio" value={form.fecha_inicio} onChange={handleChange} style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Fecha Fin Estimada</label>
              <input type="date" name="fecha_fin_estimada" value={form.fecha_fin_estimada} onChange={handleChange} style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Período de Ejecución</label>
              <input name="periodo_ejecucion" value={form.periodo_ejecucion} onChange={handleChange} style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Cliente Asociado</label>
              <input name="cliente_asociado" value={form.cliente_asociado} onChange={handleChange} style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Presupuesto ID</label>
              <input name="presupuesto_id" value={form.presupuesto_id} onChange={handleChange} style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Tipo de Proyecto</label>
              <select name="tipo_proyecto" value={form.tipo_proyecto} onChange={handleChange} style={inputStyle}>
                <option value="Desarrollo Interno">Desarrollo Interno</option>
                <option value="Consultoría">Consultoría</option>
                <option value="Marketing">Marketing</option>
                <option value="Investigación">Investigación</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Prioridad</label>
              <select name="prioridad" value={form.prioridad} onChange={handleChange} style={inputStyle}>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Última Revisión</label>
              <input type="date" name="fecha_ultima_revision" value={form.fecha_ultima_revision} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          {error && (
            <div style={{ color: '#f44336', margin: '16px 0', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <div style={{ textAlign: 'right', marginTop: '24px' }}>
            <button 
              type="button" 
              onClick={onClose} 
              disabled={loading}
              style={{
                ...buttonStyle,
                backgroundColor: '#f5f5f5',
                color: '#333'
              }}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              style={{
                ...buttonStyle,
                backgroundColor: '#2196f3',
                color: 'white'
              }}
            >
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarPeriodoModal;