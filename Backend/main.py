"""
Versión simplificada del main.py para PyInstaller
Sin logging complejo para evitar problemas de empaquetado
"""
import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importar para inicialización de base de datos
from db.db import get_db, engine
from db.base import Base
from sqlalchemy.orm import Session
from models.bloqueModel import Bloque

# Importar routers
from features.Periodo.BloquePeriodo.bloquesPeriodoRouter import router as periodos_router
from features.Modulo.moduloRouter import router as modulo_router
from features.Proyecto.BloqueProyecto.bloqueProyectoRouter import router as bloques_router
from features.Proyecto.Carpetas.CarpetasPoryectoRouter import router as carpetas_proyecto_router
from features.Carpetas.carpetasRouter import router as carpetas_router
from features.Documentos.documentoRouter import router as documentos_router
from features.metadatos.MetadatosDocRouter import router as metadatos_router

# Crear aplicación FastAPI
app = FastAPI(title="SISDOA API", version="1.0.0")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers
app.include_router(bloques_router)
app.include_router(periodos_router)
app.include_router(modulo_router)
app.include_router(carpetas_proyecto_router)
app.include_router(carpetas_router)
app.include_router(documentos_router)
app.include_router(metadatos_router)

@app.get("/")
def read_root():
    return {"message": "API SISDOA funcionando", "status": "ok"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "port": 9050}

def init_database():
    """Inicializar la base de datos y crear bloques por defecto"""
    try:
        # Crear todas las tablas
        Base.metadata.create_all(bind=engine)
        
        # Crear sesión de base de datos
        db = Session(bind=engine)
        
        # Verificar si ya existen los bloques
        existing_bloques = db.query(Bloque).count()
        
        if existing_bloques == 0:
            # Crear bloques por defecto
            bloque_proyecto = Bloque(id=1, tipo="PROYECTO", descripcion="Gestión de Proyectos")
            bloque_periodo = Bloque(id=2, tipo="PERIODO", descripcion="Gestión de Períodos")
            
            db.add(bloque_proyecto)
            db.add(bloque_periodo)
            db.commit()
            
            print("OK - Bloques inicializados: PROYECTO (ID=1) y PERIODO (ID=2)")
        else:
            print(f"OK - Base de datos ya inicializada ({existing_bloques} bloques encontrados)")
        
        db.close()
        
    except Exception as e:
        print(f"Error al inicializar la base de datos: {e}")

@app.on_event("startup")
async def startup_event():
    """Evento que se ejecuta al iniciar la aplicación"""
    print("Inicializando base de datos...")
    init_database()

if __name__ == "__main__":
    import uvicorn
    
    # Configuración simplificada para PyInstaller
    config = uvicorn.Config(
        app,
        host="0.0.0.0",
        port=9050,
        log_level="info",
        # Desactivar logging complejo para PyInstaller
        access_log=False,
        use_colors=False
    )
    
    server = uvicorn.Server(config)
    
    print("Iniciando SISDOA Backend en puerto 9050...")
    print("URL: http://localhost:9050")
    print("Docs: http://localhost:9050/docs")
    
    try:
        server.run()
    except KeyboardInterrupt:
        print("🛑 Servidor detenido")
    except Exception as e:
        print(f"ERROR: {e}")
        sys.exit(1)