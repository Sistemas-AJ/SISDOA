import { getEtiquetaFromMetadatos } from './metadatos';

export async function debugEtiqueta(documentoId) {
  const etiqueta = await getEtiquetaFromMetadatos(documentoId);
  console.log('Etiqueta para documento', documentoId, ':', etiqueta);
  return etiqueta;
}
