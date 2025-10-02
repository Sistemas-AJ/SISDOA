import React, { useState } from "react";

const EtiquetaComentarioManager = ({ registros = [], onNuevoRegistro }) => {
  const [nombre, setNombre] = useState("");
  const [etiqueta, setEtiqueta] = useState("");
  const [comentario, setComentario] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (nombre.trim() && etiqueta.trim() && comentario.trim()) {
      onNuevoRegistro && onNuevoRegistro({ nombre, etiqueta, comentario, fecha: new Date().toLocaleString() });
      setNombre("");
      setEtiqueta("");
      setComentario("");
    }
  };

  return (
    <div style={{ marginTop: 24, marginBottom: 24 }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#1565c0', fontWeight: 700, letterSpacing: 0.2 }}>Añadir Etiqueta y Comentario</h4>
      <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14, maxWidth: 400 }}>
        <input
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Nombre de la persona"
          style={{ borderRadius: 8, border: '1.5px solid #90caf9', padding: '7px 12px', background: '#f5faff', fontSize: '1em', outline: 'none', width: '100%' }}
        />
        <input
          value={etiqueta}
          onChange={e => setEtiqueta(e.target.value)}
          placeholder="Etiqueta"
          style={{ borderRadius: 8, border: '1.5px solid #90caf9', padding: '7px 12px', background: '#f5faff', fontSize: '1em', outline: 'none', width: '100%' }}
        />
        <textarea
          value={comentario}
          onChange={e => setComentario(e.target.value)}
          placeholder="Comentario"
          style={{ borderRadius: 8, border: '1.5px solid #90caf9', padding: '7px 12px', fontSize: '1em', background: '#f5faff', outline: 'none', width: '100%', minHeight: 38, resize: 'vertical' }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" style={{ background: 'linear-gradient(90deg,#1976d2,#64b5f6)', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 22px', cursor: 'pointer', fontWeight: 600, fontSize: '1em', boxShadow: '0 1px 4px #90caf9' }}>Agregar</button>
        </div>
      </form>
      <ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0, minHeight: 32 }}>
        {registros.map((r, idx) => (
          <li key={idx} style={{
            marginBottom: 10,
            background: 'linear-gradient(90deg,#e3f2fd,#f9fafe)',
            borderRadius: 14,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            boxShadow: '0 1px 4px #e3f2fd'
          }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1976d2', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1em', marginRight: 6 }}>{r.nombre?.[0]?.toUpperCase() || 'U'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: '#1976d2', marginBottom: 2 }}>{r.nombre || "Usuario"} <span style={{ background: '#bbdefb', color: '#1976d2', borderRadius: 8, padding: '2px 8px', fontSize: '0.9em', marginLeft: 8 }}>{r.etiqueta}</span></div>
              <div style={{ color: '#222', fontSize: '1em', marginBottom: 2 }}>{r.comentario}</div>
              <div style={{ fontSize: '0.85em', color: '#888' }}>{r.fecha}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EtiquetaComentarioManager;
