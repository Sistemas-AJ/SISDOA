// bloques.js
// Funciones relacionadas con la gestión y selección de bloques

export async function obtenerBloques() {
	const res = await fetch('http://127.0.0.1:8000/modulos');
	return await res.json();
}

export function actualizarIndicadorBloque(bloqueSeleccionado) {
	const indicador = document.getElementById('bloque-indicador');
	if (!indicador) return;
	if (bloqueSeleccionado) {
		if (bloqueSeleccionado.tipo === 'PROYECTO') {
			indicador.textContent = 'Estás en: PROYECTOS';
		} else if (bloqueSeleccionado.tipo === 'PERIODO') {
			indicador.textContent = 'Estás en: PERIODOS';
		} else {
			indicador.textContent = '';
		}
	} else {
		indicador.textContent = '';
	}
}
