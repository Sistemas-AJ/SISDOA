from sqlalchemy.orm import Session
from .moduloModel import Modulo, MetadatoModulo
from .moduloSchema import ModuloCreate, MetadatoModuloIn

def get_modulos(db: Session):
    return db.query(Modulo).all()

def get_modulo(db: Session, modulo_id: int):
    return db.query(Modulo).filter(Modulo.id == modulo_id).first()

def create_modulo(db: Session, modulo: ModuloCreate):
    metadatos = modulo.metadatos or []
    modulo_data = modulo.dict(exclude={"metadatos"})
    db_modulo = Modulo(**modulo_data)
    db.add(db_modulo)
    db.commit()
    db.refresh(db_modulo)

    for metadato in metadatos:
        db_metadato = MetadatoModulo(id_modulo=db_modulo.id, clave=metadato.clave, valor=metadato.valor)
        db.add(db_metadato)
    if metadatos:
        db.commit()

    return db_modulo

def update_modulo(db: Session, modulo_id: int, modulo: ModuloCreate):
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