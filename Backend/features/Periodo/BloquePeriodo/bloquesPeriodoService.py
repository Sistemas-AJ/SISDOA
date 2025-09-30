
from sqlalchemy.orm import Session
from .bloquesPeriodoModel import Bloque

def get_bloques(db: Session):
	return db.query(Bloque).all()

