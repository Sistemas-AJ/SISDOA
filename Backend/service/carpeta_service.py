import os
import sqlite3
from fastapi import HTTPException

appdata_dir = os.environ.get("APPDATA")
nombre_app = "SISDOA"
db_folder = os.path.join(appdata_dir, nombre_app)
os.makedirs(db_folder, exist_ok=True)
nombre_db = os.path.join(db_folder, "documentos.db")

def get_db_conn():
    return sqlite3.connect(nombre_db)

def listar_carpetas_service():
    conn = get_db_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT id, nombre, id_padre, id_bloque, fecha_creacion FROM Carpetas")
    carpetas = [
        {
            "id": row[0],
            "nombre": row[1],
            "id_padre": row[2],
            "id_bloque": row[3],
            "fecha_creacion": row[4]
        }
        for row in cursor.fetchall()
    ]
    conn.close()
    return carpetas

def crear_carpeta_service(carpeta):
    conn = get_db_conn()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO Carpetas (nombre, id_padre, id_bloque) VALUES (?, ?, ?)",
            (carpeta.nombre, carpeta.id_padre, carpeta.id_bloque)
        )
        conn.commit()
        carpeta_id = cursor.lastrowid
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=400, detail=str(e))
    conn.close()
    return {"id": carpeta_id, "nombre": carpeta.nombre}
