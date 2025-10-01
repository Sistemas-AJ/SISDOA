from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from db.base import Base

class Documento(Base):
	__tablename__ = "Documentos"
	id = Column(Integer, primary_key=True, index=True)
	nombre_archivo = Column(String, nullable=False)
	ruta_fisica = Column(String, nullable=False, unique=True)
	tipo_archivo = Column(String)
	tamaño_bytes = Column(Integer)
	id_carpeta = Column(Integer, ForeignKey("Carpetas.id"), nullable=False)
	fecha_creacion = Column(String, nullable=False)
	fecha_modificacion = Column(String, nullable=True)
