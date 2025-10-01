from sqlalchemy import Column, Integer, String, ForeignKey
from db.base import Base

class Carpeta(Base):
	__tablename__ = "Carpetas"
	id = Column(Integer, primary_key=True, index=True)
	nombre = Column(String, nullable=False)
	id_padre = Column(Integer, ForeignKey("Carpetas.id"), nullable=True)
	id_modulo = Column(Integer, ForeignKey("Modulos.id"), nullable=False)
	fecha_creacion = Column(String, nullable=False)
