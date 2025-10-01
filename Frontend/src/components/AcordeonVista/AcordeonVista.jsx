import React, { useState, useRef, useEffect } from 'react';

const AcordeonVista = ({ modoVista, onModoVistaChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const modos = [
    { 
      id: 'iconos-grandes', 
      nombre: 'Iconos Extra Grandes', 
      icono: '🔳'
    },
    { 
      id: 'iconos-medianos', 
      nombre: 'Iconos Grandes', 
      icono: '⬜'
    },
    { 
      id: 'iconos-pequenos', 
      nombre: 'Iconos Medianos', 
      icono: '▫️'
    },
    { 
      id: 'detalles', 
      nombre: 'Detalles', 
      icono: '📋'
    },
    { 
      id: 'mosaicos', 
      nombre: 'Mosaicos', 
      icono: '🎛️'
    },
    { 
      id: 'contenido', 
      nombre: 'Contenido', 
      icono: '📄'
    },
    { 
      id: 'lista-carpetas', 
      nombre: 'Lista', 
      icono: '📝'
    }
  ];

  const modoActual = modos.find(modo => modo.id === modoVista) || modos[0];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleModoSelect = (modoId) => {
    onModoVistaChange(modoId);
    setIsOpen(false); // Cerrar menú inmediatamente como Windows Explorer
  };

  // Cerrar menú al hacer clic fuera (como Windows Explorer)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const menuContainerStyle = {
    position: 'relative',
    display: 'inline-block'
  };

  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '3px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    color: '#333',
    minWidth: '140px',
    justifyContent: 'space-between',
    userSelect: 'none',
    transition: 'all 0.1s',
    boxShadow: isOpen ? 'inset 1px 1px 2px rgba(0,0,0,0.1)' : 'none',
    backgroundColor: isOpen ? '#e1e1e1' : 'white'
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderTop: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    zIndex: 1000,
    display: isOpen ? 'block' : 'none'
  };

  const itemStyle = {
    padding: '6px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    color: '#333',
    transition: 'background-color 0.1s',
    position: 'relative'
  };

  const activeItemStyle = {
    ...itemStyle,
    backgroundColor: '#0078d4',
    color: 'white'
  };

  return (
    <div ref={menuRef} style={menuContainerStyle}>
      {/* Botón principal tipo Windows Explorer */}
      <div 
        style={buttonStyle}
        onClick={toggleMenu}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = '#f0f0f0';
            e.currentTarget.style.borderColor = '#999';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.borderColor = '#ccc';
          }
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '14px' }}>{modoActual.icono}</span>
          <span>{modoActual.nombre}</span>
        </div>
        
        <span style={{ 
          fontSize: '10px', 
          color: '#666',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.1s'
        }}>
          ▼
        </span>
      </div>

      {/* Menú desplegable tipo Windows Explorer */}
      <div style={dropdownStyle}>
        {modos.map((modo) => (
          <div
            key={modo.id}
            style={modo.id === modoVista ? activeItemStyle : itemStyle}
            onClick={() => handleModoSelect(modo.id)}
            onMouseEnter={(e) => {
              if (modo.id !== modoVista) {
                e.currentTarget.style.backgroundColor = '#e5f3ff';
              }
            }}
            onMouseLeave={(e) => {
              if (modo.id !== modoVista) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span style={{ fontSize: '14px', width: '16px' }}>{modo.icono}</span>
            <span>{modo.nombre}</span>
            
            {modo.id === modoVista && (
              <div style={{
                position: 'absolute',
                left: '2px',
                width: '2px',
                height: '100%',
                backgroundColor: '#0078d4',
                top: 0
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcordeonVista;