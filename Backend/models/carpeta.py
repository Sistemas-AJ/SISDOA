from pydantic import BaseModel

class CarpetaCreate(BaseModel):
    nombre: str
    id_padre: int = None
    id_bloque: int
