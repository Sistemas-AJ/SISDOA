from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .moduloService import get_modulos, get_modulo, create_modulo, update_modulo, delete_modulo
from .moduloSchema import ModuloCreate, ModuloUpdate, ModuloOut
from db.db import get_db

router = APIRouter(prefix="/modulos", tags=["modulos"])

@router.get("/", response_model=list[ModuloOut])
def read_modulos(db: Session = Depends(get_db)):
    return get_modulos(db)

@router.get("/{modulo_id}", response_model=ModuloOut)
def read_modulo(modulo_id: int, db: Session = Depends(get_db)):
    modulo = get_modulo(db, modulo_id)
    if not modulo:
        raise HTTPException(status_code=404, detail="Módulo no encontrado")
    return modulo

@router.post("/", response_model=ModuloOut)
def create_new_modulo(modulo: ModuloCreate, db: Session = Depends(get_db)):
    return create_modulo(db, modulo)

@router.put("/{modulo_id}", response_model=ModuloOut)
def update_existing_modulo(modulo_id: int, modulo: ModuloUpdate, db: Session = Depends(get_db)):
    updated = update_modulo(db, modulo_id, modulo)
    if not updated:
        raise HTTPException(status_code=404, detail="Módulo no encontrado")
    return updated

@router.delete("/{modulo_id}", response_model=ModuloOut)
def delete_existing_modulo(modulo_id: int, db: Session = Depends(get_db)):
    deleted = delete_modulo(db, modulo_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Módulo no encontrado")
    return deleted
