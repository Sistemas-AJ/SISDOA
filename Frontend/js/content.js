// content.js
// Funciones relacionadas con la carga y visualización del contenido principal

export async function loadContentBloqueCarpeta(carpetaId, bloqueSeleccionado) {
	const fileList = document.getElementById('file-list');
	const breadcrumb = document.getElementById('breadcrumb');
	if (!fileList) return;
	fileList.innerHTML = '';
	breadcrumb.innerHTML = '';
	let ruta = [];
	let actual = carpetaId;
	let carpetasTodas = [];
	try {
		const res = await fetch('http://127.0.0.1:8000/carpetas');
		carpetasTodas = await res.json();
	} catch (e) {}
	while (actual) {
		const carpeta = carpetasTodas.find(c => c.id === actual);
		if (carpeta) {
			ruta.unshift(carpeta.nombre);
			actual = carpeta.id_padre;
		} else {
			break;
		}
	}
	if (bloqueSeleccionado) {
		ruta.unshift(bloqueSeleccionado.nombre);
	}
	ruta.forEach((nombre, idx) => {
		const crumb = document.createElement('span');
		crumb.textContent = nombre;
		crumb.className = 'breadcrumb-item';
		breadcrumb.appendChild(crumb);
	});
	const subcarpetas = carpetasTodas.filter(c => c.id_padre === carpetaId);
	if (subcarpetas.length === 0) {
		fileList.innerHTML = '<p>No hay subcarpetas en esta carpeta.</p>';
	} else {
		subcarpetas.forEach(carpeta => {
			const card = document.createElement('div');
			card.className = 'file-card';
			card.innerHTML = `
				<div class="folder-icon">📁</div>
				<div class="folder-name">${carpeta.nombre}</div>
			`;
			card.addEventListener('click', () => {
				loadContentBloqueCarpeta(carpeta.id, bloqueSeleccionado);
			});
			fileList.appendChild(card);
		});
	}
}
