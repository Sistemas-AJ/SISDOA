from pydantic import BaseModel

class BloqueCreate(BaseModel):
    nombre: str
    tipo: str  # 'PROYECTO' o 'PERIODO'
    descripcion: str = None
