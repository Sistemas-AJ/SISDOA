from sqlalchemy.orm import Session
from .documentsProyectoModel import Documento
from .documentsProyectoSchema import DocumentoCreate, DocumentoUpdate

def get_documentos(db: Session):
	return db.query(Documento).all()

def get_documento(db: Session, documento_id: int):
	return db.query(Documento).filter(Documento.id == documento_id).first()

def create_documento(db: Session, documento: DocumentoCreate):
	db_documento = Documento(**documento.dict())
	db.add(db_documento)
	db.commit()
	db.refresh(db_documento)
	return db_documento

def update_documento(db: Session, documento_id: int, documento: DocumentoUpdate):
	db_documento = db.query(Documento).filter(Documento.id == documento_id).first()
	if not db_documento:
		return None
	for key, value in documento.dict(exclude_unset=True).items():
		setattr(db_documento, key, value)
	db.commit()
	db.refresh(db_documento)
	return db_documento

def delete_documento(db: Session, documento_id: int):
	db_documento = db.query(Documento).filter(Documento.id == documento_id).first()
	if not db_documento:
		return None
	db.delete(db_documento)
	db.commit()
	return db_documento
