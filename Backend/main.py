
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Inicializar los bloques únicos al iniciar el backend
inicializar_bloques_unicos()

# Permitir CORS para el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(carpeta_router)
app.include_router(bloque_router)

@app.get("/")
def read_root():
    return {"message": "API SISDOA funcionando"}
