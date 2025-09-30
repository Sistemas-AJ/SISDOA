import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BarraInferior from './components/BarraInferior/BarraInferior';

function App() {
  return (
    <Router>
      <BarraInferior />
      {/* Aquí puedes agregar tus rutas principales */}
      <div className="App">
        <header className="App-header">
          <code>hola mundo</code>
        </header>
      </div>
    </Router>
  );
}

export default App;
