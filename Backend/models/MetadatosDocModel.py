from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class MetadatosDoc(Base):
	__tablename__ = "Metadatos"
	id = Column(Integer, primary_key=True, index=True)
	id_documento = Column(Integer, index=True)
	clave = Column(String, index=True)
	valor = Column(String)
