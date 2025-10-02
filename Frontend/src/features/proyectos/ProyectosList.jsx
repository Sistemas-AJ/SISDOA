import React, { useState } from "react";
import carpetaIcon from "../../assets/carpeta.png";
import ContextMenuProyecto from "./ContextMenuProyecto";
import "./PoyectosList.css";


const ProyectosList = ({ proyectos = [], onSelect, onVerDetalle, onEditar, onEliminar }) => {
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, proyecto: null });

  const handleContextMenu = (e, proy) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, proyecto: proy });
  };

  const closeContextMenu = () => setContextMenu({ visible: false, x: 0, y: 0, proyecto: null });

  return (
    <div className="proyectos-list-wrapper">
      <div className="proyectos-mosaico">
        {proyectos.map(proy => (
          <div
            key={proy.id}
            className="proyecto-mosaico-item"
            style={{ cursor: 'pointer' }}
            onContextMenu={e => handleContextMenu(e, proy)}
            onClick={() => onSelect && onSelect(proy)}
          >
            <img src={carpetaIcon} alt="carpeta" className="proyecto-mosaico-icon" />
            <span className="proyecto-mosaico-nombre">{proy.nombre}</span>
          </div>
        ))}
      </div>
      <ContextMenuProyecto
        x={contextMenu.x}
        y={contextMenu.y}
        visible={contextMenu.visible}
        onClose={closeContextMenu}
        onVer={() => onVerDetalle && onVerDetalle(contextMenu.proyecto)}
        onEditar={() => onEditar && onEditar(contextMenu.proyecto)}
        onEliminar={() => onEliminar && onEliminar(contextMenu.proyecto)}
      />
    </div>
  );
};

export default ProyectosList;
