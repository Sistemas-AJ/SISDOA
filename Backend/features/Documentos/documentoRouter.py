from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from db.db import get_db
from .documentoService import (
    get_documentos, get_documentos_por_carpeta, get_documento, 
    create_documento, update_documento, delete_documento
)
from .documentoSchema import DocumentoCreate, DocumentoUpdate, DocumentoOut
import os
import uuid
from datetime import datetime

router = APIRouter(prefix="/documentos", tags=["Documentos"])

# Crear directorio para archivos si no existe
UPLOAD_DIR = os.path.join(os.environ.get("APPDATA", ""), "SISDOA", "archivos")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/", response_model=list[DocumentoOut])
def listar_documentos(db: Session = Depends(get_db)):
    return get_documentos(db)

@router.get("/carpeta/{carpeta_id}", response_model=list[DocumentoOut])
def listar_documentos_por_carpeta(carpeta_id: int, db: Session = Depends(get_db)):
    return get_documentos_por_carpeta(db, carpeta_id)

@router.get("/{documento_id}", response_model=DocumentoOut)
def obtener_documento(documento_id: int, db: Session = Depends(get_db)):
    documento = get_documento(db, documento_id)
    if not documento:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    return documento

from fastapi import Form

@router.post("/upload/{carpeta_id}", response_model=DocumentoOut)
async def subir_documento(
    carpeta_id: int,
    file: UploadFile = File(...),
    comentario: str = Form(None),
    db: Session = Depends(get_db)
):
    try:
        # Generar nombre único para el archivo
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Guardar archivo en disco
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Crear registro en base de datos
        documento_data = DocumentoCreate(
            nombre_archivo=file.filename,
            ruta_fisica=file_path,
            tipo_archivo=file.content_type or "application/octet-stream",
            tamaño_bytes=len(content),
            id_carpeta=carpeta_id,
            comentario=comentario
        )
        return create_documento(db, documento_data)
        
    except Exception as e:
        # Si hay error, limpiar archivo creado
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Error al subir archivo: {str(e)}")

@router.get("/download/{documento_id}")
async def descargar_documento(documento_id: int, db: Session = Depends(get_db)):
    documento = get_documento(db, documento_id)
    if not documento:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    
    if not os.path.exists(documento.ruta_fisica):
        raise HTTPException(status_code=404, detail="Archivo físico no encontrado")
    
    return FileResponse(
        path=documento.ruta_fisica,
        filename=documento.nombre_archivo,
        media_type=documento.tipo_archivo
    )

@router.get("/preview/{documento_id}")
async def previsualizar_documento(documento_id: int, db: Session = Depends(get_db)):
    documento = get_documento(db, documento_id)
    if not documento:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    
    if not os.path.exists(documento.ruta_fisica):
        raise HTTPException(status_code=404, detail="Archivo físico no encontrado")
    
    # Retornar el archivo sin forzar descarga (sin filename)
    return FileResponse(
        path=documento.ruta_fisica,
        media_type=documento.tipo_archivo
    )

@router.put("/{documento_id}", response_model=DocumentoOut)
def actualizar_documento(
    documento_id: int,
    documento: DocumentoUpdate,
    db: Session = Depends(get_db)
):
    documento_db = update_documento(db, documento_id, documento)
    if not documento_db:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    return documento_db

@router.delete("/{documento_id}", response_model=DocumentoOut)
def eliminar_documento(documento_id: int, db: Session = Depends(get_db)):
    documento_db = delete_documento(db, documento_id)
    if not documento_db:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    return documento_db