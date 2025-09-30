from sqlalchemy.orm import Session
from .metadatosModuloModel import MetadatoModulo
from .metadatosModuloSchema import MetadatoModuloCreate, MetadatoModuloUpdate

def get_metadatos_modulo(db: Session, id_modulo: int):
    return db.query(MetadatoModulo).filter(MetadatoModulo.id_modulo == id_modulo).all()

def create_metadato_modulo(db: Session, metadato: MetadatoModuloCreate):
    db_metadato = MetadatoModulo(**metadato.dict())
    db.add(db_metadato)
    db.commit()
    db.refresh(db_metadato)
    return db_metadato

def update_metadato_modulo(db: Session, metadato_id: int, metadato: MetadatoModuloUpdate):
    db_metadato = db.query(MetadatoModulo).filter(MetadatoModulo.id == metadato_id).first()
    if db_metadato:
        db_metadato.clave = metadato.clave
        db_metadato.valor = metadato.valor
        db.commit()
        db.refresh(db_metadato)
    return db_metadato

def delete_metadato_modulo(db: Session, metadato_id: int):
    db_metadato = db.query(MetadatoModulo).filter(MetadatoModulo.id == metadato_id).first()
    if db_metadato:
        db.delete(db_metadato)
        db.commit()
    return db_metadato
