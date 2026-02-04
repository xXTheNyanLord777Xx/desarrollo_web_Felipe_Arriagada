from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from datetime import datetime

DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306

DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

#CLASES:
#tendremos clases en las cuales definimos lo que vamos a utilizar
#es como el puente entre las tablas y el codigo

class Region(Base):
    __tablename__ = "region"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    comuna = relationship("Comuna", back_populates="region")


class Comuna(Base):
    __tablename__ = "comuna"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    region_id = Column(Integer, ForeignKey("region.id"), nullable=False)
    region = relationship("Region", back_populates="comuna")
    avisos = relationship("AvisoAdopcion", back_populates="comuna")


class AvisoAdopcion(Base):
    __tablename__ = "aviso_adopcion"
    id = Column(Integer, primary_key=True, autoincrement=True)
    fecha_ingreso = Column(DateTime, default=datetime.utcnow) #se usa el datetime para saber cuando se subio el aviso
    #eso lo dejare claro tambien en el readme.txt
    comuna_id = Column(Integer, ForeignKey("comuna.id"), nullable=False)
    sector = Column(String(100), nullable=True)
    nombre = Column(String(200), nullable=False)
    email = Column(String(100), nullable=False)
    celular = Column(String(30), nullable=True)
    tipo = Column(String(10), nullable=False)  
    cantidad = Column(Integer, nullable=False)
    edad = Column(Integer, nullable=False)
    unidad_medida = Column(String(1), nullable=False)  
    fecha_entrega = Column(DateTime, nullable=False)
    descripcion = Column(String(500), nullable=True)

    #similar al aux 5 donde: usuario = relationship("Usuario", back_populates="confesiones")
    # es para acceder mas rapido a comuna, fotos y contactos
    # cascade all es si le pasa algo a un aviso, tambien le pase a los que heredan de el
    #como los que tienen FK que dependen de ellos, lo vi hace poco en BD asi que asumo que
    #puedo utilizarlo aca 
    comuna = relationship("Comuna", back_populates="avisos")
    fotos = relationship("Foto", back_populates="aviso", cascade="all")
    contactos = relationship("Contacto", back_populates="aviso", cascade="all")

class Foto(Base):
    __tablename__ = "foto"
    id = Column(Integer, primary_key=True, autoincrement=True)
    actividad_id = Column(Integer, ForeignKey("aviso_adopcion.id"), primary_key=True)
    ruta_archivo = Column(String(300), nullable=False)
    nombre_archivo = Column(String(300), nullable=False)
    aviso = relationship("AvisoAdopcion", back_populates="fotos")


class Contacto(Base):
    __tablename__ = "contactar_por"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    identificador = Column(String(100), nullable=False)
    actividad_id = Column(Integer, ForeignKey("aviso_adopcion.id"), nullable=False)
    aviso = relationship("AvisoAdopcion", back_populates="contactos")


#FUNCIONES
#casi todas son como casi que iguales a las del aux5, es la misma nomenclatura
def get_region():
    session = SessionLocal()
    data = session.query(Region).all()
    session.close()
    return data

def get_comuna():
    session = SessionLocal()
    data = session.query(Comuna).all()
    session.close()
    return data

#definimos un get_comunayregion ya que queremos las comunas de una region
#corte en base a una region tenemos estas comunas
def get_comuna_con_region(region_id: int):
    session = SessionLocal()
    data = session.query(Comuna).filter_by(region_id=region_id).all()
    session.close()
    return data
#lo mismo que lo anterior pero con id y aviso
#ojo que utilizamos .first() 
def get_aviso_by_id(aviso_id: int):
    session = SessionLocal()
    data = session.query(AvisoAdopcion).filter_by(id=aviso_id).first()
    session.close()
    return data

#esta funcion es para el index, donde necesitamos los ultimos 5 avisos
def get_ultimos_avisos(limit=5):
    s = SessionLocal()
    #accedemos a TODOS los avisos y los limitamos en base a 5
    #tambien estan ordenados desc en base al orden de ingreso
    #se que esto no se vio textual en el aux pero es como la misma logica
    avisos = (s.query(AvisoAdopcion).order_by(AvisoAdopcion.fecha_ingreso.desc()).limit(int(limit)).all())
    #IMPORTANTE, si no hay nada tenemos que cerrar sesion y devolver la lista vacia, asi muestra lista vacia
    if not avisos:
        s.close()
        return []
    #ahora basicamente solo decimos que hay un a en avisos y para llamar
    #a la columna que queremos le ponemos a.loquequiero
    #hacemos una lista con los id de los avisos
    aviso_ids = [a.id for a in avisos]
    #tambien con las id de las comunas
    comuna_ids = list({a.comuna_id for a in avisos})
    #accedemos a las filas de comunas 
    comunas_rows = (s.query(Comuna.id, Comuna.nombre).filter(Comuna.id.in_(comuna_ids)).all())
    #ahora hacemos un diccionario con id:nombre
    comuna_map = {row.id: row.nombre for row in comunas_rows}
    #Ahora accedemos a las fotos
    foto_rows = (s.query(Foto.actividad_id, Foto.id, Foto.nombre_archivo).filter(Foto.actividad_id.in_(aviso_ids)).order_by(Foto.actividad_id.asc(), Foto.id.asc()).all())
    #hacemos un dic donde se ordena en base a la actividad_id que es la llave que conecta foto con el contacto
    first_photo_dict = {} #el dic vacio
    for actividad_id, foto_id, nombre_archivo in foto_rows: #accedemos a columnas de tabla fotos, añadimos foto_id que no se ocupa pero sino explota pq espera 3 valores TOT
        if actividad_id not in first_photo_dict: #si no esta incluido el id
            first_photo_dict[actividad_id] = nombre_archivo  #lo añadinos 
    #creamos un diccionario con todos los datos ya accedidos
    out = []
    for a in avisos:
        out.append({
            "id": a.id,
            "fecha_ingreso": a.fecha_ingreso,
            "comuna_id": a.comuna_id,
            "comuna_nombre": comuna_map.get(a.comuna_id), #notamos que en comuna llamamos a obtener la comuna en base a la id, de ahi la funcion
            "sector": a.sector,                            
            "tipo": a.tipo,
            "cantidad": a.cantidad,
            "edad": a.edad,
            "unidad_medida": a.unidad_medida,
            "fecha_entrega": a.fecha_entrega,
            "nombre": a.nombre,  
            "email": a.email,    
            "descripcion": a.descripcion,
            "nombre_archivo": first_photo_dict.get(a.id),   
        })
    s.close()
    return out #retornamos el diccionario con todos los datos ya listos

#funcion para insertar un aviso en la base de datos, esta funcion recibe el dict que se crea con flask en app.py
def crear_aviso_total(aviso, fotos=None, contactos=None):
    session = SessionLocal()
    #obtenemos los datos del aviso enviado, ojo, usamos get por si no existe la llave, de esta manera pondremos none y no saldra error(por eso los opcionales tienen get)
    nuevo_aviso = AvisoAdopcion(
        fecha_ingreso=aviso.get("fecha_ingreso"),
        comuna_id=aviso["comuna_id"],
        sector=aviso.get("sector"),
        nombre=aviso["nombre"],
        email=aviso["email"],
        celular=aviso.get("celular"),
        tipo=aviso["tipo"],
        cantidad=aviso["cantidad"],
        edad=aviso["edad"],
        unidad_medida=aviso["unidad_medida"],
        fecha_entrega=aviso["fecha_entrega"],
        descripcion=aviso.get("descripcion"),
    )
    #marcamos el objeto
    session.add(nuevo_aviso)
    #enviamos la operacion pero aun sin commit, esto nos crea una id del nuevo aviso
    session.flush()
    #la id creada se guarda, ya que la utlizaremos para enlazar                      
    created_id = nuevo_aviso.id         
    #al hacer lo anterior no necesitamos hacer flush pues ya estamos utilizando una id flusheada
    #entonces basta con add y despues commit, solo funciona poor que utilizamos la id en ambos objetos
    for f in (fotos):
        #añadimos la foto con su ruta, nombre e id
        #esto es en base a la clase Fotocreada arriba la cual representa una fila
        session.add(Foto(ruta_archivo=f["ruta_archivo"],nombre_archivo=f["nombre_archivo"],actividad_id=created_id))
    #lo mismo con el contacto pero lo añadimos a la tabla de contactar_por, es un copy paste
    #del que hay en app.py
    for c in (contactos):
        session.add(Contacto(nombre=c["nombre"], identificador=c["identificador"], actividad_id=created_id))
    #commit close y return
    session.commit()
    session.close()
    return True, created_id #el True es por que funciono(asumimos que si...) y retornamos el id creado      

#funcion para tener los avisos paginados
#omg perdon por la poca eficacia es real que el mismo copy paste pero con un cambio
def get_avisos_paginados(limit=5, offset=0):
    s = SessionLocal()
    # Obtener avisos con LIMIT y OFFSET
    avisos = (s.query(AvisoAdopcion).order_by(AvisoAdopcion.fecha_ingreso.desc()).limit(int(limit)).offset(int(offset)).all())
    
    if not avisos:
        s.close()
        return []
    #ESTO ES LO DE GET_ULTIMOS_AVISOS

    #IMPORTANTE, si no hay nada tenemos que cerrar sesion y devolver la lista vacia, asi muestra lista vacia
    if not avisos:
        s.close()
        return []
    #ahora basicamente solo decimos que hay un a en avisos y para llamar
    #a la columna que queremos le ponemos a.loquequiero
    #hacemos una lista con los id de los avisos
    aviso_ids = [a.id for a in avisos]
    #tambien con las id de las comunas
    comuna_ids = list({a.comuna_id for a in avisos})
    #accedemos a las filas de comunas 
    comunas_rows = (s.query(Comuna.id, Comuna.nombre).filter(Comuna.id.in_(comuna_ids)).all())
    #ahora hacemos un diccionario con id:nombre
    comuna_map = {row.id: row.nombre for row in comunas_rows}
    #Ahora accedemos a las fotos
    foto_rows = (s.query(Foto.actividad_id, Foto.id, Foto.nombre_archivo).filter(Foto.actividad_id.in_(aviso_ids)).order_by(Foto.actividad_id.asc(), Foto.id.asc()).all())
    #hacemos un dic donde se ordena en base a la actividad_id que es la llave que conecta foto con el contacto
    first_photo_dict = {} #el dic vacio
    for actividad_id, foto_id, nombre_archivo in foto_rows: #accedemos a columnas de tabla fotos, añadimos foto_id que no se ocupa pero sino explota pq espera 3 valores TOT
        if actividad_id not in first_photo_dict: #si no esta incluido el id
            first_photo_dict[actividad_id] = nombre_archivo  #lo añadinos 
    #creamos un diccionario con todos los datos ya accedidos
    out = []
    for a in avisos:
        out.append({
            "id": a.id,
            "fecha_ingreso": a.fecha_ingreso,
            "comuna_id": a.comuna_id,
            "comuna_nombre": comuna_map.get(a.comuna_id), #notamos que en comuna llamamos a obtener la comuna en base a la id, de ahi la funcion
            "sector": a.sector,                            
            "tipo": a.tipo,
            "cantidad": a.cantidad,
            "edad": a.edad,
            "unidad_medida": a.unidad_medida,
            "fecha_entrega": a.fecha_entrega,
            "nombre": a.nombre,  
            "email": a.email,    
            "descripcion": a.descripcion,
            "nombre_archivo": first_photo_dict.get(a.id),   
        })
    s.close()
    return out #retornamos el diccionario con todos los datos ya listos

# Función para contar el total de avisos
def get_total_avisos():
    s = SessionLocal()
    total = s.query(AvisoAdopcion).count()
    s.close()
    return total