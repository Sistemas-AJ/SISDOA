// src/components/BarraInferior/BarraInferior.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './appbar.css';

const Appbar = () => {
  const location = useLocation();
  return (
    <nav className="navbar">
      <div className="logo">SISDOA</div>
      <ul className="navLinks">
        <li>
          <Link to="/proyectos" className={location.pathname.startsWith('/proyectos') ? 'active' : ''}>
            Proyectos
          </Link>
        </li>
        <li>
          <Link to="/periodos" className={location.pathname.startsWith('/periodos') ? 'active' : ''}>
            Periodos
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Appbar;
