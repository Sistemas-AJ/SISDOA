import sqlite3
from sqlite3 import Error
import os

def crear_base_de_datos(db_file):
    """
    Crea la base de datos con la estructura principal del gestor de documentos,
    excluyendo el sistema de etiquetas.
    :param db_file: ruta del archivo de la base de datos (.db)
    """
    conn = None
    try:
        # Conectarse a la base de datos (se creará el archivo si no existe)
        conn = sqlite3.connect(db_file)
        print(f"Conexión exitosa a la base de datos: {db_file}")

        # Script SQL simplificado para crear la estructura esencial.
        sql_script = """
            PRAGMA foreign_keys = ON;

            CREATE TABLE IF NOT EXISTS Bloques (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                tipo TEXT NOT NULL CHECK(tipo IN ('PROYECTO', 'PERIODO')),
                descripcion TEXT,
                fecha_creacion TEXT NOT NULL DEFAULT (datetime('now','localtime'))
            );

            CREATE UNIQUE INDEX IF NOT EXISTS idx_bloque_nombre_tipo ON Bloques(nombre, tipo);

            CREATE TABLE IF NOT EXISTS Carpetas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                id_padre INTEGER,
                id_bloque INTEGER NOT NULL,
                fecha_creacion TEXT NOT NULL DEFAULT (datetime('now','localtime')),
                FOREIGN KEY (id_padre) REFERENCES Carpetas(id) ON DELETE CASCADE,
                FOREIGN KEY (id_bloque) REFERENCES Bloques(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS Documentos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre_archivo TEXT NOT NULL,
                ruta_fisica TEXT NOT NULL UNIQUE,
                tipo_archivo TEXT,
                tamaño_bytes INTEGER,
                id_carpeta INTEGER NOT NULL,
                fecha_creacion TEXT NOT NULL DEFAULT (datetime('now','localtime')),
                fecha_modificacion TEXT,
                FOREIGN KEY (id_carpeta) REFERENCES Carpetas(id) ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS idx_documentos_nombre ON Documentos(nombre_archivo);

            CREATE TABLE IF NOT EXISTS Metadatos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_documento INTEGER NOT NULL,
                clave TEXT NOT NULL,
                valor TEXT NOT NULL,
                FOREIGN KEY (id_documento) REFERENCES Documentos(id) ON DELETE CASCADE,
                UNIQUE(id_documento, clave)
            );

            CREATE INDEX IF NOT EXISTS idx_metadatos_clave_valor ON Metadatos(clave, valor);
        """

        # Ejecutar el script completo
        cursor = conn.cursor()
        cursor.executescript(sql_script)
        print("Estructura de la base de datos (sin etiquetas) creada/verificada exitosamente.")
        
        # Confirmar los cambios
        conn.commit()

    except Error as e:
        print(f"Error al crear la base de datos: {e}")
    finally:
        # Cerrar la conexión
        if conn:
            conn.close()
            print("Conexión a la base de datos cerrada.")

# --- Uso del script ---
if __name__ == '__main__':
    # Obtener la ruta de AppData
    appdata_dir = os.environ.get("APPDATA")
    nombre_app = "SISDOA"  # Cambia esto si tu app tiene otro nombre
    db_folder = os.path.join(appdata_dir, nombre_app)
    os.makedirs(db_folder, exist_ok=True)
    nombre_db = os.path.join(db_folder, "documentos.db")
    # Llama a la función para crearla
    crear_base_de_datos(nombre_db)