import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Appbar from './components/appbar/appbar';

import Periodos from './pages/Periodo/periodos';
import PeriodosSlidebar from './pages/Periodo/PeriodosSlidebar';
import Proyectos from './pages/Proyecto/proyectos';
// No es necesario importar ProyectosSlidebar aquí si Proyectos ya lo maneja

function App() {
  return (
    <Router>
      <Appbar />
      <Routes>
        <Route path="/periodos" element={
          <>
            <PeriodosSlidebar />
            <Periodos /> 
          </>
        } />
        <Route 
          path="/proyectos" 
          // Renderiza SOLO el componente de la página 'Proyectos'
          element={<Proyectos />} 
        />
      </Routes>
    </Router>
  );
}

export default App;