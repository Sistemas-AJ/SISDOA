from sqlalchemy.orm import Session
from .moduloModel import Modulo
from .moduloSchema import ModuloCreate, ModuloUpdate

def get_modulos(db: Session):
    return db.query(Modulo).all()

def get_modulo(db: Session, modulo_id: int):
    return db.query(Modulo).filter(Modulo.id == modulo_id).first()

def create_modulo(db: Session, modulo: ModuloCreate):
    db_modulo = Modulo(**modulo.dict())
    db.add(db_modulo)
    db.commit()
    db.refresh(db_modulo)
    return db_modulo

def update_modulo(db: Session, modulo_id: int, modulo: ModuloUpdate):
    db_modulo = get_modulo(db, modulo_id)
    if db_modulo:
        db_modulo.nombre = modulo.nombre
        db_modulo.tipo = modulo.tipo
        db.commit()
        db.refresh(db_modulo)
    return db_modulo

def delete_modulo(db: Session, modulo_id: int):
    db_modulo = get_modulo(db, modulo_id)
    if db_modulo:
        db.delete(db_modulo)
        db.commit()
    return db_modulo
