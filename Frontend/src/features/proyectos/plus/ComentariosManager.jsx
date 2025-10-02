import React, { useState } from "react";

const ComentariosManager = ({ archivoId, comentarios = [], onNuevoComentario }) => {
  const [input, setInput] = useState("");
  const [usuario, setUsuario] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (input.trim() && usuario.trim()) {
      onNuevoComentario && onNuevoComentario({ usuario, texto: input, fecha: new Date().toISOString().slice(0, 10) });
      setInput("");
    }
  };
  return (
    <div>
      <h4 style={{ margin: '0 0 10px 0', color: '#1565c0', fontWeight: 700, letterSpacing: 0.2 }}>Comentarios</h4>
      <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14, maxWidth: 400 }}>
        <input
          value={usuario}
          onChange={e => setUsuario(e.target.value)}
          placeholder="Tu nombre"
          style={{ borderRadius: 8, border: '1.5px solid #90caf9', padding: '7px 12px', background: '#f5faff', fontSize: '1em', outline: 'none', transition: 'border 0.2s', width: '100%' }}
        />
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Agregar comentario"
          style={{ borderRadius: 8, border: '1.5px solid #90caf9', padding: '7px 12px', fontSize: '1em', background: '#f5faff', outline: 'none', transition: 'border 0.2s', width: '100%', minHeight: 38, resize: 'vertical' }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" style={{ background: 'linear-gradient(90deg,#1976d2,#64b5f6)', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 22px', cursor: 'pointer', fontWeight: 600, fontSize: '1em', boxShadow: '0 1px 4px #90caf9' }}>Comentar</button>
        </div>
      </form>
      <ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0, minHeight: 32 }}>
        {comentarios.map((c, idx) => (
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
            <div style={{
              width: 32, height: 32, borderRadius: '50%', background: '#1976d2', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1em', marginRight: 6
            }}>{c.usuario?.[0]?.toUpperCase() || 'U'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: '#1976d2', marginBottom: 2 }}>{c.usuario || "Usuario"}</div>
              <div style={{ color: '#222', fontSize: '1em', marginBottom: 2 }}>{c.texto}</div>
              <div style={{ fontSize: '0.85em', color: '#888' }}>{c.fecha}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComentariosManager;
