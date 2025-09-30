from pydantic import BaseModel
from typing import Optional
from datetime import datetime



class BloqueBase(BaseModel):
    nombre: str
    tipo: str
    descripcion: Optional[str] = None

class BloqueOut(BloqueBase):
    id: int

    class Config:
        orm_mode = True
