

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from features.Proyecto.Bloque.bloqueProyectoRouter import router as bloques_router


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



@app.get("/")
def read_root():
    return {"message": "API SISDOA funcionando"}
