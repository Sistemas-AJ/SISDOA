from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
<<<<<<< HEAD
=======
from sqlalchemy.orm import relationship
>>>>>>> d3d78c15176965c29d19b45ce8b5a63588cd5615
from datetime import datetime

Base = declarative_base()

class Bloque(Base):
    __tablename__ = "Bloques"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
<<<<<<< HEAD
    tipo = Column(String, nullable=False)  # Debe ser 'periodo' para los periodos
=======
    tipo = Column(String, nullable=False, default="periodo")  # Debe ser 'periodo' para los periodos
>>>>>>> d3d78c15176965c29d19b45ce8b5a63588cd5615
    descripcion = Column(String, nullable=True)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
