from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from db.base import Base

class Bloque(Base):
	__tablename__ = "Bloques"
	id = Column(Integer, primary_key=True, index=True)
	tipo = Column(String, nullable=False)
	descripcion = Column(String, nullable=True)
	modulos = relationship("Modulo", backref="bloque")
