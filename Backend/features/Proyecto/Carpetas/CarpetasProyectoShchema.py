from pydantic import BaseModel
from typing import Optional

class CarpetaBase(BaseModel):
	nombre: str
	id_padre: Optional[int] = None
	id_modulo: int
	fecha_creacion: str

class CarpetaCreate(CarpetaBase):
	pass

class CarpetaUpdate(BaseModel):
	nombre: Optional[str] = None
	id_padre: Optional[int] = None
	fecha_creacion: Optional[str] = None

class CarpetaOut(CarpetaBase):
	id: int
	class Config:
		orm_mode = True
