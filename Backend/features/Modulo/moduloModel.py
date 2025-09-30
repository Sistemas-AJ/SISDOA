from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Modulo(Base):
    __tablename__ = "Modulos"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    tipo = Column(String, nullable=False)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)

class MetadatoModulo(Base):
    __tablename__ = "MetadatosModulo"
    id = Column(Integer, primary_key=True, index=True)
    id_modulo = Column(Integer, ForeignKey("Modulos.id"), nullable=False)
    clave = Column(String, nullable=False)
    valor = Column(String, nullable=True)