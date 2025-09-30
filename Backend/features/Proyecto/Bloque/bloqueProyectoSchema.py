# Esquema de respuesta para la API
from pydantic import BaseModel

class BloqueResponse(BaseModel):
	id: int
	nombre: str
	tipo: str
	descripcion: str | None = None
	fecha_creacion: str

	class Config:
		orm_mode = True
