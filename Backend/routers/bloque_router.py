from fastapi import APIRouter, HTTPException
from models.bloque import BloqueCreate
from service.bloque_service import listar_bloques_service, crear_bloque_service, inicializar_bloques_unicos

router = APIRouter()

@router.get("/modulos")
def listar_bloques():
    return listar_bloques_service()

@router.post("/modulos")
def crear_bloque(bloque: BloqueCreate):
    return crear_bloque_service(bloque)
