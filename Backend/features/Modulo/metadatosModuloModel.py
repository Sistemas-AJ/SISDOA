from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class MetadatoModulo(Base):
    __tablename__ = "MetadatosModulo"
    id = Column(Integer, primary_key=True, index=True)
    id_modulo = Column(Integer, ForeignKey("Modulos.id"), nullable=False)
    clave = Column(String, nullable=False)
    valor = Column(String, nullable=True)
