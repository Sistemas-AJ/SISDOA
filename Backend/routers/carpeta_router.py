from fastapi import APIRouter, HTTPException
from models.carpeta import CarpetaCreate
from service.carpeta_service import listar_carpetas_service, crear_carpeta_service

router = APIRouter()

@router.get("/carpetas")
def listar_carpetas():
    return listar_carpetas_service()

@router.post("/carpetas")
def crear_carpeta(carpeta: CarpetaCreate):
    return crear_carpeta_service(carpeta)
