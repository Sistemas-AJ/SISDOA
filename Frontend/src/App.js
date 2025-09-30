import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BarraInferior from './components/BarraInferior/BarraInferior';
import Slidebar from './components/Slidebar/Slidebar'; // <-- AGREGA ESTA LÍNEA

function App() {
  return (
    <Router>
      <BarraInferior />
      <Slidebar />
    </Router>
  );
}

export default App;
