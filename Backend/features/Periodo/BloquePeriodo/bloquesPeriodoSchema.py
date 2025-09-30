from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BloqueBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None

class BloqueCreate(BloqueBase):
    pass

class BloqueUpdate(BloqueBase):
    pass

class BloqueOut(BloqueBase):
    id: int
    tipo: str
    fecha_creacion: datetime

    class Config:
        orm_mode = True
