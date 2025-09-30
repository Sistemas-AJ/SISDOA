from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Modulo(Base):
    __tablename__ = "Modulos"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    tipo = Column(String, nullable=False)  # 'proyecto' o 'periodo'
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
