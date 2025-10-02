
import './App.css';
import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Appbar from './components/AppBar/appbar';
import { NotificationProvider } from './contexts/NotificationContext';
import Periodos from './pages/Periodo/periodos';
import PeriodosSlidebar from './pages/Periodo/PeriodosSlidebar';
import Proyectos from './pages/Proyecto/proyectos';
import Bienvenida from './components/Bienvenida';
function AppRoutes() {
  const location = useLocation();
  const isProyectos = location.pathname.startsWith('/proyectos');
  const isPeriodos = location.pathname.startsWith('/periodos');
  return (
    <>
      {isProyectos ? (
        <Proyectos />
      ) : isPeriodos ? (
        <>
          <PeriodosSlidebar />
          <Periodos />
        </>
      ) : (
        <Bienvenida />
      )}
    </>
  );
}

function App() {
  return (
    <NotificationProvider>
      <Router>
        <Appbar />
        <AppRoutes />
      </Router>
    </NotificationProvider>
  );
}

export default App;