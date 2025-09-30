from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from features.Periodo.BloquePeriodo.bloquesPeriodoRouter import router as periodos_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(periodos_router)

@app.get("/")
def read_root():
    return {"message": "API SISDOA funcionando"}
