// carpetas.js
// Funciones relacionadas con la creación de carpetas en la base de datos

export async function guardarCarpetaEnBD(nombre, bloqueSeleccionado, idPadre = null) {
	if (!bloqueSeleccionado) return;
	try {
		await fetch('http://127.0.0.1:8000/carpetas', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				nombre: nombre,
				id_padre: idPadre,
				id_bloque: bloqueSeleccionado.id
			})
		});
	} catch (error) {
		console.error('Error al guardar la carpeta en la base de datos:', error);
	}
}
