import React, { useEffect, useState } from 'react';
import BACKEND_URL from '../../service/backend';

const BLOQUE_PERIODOS_ID = 2;

const PeriodosList = ({ onSelect }) => {
  const [periodos, setPeriodos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPeriodos = () => {
    setLoading(true);
    fetch(`${BACKEND_URL}/modulos/`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Filtrar solo los módulos de tipo PERIODO
          const periodoModulos = data.filter(modulo => modulo.tipo === 'PERIODO');
          setPeriodos(periodoModulos);
        } else {
          setPeriodos([]);
        }
      })
      .catch(() => setPeriodos([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPeriodos();
  }, []);

  const handleClick = (periodo) => {
    if (onSelect) {
      onSelect(periodo);
    }
  };

  if (loading) {
    return <div className="periodos-loading">Cargando períodos...</div>;
  }

  if (periodos.length === 0) {
    return <div className="periodos-empty">No hay períodos creados</div>;
  }

  return (
    <div className="periodos-list">
      {periodos.map((periodo) => (
        <div
          key={periodo.id}
          className="periodo-item"
          onClick={() => handleClick(periodo)}
        >
          <div className="periodo-name">{periodo.nombre}</div>
          <div className="periodo-type">{periodo.tipo}</div>
          <div className="periodo-date">
            {new Date(periodo.fecha_creacion).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PeriodosList;