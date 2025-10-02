import sqlite3
from sqlite3 import Error
import os

# --- SQLAlchemy imports for FastAPI session management ---
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Ruta de la base de datos (debe coincidir con la de Alembic y el resto del backend)
DB_PATH = os.path.join(os.environ.get("APPDATA"), "SISDOA", "documentos.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

# Crear el engine y el sessionmaker
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency for FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def crear_base_de_datos(db_file):
    """
    Crea la base de datos con la jerarquía final:
    Bloque -> Modulo -> Carpeta
    :param db_file: ruta del archivo de la base de datos (.db)
    """
    conn = None
    try:
        # Conectarse a la base de datos (se creará el archivo si no existe)
        conn = sqlite3.connect(db_file)
        print(f"Conexión exitosa a la base de datos: {db_file}")

        # Script SQL con la jerarquía definitiva
        sql_script = """
            PRAGMA foreign_keys = ON;

            /* --- Eliminar la tabla Bloques si existe --- */
            DROP TABLE IF EXISTS Bloques;

            /* --- 1. Contenedor Raíz de Todo el Proyecto --- */
            CREATE TABLE IF NOT EXISTS Bloques (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tipo TEXT NOT NULL,
                descripcion TEXT
            );

            /* --- 2. Módulos, que pertenecen a un Bloque --- */
            CREATE TABLE IF NOT EXISTS Modulos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                descripcion TEXT
            );

            /* --- 2. Módulos, que pertenecen a un Bloque --- */
            CREATE TABLE IF NOT EXISTS Modulos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                tipo TEXT NOT NULL CHECK(tipo IN ('PROYECTO', 'PERIODO')),
                id_bloque INTEGER NOT NULL,
                fecha_creacion TEXT NOT NULL DEFAULT (datetime('now','localtime')),
                FOREIGN KEY (id_bloque) REFERENCES Bloques(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS Metadatos_Modulo (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_modulo INTEGER NOT NULL,
                clave TEXT NOT NULL,
                valor TEXT NOT NULL,
                FOREIGN KEY (id_modulo) REFERENCES Modulos(id) ON DELETE CASCADE,
                UNIQUE(id_modulo, clave)
            );

            /* --- 3. Estructura de Archivos --- */
            CREATE TABLE IF NOT EXISTS Carpetas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                id_padre INTEGER,
                id_modulo INTEGER NOT NULL,
                fecha_creacion TEXT NOT NULL DEFAULT (datetime('now','localtime')),
                FOREIGN KEY (id_padre) REFERENCES Carpetas(id) ON DELETE CASCADE,
                FOREIGN KEY (id_modulo) REFERENCES Modulos(id) ON DELETE CASCADE
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
                comentario TEXT,
                FOREIGN KEY (id_carpeta) REFERENCES Carpetas(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS Metadatos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_documento INTEGER NOT NULL,
                clave TEXT NOT NULL,
                valor TEXT NOT NULL,
                FOREIGN KEY (id_documento) REFERENCES Documentos(id) ON DELETE CASCADE,
                UNIQUE(id_documento, clave)
            );
        """

        # Ejecutar el script completo
        cursor = conn.cursor()
        cursor.executescript(sql_script)
        print("Estructura de la base de datos definitiva creada/verificada exitosamente.")
        
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
    # Obtener la ruta de AppData para guardar la BD de forma centralizada
    appdata_dir = os.environ.get("APPDATA")
    nombre_app = "SISDOA"
    db_folder = os.path.join(appdata_dir, nombre_app)
    os.makedirs(db_folder, exist_ok=True)
    nombre_db = os.path.join(db_folder, "documentos.db")
    
    print(f"La base de datos se creará/verificará en: {nombre_db}")
    
    # Llama a la función para crear la estructura
    crear_base_de_datos(nombre_db)

# adrian no carga no se que pasa que dices tu