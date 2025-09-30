// src/components/BarraInferior/BarraInferior.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './BarraInferior.module.css';

const BarraInferior = () => {
  const location = useLocation();
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>SISDOA</div>
      <ul className={styles.navLinks}>
        <li>
          <Link to="/proyectos" className={location.pathname.startsWith('/proyectos') ? styles.active : ''}>
            Proyectos
          </Link>
        </li>
        <li>
          <Link to="/periodos" className={location.pathname.startsWith('/periodos') ? styles.active : ''}>
            Periodos
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default BarraInferior;
