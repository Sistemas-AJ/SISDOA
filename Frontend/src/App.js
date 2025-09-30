import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import BarraInferior from './components/BarraInferior/BarraInferior';

import Periodos from './pages/Periodo/periodos';
import PeriodosSlidebar from './pages/Periodo/PeriodosSlidebar';
import Proyectos from './pages/Proyecto/proyectos';
import ProyectosSlidebar from './pages/Proyecto/ProyectosSlidebar';


function App() {
  return (
    <Router>
      <BarraInferior />
      <Routes>
        <Route path="/periodos" element={
          <>
            <PeriodosSlidebar />
            <Periodos />
          </>
        } />
        <Route path="/proyectos" element={
          <>
            <ProyectosSlidebar />
            <Proyectos />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
