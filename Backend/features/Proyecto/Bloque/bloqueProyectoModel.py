# Modelo de Bloque para uso interno
from pydantic import BaseModel

class Bloque(BaseModel):
	id: int
	nombre: str
	tipo: str
	descripcion: str | None = None
	fecha_creacion: str
