import React, { useEffect, useState } from "react";
import BACKEND_URL from "../../service/backend";
import carpetaIcon from "../../assets/carpeta.png";
import "./PoyectosList.css";

const ID_BLOQUE_PROYECTO = 1; // Cambia este valor si tu id de bloque de proyectos es diferente

const ProyectosList = ({ onSelect }) => {
  const [proyectos, setProyectos] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/modulos/`)
      .then(res => res.json())
      .then(data => {
        // Filtra solo los proyectos
        const soloProyectos = data.filter(
          m => m.tipo === "PROYECTO" && m.id_bloque === ID_BLOQUE_PROYECTO
        );
        setProyectos(soloProyectos);
      });
  }, []);

  return (
    <div className="proyectos-list-wrapper">
      {proyectos.map(proy => (
        <div key={proy.id} className="proyecto-item" style={{ cursor: 'pointer' }}>
          <img src={carpetaIcon} alt="carpeta" className="proyecto-icon" onClick={() => onSelect && onSelect(proy)} />
          <span onClick={() => onSelect && onSelect(proy)}>{proy.nombre}</span>
        </div>
      ))}
    </div>
  );
};

export default ProyectosList;
