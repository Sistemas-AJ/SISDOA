import React, { useState } from 'react';

// --- COMPONENTE MOVÍDO FUERA ---
// Es mejor definir los componentes en el nivel superior del módulo
// para evitar que se vuelvan a crear en cada renderizado del componente padre.
function UnificadoManager({ archivoId, etiquetas = [], comentarios = [], onEtiquetasChange, onNuevoComentario }) {
  const [inputEtiqueta, setInputEtiqueta] = useState("");
  const [inputComentario, setInputComentario] = useState("");
  const [usuario, setUsuario] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    let somethingWasAdded = false;

    // Lógica para agregar etiqueta
    const nuevaEtiqueta = inputEtiqueta.trim();
    if (nuevaEtiqueta && !etiquetas.includes(nuevaEtiqueta)) {
      onEtiquetasChange([...etiquetas, nuevaEtiqueta]);
      setInputEtiqueta("");
      somethingWasAdded = true;
    }

    // Lógica para agregar comentario
    if (inputComentario.trim() && usuario.trim()) {
      onNuevoComentario({
        usuario: usuario.trim(),
        texto: inputComentario.trim(),
        fecha: new Date().toISOString().slice(0, 10)
      });
      setInputComentario("");
      // Limpiamos el usuario también, ya que su comentario fue enviado
      setUsuario("");
      somethingWasAdded = true;
    }
  };

  return (
    <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 400 }}>
      {/* Sección de Etiquetas */}
      <div>
        <h4 style={{ margin: '0 0 10px 0', color: '#1565c0', fontWeight: 700, letterSpacing: 0.2 }}>Etiquetas</h4>
        <input
          value={inputEtiqueta}
          onChange={e => setInputEtiqueta(e.target.value)}
          placeholder="Agregar etiqueta"
          style={{ width: '100%', borderRadius: 8, border: '1.5px solid #90caf9', padding: '7px 12px', fontSize: '1em', background: '#f5faff', outline: 'none', transition: 'border 0.2s' }}
        />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', minHeight: 32, marginTop: 8 }}>
          {etiquetas.map((etiqueta) => (
            <span key={etiqueta} style={{ background: 'linear-gradient(90deg,#e3f2fd,#bbdefb)', borderRadius: 18, padding: '6px 16px', display: 'flex', alignItems: 'center', fontSize: '1em', fontWeight: 500, color: '#1976d2', boxShadow: '0 1px 4px #e3f2fd', transition: 'background 0.2s' }}>
              {etiqueta}
              <button
                type="button" // Evita que el botón envíe el formulario
                onClick={() => onEtiquetasChange(etiquetas.filter(e => e !== etiqueta))}
                style={{ marginLeft: 8, background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1em', transition: 'color 0.2s' }}
                title="Eliminar"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Sección de Comentarios */}
      <div>
        <h4 style={{ margin: '0 0 10px 0', color: '#1565c0', fontWeight: 700, letterSpacing: 0.2 }}>Comentarios</h4>
        <input
          value={usuario}
          onChange={e => setUsuario(e.target.value)}
          placeholder="Tu nombre"
          style={{ borderRadius: 8, border: '1.5px solid #90caf9', padding: '7px 12px', background: '#f5faff', fontSize: '1em', outline: 'none', transition: 'border 0.2s', width: '100%' }}
        />
        <textarea
          value={inputComentario}
          onChange={e => setInputComentario(e.target.value)}
          placeholder="Agregar comentario"
          style={{ borderRadius: 8, border: '1.5px solid #90caf9', padding: '7px 12px', fontSize: '1em', background: '#f5faff', outline: 'none', transition: 'border 0.2s', width: '100%', minHeight: 38, resize: 'vertical', marginTop: 6 }}
        />
      </div>

      <button type="submit" style={{ background: 'linear-gradient(90deg,#1976d2,#64b5f6)', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 22px', cursor: 'pointer', fontWeight: 600, fontSize: '1em', boxShadow: '0 1px 4px #90caf9', alignSelf: 'flex-end', marginTop: 8 }}>
        Añadir
      </button>

      {/* Lista de Comentarios */}
      <ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0, minHeight: 32 }}>
        {comentarios.map((c, idx) => ( // Usar un ID único del comentario como key sería ideal
          <li key={idx} style={{ marginBottom: 10, background: 'linear-gradient(90deg,#e3f2fd,#f9fafe)', borderRadius: 14, padding: '10px 14px', display: 'flex', alignItems: 'flex-start', gap: 10, boxShadow: '0 1px 4px #e3f2fd' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1976d2', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1em', marginRight: 6, flexShrink: 0 }}>
              {c.usuario?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: '#1976d2', marginBottom: 2 }}>{c.usuario || "Usuario"}</div>
              <div style={{ color: '#222', fontSize: '1em', marginBottom: 2 }}>{c.texto}</div>
              <div style={{ fontSize: '0.85em', color: '#888' }}>{c.fecha}</div>
            </div>
          </li>
        ))}
      </ul>
    </form>
  );
}

// Componente principal
const ArchivoDetallePlus = ({ abierto, archivoId, etiquetas, comentarios, onEtiquetasChange, onNuevoComentario }) => {
  return (
    <div>
      {/* ... aquí podría ir el contenido que se muestra siempre ... */}

      {abierto && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            padding: '22px 18px 18px 18px',
            background: '#f9fafe',
            borderBottomLeftRadius: 14,
            borderBottomRightRadius: 20,
            borderTop: 'none',
            minHeight: 50,
            width: '100%'
          }}
        >
          <UnificadoManager
            archivoId={archivoId}
            etiquetas={etiquetas}
            comentarios={comentarios}
            onEtiquetasChange={onEtiquetasChange}
            onNuevoComentario={onNuevoComentario}
          />
        </div>
      )}
    </div>
  );
};

export default ArchivoDetallePlus;