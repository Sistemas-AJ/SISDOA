from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.db import get_db
from .bloquesPeriodoService import get_bloque_con_modulos
from .bloquesPeriodoSchema import BloqueOut

router = APIRouter(prefix="/bloques", tags=["bloques"])

@router.get("/{bloque_id}", response_model=BloqueOut)
def read_bloque(bloque_id: int, db: Session = Depends(get_db)):
    bloque = get_bloque_con_modulos(db, bloque_id)
    if not bloque:
        raise HTTPException(status_code=404, detail="Bloque no encontrado")
    return bloque
