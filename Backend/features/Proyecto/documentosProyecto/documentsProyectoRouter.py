from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.db import get_db
from .documentsProyectoService import (
	get_documentos, get_documento, create_documento, update_documento, delete_documento
)
from .documentsProyectoSchema import DocumentoCreate, DocumentoUpdate, DocumentoOut

router = APIRouter(prefix="/documentos-proyecto", tags=["DocumentosProyecto"])

@router.get("/documentos", response_model=list[DocumentoOut])
def listar_documentos(db: Session = Depends(get_db)):
	return get_documentos(db)

@router.get("/{documento_id}", response_model=DocumentoOut)
def obtener_documento(documento_id: int, db: Session = Depends(get_db)):
	doc = get_documento(db, documento_id)
	if not doc:
		raise HTTPException(status_code=404, detail="Documento no encontrado")
	return doc

@router.post("/documentos", response_model=DocumentoOut)
def crear_documento(documento: DocumentoCreate, db: Session = Depends(get_db)):
	return create_documento(db, documento)

@router.put("/{documento_id}", response_model=DocumentoOut)
def actualizar_documento(documento_id: int, documento: DocumentoUpdate, db: Session = Depends(get_db)):
	doc = update_documento(db, documento_id, documento)
	if not doc:
		raise HTTPException(status_code=404, detail="Documento no encontrado")
	return doc

@router.delete("/{documento_id}", response_model=DocumentoOut)
def eliminar_documento(documento_id: int, db: Session = Depends(get_db)):
	doc = delete_documento(db, documento_id)
	if not doc:
		raise HTTPException(status_code=404, detail="Documento no encontrado")
	return doc
