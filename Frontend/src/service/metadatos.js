import BACKEND_URL from './backend';

export async function fetchMetadatos(documentoId) {
  const response = await fetch(`${BACKEND_URL}/metadatos/documento/${documentoId}`);
  if (!response.ok) return [];
  const data = await response.json();
  return data.metadatos || [];
}

export async function getEtiquetaFromMetadatos(documentoId) {
  const metadatos = await fetchMetadatos(documentoId);
  const etiqueta = metadatos.find(m => m.clave === 'etiqueta');
  return etiqueta ? etiqueta.valor : '';
}
