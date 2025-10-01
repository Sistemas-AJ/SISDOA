from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from db.base import Base  # <--- Usa el Base común

class Modulo(Base):
    __tablename__ = "Modulos"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    tipo = Column(String, nullable=False)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    id_bloque = Column(Integer, ForeignKey("Bloques.id"), nullable=True)
    metadatos = relationship("MetadatoModulo", backref="modulo", cascade="all, delete-orphan")

class MetadatoModulo(Base):
    __tablename__ = "Metadatos_Modulo"
    id = Column(Integer, primary_key=True, index=True)
    id_modulo = Column(Integer, ForeignKey("Modulos.id"), nullable=False)
    clave = Column(String, nullable=False)
    valor = Column(String, nullable=True)