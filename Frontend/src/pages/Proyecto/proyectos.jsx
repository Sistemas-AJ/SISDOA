import React from 'react';
// Asegúrate de que la ruta sea correcta
import ProyectosSlidebar from './ProyectosSlidebar';

function Proyectos() {
  // El estado `selectedProyecto` y la lógica ahora están dentro de `ProyectosSlidebar`
  // por lo que este componente se vuelve más simple.
  return (
    <>
      <ProyectosSlidebar />
    </>
  );
}

export default Proyectos;