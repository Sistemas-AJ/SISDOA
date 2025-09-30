# Rutas para los bloques de proyecto
from fastapi import APIRouter
from .bloqueProyectoService import get_all_bloques
from .bloqueProyectoSchema import BloqueResponse
from typing import List

router = APIRouter(prefix="/bloques", tags=["Bloques"])

@router.get("/", response_model=List[BloqueResponse])
def get_bloques():
	return get_all_bloques()
