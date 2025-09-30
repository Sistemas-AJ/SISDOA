import React from 'react';
import { Route } from 'react-router-dom'; // <-- Agrega esto si usas <Route>
import BarraInferior from '../../components/BarraInferior/BarraInferior';
import Slidebar from '../../components/Slidebar/Slidebar';

function periodos() {
  return (
    <>
      <BarraInferior />
      <Slidebar />
    </>
  );
}

export default periodos;