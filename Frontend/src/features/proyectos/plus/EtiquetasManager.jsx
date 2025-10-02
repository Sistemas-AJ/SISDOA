import React, { useState } from "react";

const EtiquetasManager = ({ archivoId, etiquetas = [], onEtiquetasChange }) => {
  const [input, setInput] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    const nueva = input.trim();
    if (nueva && !etiquetas.includes(nueva)) {
      onEtiquetasChange && onEtiquetasChange([...etiquetas, nueva]);
      setInput("");
    }
  };
  const handleRemove = (et) => {
    onEtiquetasChange && onEtiquetasChange(etiquetas.filter(e => e !== et));
  };
  return (
    <div>
      <h4 style={{ margin: '0 0 10px 0', color: '#1565c0', fontWeight: 700, letterSpacing: 0.2 }}>Etiquetas</h4>
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, marginBottom: 12, maxWidth: 400 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Agregar etiqueta"
          style={{ flex: 1, borderRadius: 8, border: '1.5px solid #90caf9', padding: '7px 12px', fontSize: '1em', background: '#f5faff', outline: 'none', transition: 'border 0.2s' }}
        />
        <button
          type="submit"
          style={{
            background: 'linear-gradient(90deg,#1976d2,#64b5f6)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '7px 22px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '1em',
            boxShadow: '0 1px 4px #90caf9',
            transition: 'background 0.2s'
          }}
        >
          Añadir
        </button>
      </form>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', minHeight: 32 }}>
        {etiquetas.map((et, idx) => (
          <span key={idx} style={{ background: 'linear-gradient(90deg,#e3f2fd,#bbdefb)', borderRadius: 18, padding: '6px 16px', display: 'flex', alignItems: 'center', fontSize: '1em', fontWeight: 500, color: '#1976d2', boxShadow: '0 1px 4px #e3f2fd', transition: 'background 0.2s' }}>
            {et}
            <button onClick={() => handleRemove(et)} style={{ marginLeft: 8, background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1em', transition: 'color 0.2s' }} title="Eliminar">×</button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default EtiquetasManager;
