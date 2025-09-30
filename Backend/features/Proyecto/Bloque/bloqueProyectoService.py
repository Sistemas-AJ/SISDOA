# Servicio para obtener los bloques desde la base de datos
import sqlite3
import os
from .bloqueProyectoModel import Bloque

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'db', 'sisdoa.db')

def get_all_bloques():
	conn = sqlite3.connect(DB_PATH)
	conn.row_factory = sqlite3.Row
	cursor = conn.cursor()
	cursor.execute("SELECT id, nombre, tipo, descripcion, fecha_creacion FROM Bloques")
	rows = cursor.fetchall()
	bloques = [Bloque(**dict(row)) for row in rows]
	conn.close()
	return bloques
