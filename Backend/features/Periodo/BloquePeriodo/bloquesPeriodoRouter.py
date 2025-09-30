from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .bloquesPeriodoService import get_periodos, get_periodo, create_periodo, update_periodo, delete_periodo
from .bloquesPeriodoSchema import BloqueCreate, BloqueUpdate, BloqueOut
from db.db import get_db

router = APIRouter(prefix="/periodos", tags=["periodos"])

@router.get("/", response_model=list[BloqueOut])
def read_periodos(db: Session = Depends(get_db)):
    return get_periodos(db)

@router.get("/{periodo_id}", response_model=BloqueOut)
def read_periodo(periodo_id: int, db: Session = Depends(get_db)):
    periodo = get_periodo(db, periodo_id)
    if not periodo:
        raise HTTPException(status_code=404, detail="Periodo no encontrado")
    return periodo

@router.post("/", response_model=BloqueOut)
def create_new_periodo(periodo: BloqueCreate, db: Session = Depends(get_db)):
    return create_periodo(db, periodo)

@router.put("/{periodo_id}", response_model=BloqueOut)
def update_existing_periodo(periodo_id: int, periodo: BloqueUpdate, db: Session = Depends(get_db)):
    updated = update_periodo(db, periodo_id, periodo)
    if not updated:
        raise HTTPException(status_code=404, detail="Periodo no encontrado")
    return updated

@router.delete("/{periodo_id}", response_model=BloqueOut)
def delete_existing_periodo(periodo_id: int, db: Session = Depends(get_db)):
    deleted = delete_periodo(db, periodo_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Periodo no encontrado")
    return deleted
