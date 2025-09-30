import { loadSidebar, getCarpetaActualSidebar } from './sidebar.js';
import { loadContentBloqueCarpeta } from './content.js';
import { obtenerBloques, actualizarIndicadorBloque } from './bloques.js';
import { guardarCarpetaEnBD } from './carpetas.js';

// Inicialización principal del frontend
window.addEventListener('DOMContentLoaded', async () => {
  let bloqueSeleccionado = null;
  const bloques = await obtenerBloques();
  bloqueSeleccionado = bloques.find(b => b.tipo === 'PROYECTO') || bloques.find(b => b.tipo === 'PERIODO');
  await loadSidebar(bloqueSeleccionado, null, (carpeta) => {
    loadSidebar(bloqueSeleccionado, carpeta.id, () => {});
    loadContentBloqueCarpeta(carpeta.id, bloqueSeleccionado);
  });
  actualizarIndicadorBloque(bloqueSeleccionado);

  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', async () => {
      await loadSidebar(bloqueSeleccionado, null, (carpeta) => {
        loadSidebar(bloqueSeleccionado, carpeta.id, () => {});
        loadContentBloqueCarpeta(carpeta.id, bloqueSeleccionado);
      });
      loadContentBloqueCarpeta(null, bloqueSeleccionado);
      actualizarIndicadorBloque(bloqueSeleccionado);
    });
  }

  const btnProyectos = document.getElementById('btn-proyectos');
  const btnPeriodos = document.getElementById('btn-periodos');
  if (btnProyectos) {
    btnProyectos.addEventListener('click', async () => {
      const bloques = await obtenerBloques();
      const proyecto = bloques.find(b => b.tipo === 'PROYECTO');
      if (proyecto) {
        bloqueSeleccionado = proyecto;
        await loadSidebar(bloqueSeleccionado, null, (carpeta) => {
          loadSidebar(bloqueSeleccionado, carpeta.id, () => {});
          loadContentBloqueCarpeta(carpeta.id, bloqueSeleccionado);
        });
        loadContentBloqueCarpeta(null, bloqueSeleccionado);
        actualizarIndicadorBloque(bloqueSeleccionado);
      }
    });
  }
  if (btnPeriodos) {
    btnPeriodos.addEventListener('click', async () => {
      const bloques = await obtenerBloques();
      const periodo = bloques.find(b => b.tipo === 'PERIODO');
      if (periodo) {
        bloqueSeleccionado = periodo;
        await loadSidebar(bloqueSeleccionado, null, (carpeta) => {
          loadSidebar(bloqueSeleccionado, carpeta.id, () => {});
          loadContentBloqueCarpeta(carpeta.id, bloqueSeleccionado);
        });
        loadContentBloqueCarpeta(null, bloqueSeleccionado);
        actualizarIndicadorBloque(bloqueSeleccionado);
      }
    });
  }

  const formCarpeta = document.getElementById('form-carpeta');
  if (formCarpeta) {
    formCarpeta.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nombreInput = document.getElementById('nombre-carpeta');
      const nombre = nombreInput.value.trim();
      if (!nombre || !bloqueSeleccionado) return;
      if (window.require) {
        try {
          const fsNode = window.require('fs');
          const pathNode = window.require('path');
          let parentFolder;
          const carpetaActualSidebar = getCarpetaActualSidebar();
          if (carpetaActualSidebar) {
            parentFolder = pathNode.join(__dirname, '..', bloqueSeleccionado.nombre, carpetaActualSidebar.nombre);
          } else {
            parentFolder = pathNode.join(__dirname, '..', bloqueSeleccionado.nombre);
          }
          if (!fsNode.existsSync(parentFolder)) {
            fsNode.mkdirSync(parentFolder);
          }
          const absPath = pathNode.join(parentFolder, nombre);
          if (!fsNode.existsSync(absPath)) {
            fsNode.mkdirSync(absPath);
            await guardarCarpetaEnBD(nombre, bloqueSeleccionado, carpetaActualSidebar ? carpetaActualSidebar.id : null);
            await loadSidebar(bloqueSeleccionado, carpetaActualSidebar ? carpetaActualSidebar.id : null, (carpeta) => {
              loadSidebar(bloqueSeleccionado, carpeta.id, () => {});
              loadContentBloqueCarpeta(carpeta.id, bloqueSeleccionado);
            });
            await loadContentBloqueCarpeta(carpetaActualSidebar ? carpetaActualSidebar.id : null, bloqueSeleccionado);
            nombreInput.value = '';
            actualizarIndicadorBloque(bloqueSeleccionado);
          }
        } catch (err) {
          alert('Error al crear carpeta: ' + err.message);
        }
      }
    });
  }
});