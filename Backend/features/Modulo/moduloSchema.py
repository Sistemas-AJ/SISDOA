from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ModuloBase(BaseModel):
    nombre: str
    tipo: str

class ModuloCreate(ModuloBase):
    pass

class ModuloUpdate(ModuloBase):
    pass

class ModuloOut(ModuloBase):
    id: int
    fecha_creacion: datetime

    class Config:
        orm_mode = True
