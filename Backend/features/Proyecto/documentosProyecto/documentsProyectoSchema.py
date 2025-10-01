from pydantic import BaseModel
from typing import Optional

class DocumentoBase(BaseModel):
	nombre_archivo: str
	ruta_fisica: str
	tipo_archivo: Optional[str] = None
	tamaño_bytes: Optional[int] = None
	id_carpeta: int
	fecha_creacion: str
	fecha_modificacion: Optional[str] = None

class DocumentoCreate(DocumentoBase):
	pass

class DocumentoUpdate(BaseModel):
	nombre_archivo: Optional[str] = None
	tipo_archivo: Optional[str] = None
	tamaño_bytes: Optional[int] = None
	fecha_modificacion: Optional[str] = None

class DocumentoOut(DocumentoBase):
	id: int
	class Config:
		orm_mode = True
