from sqlalchemy.orm import Session
from models.documentsModel import Documento
from .documentoSchema import DocumentoCreate, DocumentoUpdate
from datetime import datetime
import os

def get_documentos(db: Session):
    return db.query(Documento).all()

def get_documentos_por_carpeta(db: Session, carpeta_id: int):
    return db.query(Documento).filter(Documento.id_carpeta == carpeta_id).all()

def get_documento(db: Session, documento_id: int):
    return db.query(Documento).filter(Documento.id == documento_id).first()

def create_documento(db: Session, documento: DocumentoCreate):
    documento_dict = documento.dict()
    # Agregar fecha de creación si no está presente
    if 'fecha_creacion' not in documento_dict or not documento_dict['fecha_creacion']:
        documento_dict['fecha_creacion'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    db_documento = Documento(**documento_dict)
    db.add(db_documento)
    db.commit()
    db.refresh(db_documento)
    return db_documento

def update_documento(db: Session, documento_id: int, documento: DocumentoUpdate):
    db_documento = db.query(Documento).filter(Documento.id == documento_id).first()
    if not db_documento:
        return None
    
    # Actualizar fecha de modificación
    documento_dict = documento.dict(exclude_unset=True)
    documento_dict['fecha_modificacion'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    for key, value in documento_dict.items():
        setattr(db_documento, key, value)
    
    db.commit()
    db.refresh(db_documento)
    return db_documento

def delete_documento(db: Session, documento_id: int):
    db_documento = db.query(Documento).filter(Documento.id == documento_id).first()
    if not db_documento:
        return None
    
    # Eliminar archivo físico si existe
    try:
        if os.path.exists(db_documento.ruta_fisica):
            os.remove(db_documento.ruta_fisica)
    except Exception as e:
        print(f"Error al eliminar archivo físico: {e}")
    
    db.delete(db_documento)
    db.commit()
    return db_documento