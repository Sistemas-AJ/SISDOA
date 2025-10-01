from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MetadatoModuloIn(BaseModel):
    clave: str
    valor: Optional[str] = None

class MetadatoModuloOut(BaseModel):
    clave: str
    valor: Optional[str] = None

    class Config:
        from_attributes = True

class ModuloBase(BaseModel):
    nombre: str
    tipo: str
    id_bloque: Optional[int] = None

class ModuloCreate(ModuloBase):
    metadatos: Optional[List[MetadatoModuloIn]] = None

class ModuloOut(ModuloBase):
    id: int
    fecha_creacion: datetime
    metadatos: List[MetadatoModuloOut] = []

    class Config:
        from_attributes = True