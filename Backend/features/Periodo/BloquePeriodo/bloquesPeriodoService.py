from sqlalchemy.orm import Session
from .bloquesPeriodoModel import Bloque

def get_bloques(db: Session):
	return db.query(Bloque).all()

def get_bloque_con_modulos(db: Session, bloque_id: int):
    return db.query(Bloque).filter(Bloque.id == bloque_id).first()

