from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.db import get_db
from .carpetasService import (
    get_carpetas, get_carpeta, create_carpeta, update_carpeta, delete_carpeta
)
from .carpetasPeriodoSchema import CarpetaCreate, CarpetaUpdate, CarpetaOut

router = APIRouter(prefix="/carpetas", tags=["Carpetas"])

@router.get("/", response_model=list[CarpetaOut])
def listar_carpetas(db: Session = Depends(get_db)):
    return get_carpetas(db)

@router.get("/{carpeta_id}", response_model=CarpetaOut)
def obtener_carpeta(carpeta_id: int, db: Session = Depends(get_db)):
    carpeta = get_carpeta(db, carpeta_id)
    if not carpeta:
        raise HTTPException(status_code=404, detail="Carpeta no encontrada")
    return carpeta

@router.post("/", response_model=CarpetaOut)
def crear_carpeta(carpeta: CarpetaCreate, db: Session = Depends(get_db)):
    return create_carpeta(db, carpeta)

@router.put("/{carpeta_id}", response_model=CarpetaOut)
def actualizar_carpeta(carpeta_id: int, carpeta: CarpetaUpdate, db: Session = Depends(get_db)):
    carpeta_db = update_carpeta(db, carpeta_id, carpeta)
    if not carpeta_db:
        raise HTTPException(status_code=404, detail="Carpeta no encontrada")
    return carpeta_db

@router.delete("/{carpeta_id}", response_model=CarpetaOut)
def eliminar_carpeta(carpeta_id: int, db: Session = Depends(get_db)):
    carpeta_db = delete_carpeta(db, carpeta_id)
    if not carpeta_db:
        raise HTTPException(status_code=404, detail="Carpeta no encontrada")
    return carpeta_db