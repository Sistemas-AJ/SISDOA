from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.db import get_db
from .bloquesPeriodoService import get_bloques
from .bloquesPeriodoSchema import BloqueOut

router = APIRouter(prefix="/bloques", tags=["bloques"])

@router.get("/", response_model=list[BloqueOut])
def read_bloques(db: Session = Depends(get_db)):
    return get_bloques(db)
