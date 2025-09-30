from pydantic import BaseModel
from typing import Optional
from datetime import datetime

<<<<<<< HEAD
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
=======


class BloqueBase(BaseModel):
    nombre: str
    tipo: str
    descripcion: Optional[str] = None

class BloqueOut(BloqueBase):
    id: int
>>>>>>> d3d78c15176965c29d19b45ce8b5a63588cd5615

    class Config:
        orm_mode = True
