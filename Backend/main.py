from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

<<<<<<< HEAD
from features.Proyecto.Bloque.bloqueProyectoRouter import router as bloques_router
from features.Periodo.BloquePeriodo.bloquesPeriodoRouter import router as periodos_router
=======

from features.Periodo.BloquePeriodo.bloquesPeriodoRouter import router as periodos_router
from features.Modulo.moduloRouter import router as modulo_router
from features.Modulo.metadatosModuloRouter import router as metadatos_modulo_router
>>>>>>> d3d78c15176965c29d19b45ce8b5a63588cd5615

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar el router de bloques
app.include_router(bloques_router)
app.include_router(periodos_router)

app.include_router(periodos_router)
app.include_router(modulo_router)
app.include_router(metadatos_modulo_router)

@app.get("/")
def read_root():
    return {"message": "API SISDOA funcionando"}
