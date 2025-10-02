
from sqlalchemy.orm import Session
from db.db import SessionLocal
from models.MetadatosDocModel import MetadatosDoc

def guardar_metadatos_documento(id_documento: int, metadatos: list):
	db: Session = SessionLocal()
	try:
		for metadato in metadatos:
			nuevo = MetadatosDoc(
				id_documento=id_documento,
				clave=metadato.clave,
				valor=metadato.valor
			)
			db.add(nuevo)
		db.commit()
	except Exception as e:
		db.rollback()
		raise e
	finally:
		db.close()


# Nueva función para obtener metadatos de un documento
def obtener_metadatos_documento(id_documento: int):
    db: Session = SessionLocal()
    try:
        metadatos = db.query(MetadatosDoc).filter(MetadatosDoc.id_documento == id_documento).all()
        return [{"clave": m.clave, "valor": m.valor} for m in metadatos]
    except Exception as e:
        raise e
    finally:
        db.close()
