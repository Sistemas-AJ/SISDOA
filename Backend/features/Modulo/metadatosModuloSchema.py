from pydantic import BaseModel
from typing import Optional

class MetadatoModuloBase(BaseModel):
    id_modulo: int
    clave: str
    valor: Optional[str] = None

class MetadatoModuloCreate(MetadatoModuloBase):
    pass

class MetadatoModuloUpdate(MetadatoModuloBase):
    pass

class MetadatoModuloOut(MetadatoModuloBase):
    id: int

    class Config:
        orm_mode = True
