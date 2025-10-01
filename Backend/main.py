from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from features.Periodo.BloquePeriodo.bloquesPeriodoRouter import router as periodos_router
from features.Modulo.moduloRouter import router as modulo_router
from features.Proyecto.BloqueProyecto.bloqueProyectoRouter import router as bloques_router
from features.Proyecto.Carpetas.CarpetasPoryectoRouter import router as carpetas_proyecto_router
from features.Carpetas.carpetasRouter import router as carpetas_router
from features.Documentos.documentoRouter import router as documentos_router


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
app.include_router(modulo_router)
app.include_router(carpetas_proyecto_router)
app.include_router(carpetas_router)
app.include_router(documentos_router)


@app.get("/")
def read_root():
    return {"message": "API SISDOA funcionando"}
