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

def inicializar_bloques_unicos():
    conn = get_db_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM Bloques WHERE tipo = 'PROYECTO'")
    if cursor.fetchone() is None:
        cursor.execute("INSERT INTO Bloques (nombre, tipo, descripcion) VALUES (?, ?, ?)",
                       ("PROYECTOS", "PROYECTO", "Bloque raíz de proyectos"))
    cursor.execute("SELECT id FROM Bloques WHERE tipo = 'PERIODO'")
    if cursor.fetchone() is None:
        cursor.execute("INSERT INTO Bloques (nombre, tipo, descripcion) VALUES (?, ?, ?)",
                       ("PERIODOS", "PERIODO", "Bloque raíz de periodos"))
    conn.commit()
    conn.close()

def listar_bloques_service():
    conn = get_db_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT id, nombre, tipo, descripcion, fecha_creacion FROM Bloques")
    bloques = [
        {
            "id": row[0],
            "nombre": row[1],
            "tipo": row[2],
            "descripcion": row[3],
            "fecha_creacion": row[4]
        }
        for row in cursor.fetchall()
    ]
    conn.close()
    return bloques

def crear_bloque_service(bloque):
    if bloque.tipo not in ["PROYECTO", "PERIODO"]:
        raise HTTPException(status_code=400, detail="Tipo debe ser PROYECTO o PERIODO")
    conn = get_db_conn()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO Bloques (nombre, tipo, descripcion) VALUES (?, ?, ?)",
            (bloque.nombre, bloque.tipo, bloque.descripcion)
        )
        conn.commit()
        bloque_id = cursor.lastrowid
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=400, detail=str(e))
    conn.close()
    return {"id": bloque_id, "nombre": bloque.nombre, "tipo": bloque.tipo}
