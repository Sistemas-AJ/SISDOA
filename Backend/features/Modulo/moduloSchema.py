from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MetadatoModuloIn(BaseModel):
    clave: str
    valor: Optional[str] = None

class ModuloBase(BaseModel):
    nombre: str
    tipo: str

class ModuloCreate(ModuloBase):
    metadatos: Optional[List[MetadatoModuloIn]] = None

class ModuloOut(ModuloBase):
    id: int
    fecha_creacion: datetime
    class Config:
        from_attributes = True