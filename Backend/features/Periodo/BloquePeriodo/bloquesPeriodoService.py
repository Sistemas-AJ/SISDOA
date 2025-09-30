<<<<<<< HEAD
from sqlalchemy.orm import Session
from .bloquesPeriodoModel import Bloque
from .bloquesPeriodoSchema import BloqueCreate, BloqueUpdate

def get_periodos(db: Session):
    return db.query(Bloque).filter(Bloque.tipo == "periodo").all()

def get_periodo(db: Session, periodo_id: int):
    return db.query(Bloque).filter(Bloque.id == periodo_id, Bloque.tipo == "periodo").first()

def create_periodo(db: Session, periodo: BloqueCreate):
    # Solo puede haber un bloque de tipo 'periodo'
    existe = db.query(Bloque).filter(Bloque.tipo == "periodo").first()
    if existe:
        raise Exception("Ya existe un bloque periodo raíz. Solo puede haber uno.")
    db_periodo = Bloque(nombre=periodo.nombre, descripcion=periodo.descripcion, tipo="periodo")
    db.add(db_periodo)
    db.commit()
    db.refresh(db_periodo)
    return db_periodo

def update_periodo(db: Session, periodo_id: int, periodo: BloqueUpdate):
    db_periodo = get_periodo(db, periodo_id)
    if db_periodo:
        db_periodo.nombre = periodo.nombre
        db_periodo.descripcion = periodo.descripcion
        db.commit()
        db.refresh(db_periodo)
    return db_periodo

def delete_periodo(db: Session, periodo_id: int):
    db_periodo = get_periodo(db, periodo_id)
    if db_periodo:
        db.delete(db_periodo)
        db.commit()
    return db_periodo
=======

from sqlalchemy.orm import Session
from .bloquesPeriodoModel import Bloque

def get_bloques(db: Session):
	return db.query(Bloque).all()

>>>>>>> d3d78c15176965c29d19b45ce8b5a63588cd5615
