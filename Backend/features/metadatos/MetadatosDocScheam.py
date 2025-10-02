from pydantic import BaseModel
from typing import List

class MetadatoItem(BaseModel):
	clave: str
	valor: str

class MetadatosList(BaseModel):
	metadatos: List[MetadatoItem]
