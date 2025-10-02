from fastapi import APIRouter, HTTPException
from .MetadatosDocScheam import MetadatosList
from .MetadatosDocService import guardar_metadatos_documento, obtener_metadatos_documento

router = APIRouter()

@router.post("/metadatos/documento/{id_documento}")
async def agregar_metadatos_documento(id_documento: int, metadatos: MetadatosList):
	try:
		guardar_metadatos_documento(id_documento, metadatos.metadatos)
		return {"mensaje": "Metadatos guardados correctamente"}
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))


# Nuevo endpoint GET para obtener metadatos de un documento
@router.get("/metadatos/documento/{id_documento}")
async def get_metadatos_documento(id_documento: int):
    try:
        metadatos = obtener_metadatos_documento(id_documento)
        return {"metadatos": metadatos}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
