import React from 'react';

function Bienvenida() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      height: 'calc(100vh - 56px)', background: 'linear-gradient(120deg, #f7faff 60%, #e3eafc 100%)',
      padding: 0, margin: 0
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 4px 32px rgba(25, 118, 210, 0.08)',
        padding: '48px 36px 36px 36px',
        maxWidth: 480,
        textAlign: 'center',
        marginTop: -40
      }}>
        <div style={{ fontSize: 54, color: '#1976d2', marginBottom: 12 }}>👋</div>
        <h1 style={{ color: '#1976d2', fontWeight: 800, fontSize: 32, marginBottom: 10, letterSpacing: 1 }}>Bienvenido a SISDOA</h1>
        <p style={{ color: '#444', fontSize: 18, marginBottom: 18, fontWeight: 500 }}>
          Tu sistema inteligente para la gestión de documentos, proyectos y periodos.<br/>
        </p>
        <p style={{ color: '#666', fontSize: 15.5, marginBottom: 0, lineHeight: 1.7 }}>
          SISDOA te permite organizar, buscar y compartir información de manera eficiente y segura.<br/>
          Selecciona <b>Proyectos</b> o <b>Periodos</b> en el menú superior para comenzar a trabajar.
        </p>
      </div>
    </div>
  );
}

export default Bienvenida;
