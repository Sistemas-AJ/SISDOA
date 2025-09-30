from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .metadatosModuloService import get_metadatos_modulo, create_metadato_modulo, update_metadato_modulo, delete_metadato_modulo
from .metadatosModuloSchema import MetadatoModuloCreate, MetadatoModuloUpdate, MetadatoModuloOut
from db.db import get_db

router = APIRouter(prefix="/metadatos_modulo", tags=["metadatos_modulo"])

@router.get("/{id_modulo}", response_model=list[MetadatoModuloOut])
def read_metadatos_modulo(id_modulo: int, db: Session = Depends(get_db)):
    return get_metadatos_modulo(db, id_modulo)

@router.post("/", response_model=MetadatoModuloOut)
def create_new_metadato_modulo(metadato: MetadatoModuloCreate, db: Session = Depends(get_db)):
    return create_metadato_modulo(db, metadato)

@router.put("/{metadato_id}", response_model=MetadatoModuloOut)
def update_existing_metadato_modulo(metadato_id: int, metadato: MetadatoModuloUpdate, db: Session = Depends(get_db)):
    updated = update_metadato_modulo(db, metadato_id, metadato)
    if not updated:
        raise HTTPException(status_code=404, detail="Metadato no encontrado")
    return updated

@router.delete("/{metadato_id}", response_model=MetadatoModuloOut)
def delete_existing_metadato_modulo(metadato_id: int, db: Session = Depends(get_db)):
    deleted = delete_metadato_modulo(db, metadato_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Metadato no encontrado")
    return deleted
