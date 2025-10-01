from pydantic import BaseModel
from typing import Optional, List
from features.Modulo.moduloSchema import ModuloOut

class BloqueBase(BaseModel):
    tipo: str
    descripcion: Optional[str] = None

class BloqueOut(BloqueBase):
    id: int
    modulos: List[ModuloOut] = []

    class Config:
        from_attributes = True
