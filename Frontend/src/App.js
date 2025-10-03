
import './App.css';
import React from 'react';
import { BrowserRouter, HashRouter, useLocation } from 'react-router-dom';
import Appbar from './components/appbar/appbar';
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
  // Detectar si estamos en una aplicación empaquetada (Electron)
  const isElectron = window.electron || navigator.userAgent.toLowerCase().includes('electron');
  
  // Usar HashRouter para aplicaciones empaquetadas, BrowserRouter para desarrollo web
  const Router = isElectron ? HashRouter : BrowserRouter;
  
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