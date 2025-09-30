// sidebar.js
// Funciones relacionadas con la carga y navegación del sidebar

let carpetaActualSidebar = null;

export async function loadSidebar(bloqueSeleccionado, carpetaPadreId = null, onCarpetaClick) {
	const folderList = document.getElementById('folder-list');
	if (!folderList) return;
	folderList.innerHTML = '';
	let bloqueActivo = bloqueSeleccionado;
	if (!bloqueActivo) {
		try {
			const res = await fetch('http://127.0.0.1:8000/modulos');
			const bloques = await res.json();
			bloqueActivo = bloques.find(b => b.tipo === 'PROYECTO') || bloques.find(b => b.tipo === 'PERIODO');
		} catch (e) {
			folderList.innerHTML = '<li>Error al cargar bloque</li>';
			return;
		}
	}
	if (!bloqueActivo) {
		folderList.innerHTML = '<li>No hay bloque activo</li>';
		return;
	}
	try {
		const res = await fetch('http://127.0.0.1:8000/carpetas');
		const carpetas = await res.json();
		let carpetasSidebar;
		if (carpetaPadreId) {
			carpetasSidebar = carpetas.filter(c => c.id_padre === carpetaPadreId);
		} else {
			carpetasSidebar = carpetas.filter(c => c.id_bloque === bloqueActivo.id && c.id_padre == null);
		}
		if (carpetasSidebar.length === 0) {
			folderList.innerHTML = '<li>No hay carpetas</li>';
		} else {
			carpetasSidebar.forEach((carpeta, idx) => {
				const li = document.createElement('li');
				li.textContent = carpeta.nombre;
				if (idx === 0) li.classList.add('active');
				li.addEventListener('click', () => {
					carpetaActualSidebar = carpeta;
					if (onCarpetaClick) onCarpetaClick(carpeta);
				});
				folderList.appendChild(li);
			});
		}
	} catch (e) {
		folderList.innerHTML = '<li>Error al cargar carpetas</li>';
	}
}

export function getCarpetaActualSidebar() {
	return carpetaActualSidebar;
}
