from sqlalchemy.orm import Session
from models.carpetasModel import Carpeta
from .carpetasPeriodoSchema import CarpetaCreate, CarpetaUpdate
from datetime import datetime

def get_carpetas(db: Session):
    return db.query(Carpeta).all()

def get_carpeta(db: Session, carpeta_id: int):
    return db.query(Carpeta).filter(Carpeta.id == carpeta_id).first()

def create_carpeta(db: Session, carpeta: CarpetaCreate):
    carpeta_dict = carpeta.dict()
    # Agregar fecha de creación si no está presente
    if 'fecha_creacion' not in carpeta_dict or not carpeta_dict['fecha_creacion']:
        carpeta_dict['fecha_creacion'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    db_carpeta = Carpeta(**carpeta_dict)
    db.add(db_carpeta)
    db.commit()
    db.refresh(db_carpeta)
    
    # Si id_padre es None (carpeta raíz), establecerlo como su propio id
    if db_carpeta.id_padre is None:
        db_carpeta.id_padre = db_carpeta.id
        db.commit()
        db.refresh(db_carpeta)
    
    return db_carpeta

def update_carpeta(db: Session, carpeta_id: int, carpeta: CarpetaUpdate):
    db_carpeta = db.query(Carpeta).filter(Carpeta.id == carpeta_id).first()
    if not db_carpeta:
        return None
    for key, value in carpeta.dict(exclude_unset=True).items():
        setattr(db_carpeta, key, value)
    db.commit()
    db.refresh(db_carpeta)
    return db_carpeta

def delete_carpeta(db: Session, carpeta_id: int):
    db_carpeta = db.query(Carpeta).filter(Carpeta.id == carpeta_id).first()
    if not db_carpeta:
        return None
    db.delete(db_carpeta)
    db.commit()
    return db_carpeta