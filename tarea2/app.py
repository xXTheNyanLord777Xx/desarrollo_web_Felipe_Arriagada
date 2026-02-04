from flask import Flask, request, render_template, redirect, url_for, session, jsonify, flash
from utils.validations import validate_aviso, validate_contactos, validate_fotos  # <-- crea estas validaciones a imagen del ejemplo
from database import db
from werkzeug.utils import secure_filename
import hashlib
import filetype
import os
import uuid
from pathlib import Path
from datetime import datetime


UPLOAD_FOLDER = 'static/uploads'

app = Flask(__name__)
app.secret_key = "s3cr3t_k3y"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1000 * 1000

#esto es para que solo se suban estos archivos
ALLOWED_EXT = {"png", "jpg", "jpeg", "gif", "webp"}

#APP ROUTES

#son bien parecidas a las del aux:

#portada con los ultimos 5 avisos(y no todos los datos)
@app.route("/", methods=["GET"])
def portada():
    ultimos5 = db.get_ultimos_avisos(limit=5)
    return render_template("index.html", ultimos5=ultimos5)

#ahora para la paginacion:
@app.route("/listado", methods=["GET"]) #get pues no estamos enviando nada
def adoptions_list(): 
    #obtener la pagina, como funciona?, request.args obtiene los datos de la URL
    #es decir, con este accedemos a la pagina del usuario
    pag = request.args.get('pag', 1, type=int)
    por_pag = 5  #cuantos avisos por pag? 5
    #esto es para ver cuantos nos saltamos, onda, en la pag 3 necesitamos los ultimos 5
    #con esto vemos los primeros 10
    offset = (pag - 1) * por_pag
    #obtenemos los avisos con el db avisos paginados y con cuantos avisos nos saltamos(asi accedemos a los 5 avisos que necesitamos)
    avisos_enteros = db.get_avisos_paginados(limit=por_pag, offset=offset)
    #ahora debemos calcular cuantos avisos hay para ver cuantas paginas tendremos
    total_avisos = db.get_total_avisos() 
    total_pags = (total_avisos + por_pag - 1) // por_pag  #IMPORTANTE LA DIVISION ENTERA, no puede ser decimal
    #retornamos losa avisos actuales segun la pagina, la pagina, y el total de paginas
    #para poder utilizarlo en el html 
    return render_template("listado.html", avisos=avisos_enteros, pag=pag, total_pags=total_pags)

#ahora, para el aviso...
@app.route("/agregar", methods=["GET", "POST"])
def add_adoption():
    if request.method == "POST":#si enviamos una solicitud, entonces 
        form = request.form #lo enviado
        #hacemos un diccionario con todos los datos enviados, los datos seran form.get(blabla)
        dict_aviso = {
            "nombre": (form.get("nombre")),
            "email": (form.get("email")),
            "phone": (form.get("phone")),
            "select_region": form.get("select-region"), #ojo que en el html el select esta con el guion este -, por eso el get es con ese
            "select_comuna": form.get("select-comuna"),
            "sector": (form.get("sector")),
            "tipo": (form.get("tipo")),           
            "cantidad": form.get("cantidad"),
            "edad": form.get("edad"),
            "unidad": (form.get("unidad")),        
            "fecha_entrega": form.get("fecha-entrega"),                  
            "descripcion": (form.get("descripcion")),
        }
        #Para la tabla de contactar_por hacemos un dict aparte
        contactos_form = [{
            "nombre": form.get("contactar"),#toktok, whats
            "identificador": (form.get("informar-id"))
        }]
        #se obtienen los archivos subidos
        files = request.files.getlist("files")
        # validamos con las funciones de validations(casi todas las del aux...)
        #reciben una tupla es la misma logica de retornar un error que sea true o false
        #para ver si funciono realmente o no
        error_va, msg_av = validate_aviso(dict_aviso)            
        error_c, msg_ct = validate_contactos(contactos_form) 
        error_f, msg_ft = validate_fotos(files)              
        error_msgs = []
        #alguna de estas falla entonces se hace append del msg que dice que es lo que fallo
        if not error_va: 
            error_msgs.append(msg_av)
        if not error_c: 
            error_msgs.append(msg_ct)
        if not error_f: 
            error_msgs.append(msg_ft)

        if error_msgs:#si hay errores
            for e in error_msgs:#por cada error que se tenga
                if e: flash(e, "error")
            region = db.get_region()
            comuna = db.get_comuna()
            #retornamos la pagina inicial, asi no rellena todo desde 0
            return render_template("aviso.html", region=region, comuna=comuna, form=form)
        #con esto transformamos meses a m y años a a
        unidad_map = {"meses": "m", "años": "a"}
        unidad_medida = unidad_map.get(dict_aviso["unidad"], None)
        # datetime local lo hacve como YYYYMMDDHH:MM y necesaitamos que sea YYYY MM DD HH:MM:SS
        #es importante hacer esta conversion ya que si no se guarda como raro con una T al medio
        fecha_datetime = dict_aviso["fecha_entrega"]
        fecha_entrega = None
        if fecha_datetime:
            if "T" in fecha_datetime and len(fecha_datetime) >= 16:
                fecha_entrega = fecha_datetime.replace("T", " ")
                if len(fecha_entrega) == 16:
                    fecha_entrega += ":00"
        #este es el aviso que le llega a crear_aviso_total, por eso ahi podemos hacer a.blabla
        #esto es transformar todos los datos recibidos a su version final
        aviso = {
            "fecha_ingreso": datetime.utcnow(),
            "comuna_id": int(dict_aviso["select_comuna"]),
            "sector": dict_aviso["sector"] or None, #SE AGREGA OR NONE PUES ES OPCIONAL
            "nombre": dict_aviso["nombre"],
            "email": dict_aviso["email"],
            "celular": dict_aviso["phone"] or None, #SE AGREGA OR NONE PUES ES OPCIONAL
            "tipo": dict_aviso["tipo"],
            "cantidad": int(dict_aviso["cantidad"]),
            "edad": int(dict_aviso["edad"]),
            "unidad_medida": unidad_medida,
            "fecha_entrega": fecha_entrega,
            "descripcion": dict_aviso["descripcion"] or None, #SE AGREGA OR NONE PUES ES OPCIONAL
        }
        # guardamos imagenes
        fotos = []
        for f in files: #En las files subidas, las recorremos
            #okay creo que se deberian validar al menos poniendo un hashing
            #pero no lo hare por que no lo piden CREO, o sea lei y no lo encontre...
            filename = secure_filename(f.filename)
            f.save(os.path.join(UPLOAD_FOLDER, filename))#guardamos en static/uploads
            fotos.append({"ruta_archivo": "/static/uploads","nombre_archivo": filename})
        # guardamos los contactos
        contactos = [c for c in contactos_form]
        #el aviso, lo mandamos a create aviso que recibe los datos ya validados y transformados(segun corresponda)
        #tambien las fotos y los contactos
        error, result = db.crear_aviso_total(aviso, fotos=fotos, contactos=contactos)
        #si algo fallo
        if not error:
            #recargamos la pag
            region = db.get_region()
            comuna = db.get_comuna()
            return render_template("aviso.html", region=region, comuna=comuna, form=form)
        #si no se devuelve a index con el aviso guardado
        return redirect(url_for("portada"))
    #con esto cargamos las regiones y comunas
    region = db.get_region()
    comuna = db.get_comuna()
    return render_template("aviso.html", region=region, comuna=comuna)

#esto es para obtener los datos y mostrarlos en el modal cuando se presione la columna
#en el fondo es un rascado de olla con los codigos de arriba
#ULTRA MEGA IMPORTANTE, como estamos devolviendo un JSON para los datos
#debemos utilizar api, esta funciona para obtener, crear, actualizar y eliminar
#el numero que le sigue a aviso es la id, es decir, vamos a buscar en base a la id del aviso
#tal aviso y devolvemos el json para poder obtener datos.
@app.route("/api/aviso/<int:aviso_id>", methods=["GET"])
def get_aviso_detail(aviso_id):
    session = db.SessionLocal()
    #obtenemos aviso
    aviso = session.query(db.AvisoAdopcion).filter_by(id=aviso_id).first()
    #comunas y regiones
    comuna = session.query(db.Comuna).filter_by(id=aviso.comuna_id).first()
    region = session.query(db.Region).filter_by(id=comuna.region_id).first()
    #fotoooos
    fotos = session.query(db.Foto).filter_by(actividad_id=aviso_id).all()
    fotos_list = [{"nombre_archivo": f.nombre_archivo, "ruta_archivo": f.ruta_archivo} for f in fotos]
    #los contaactos
    contactos = session.query(db.Contacto).filter_by(actividad_id=aviso_id).all()
    contactos_list = [{"nombre": c.nombre, "identificador": c.identificador} for c in contactos]
    session.close()
    #ahora obtenemos toda la info, para poder transformarla a json(jsonify) 
    info = {
        "id": aviso.id,
        "nombre": aviso.nombre,
        "email": aviso.email,
        "celular": aviso.celular,
        "tipo": aviso.tipo,
        "cantidad": aviso.cantidad,
        "edad": aviso.edad,
        "unidad_medida": aviso.unidad_medida,
        "fecha_entrega": aviso.fecha_entrega.strftime("%Y-%m-%d %H:%M"), #esto es para que sea nuevamente un str q se puede leer
        "fecha_ingreso": aviso.fecha_ingreso.strftime("%Y-%m-%d %H:%M"),
        "descripcion": aviso.descripcion,
        "sector": aviso.sector,
        "comuna_nombre": comuna.nombre,
        "region_nombre": region.nombre,
        "fotos": fotos_list,
        "contactos": contactos_list
    }
    return jsonify(info)

#haremos lo mismo con comuna, por que?, asi podremos cargar las comunas
@app.route("/api/comuna", methods=["GET"]) #queremos las comunas, esto es GET
def api_comuna():
    region_id = request.args.get("region_id", type=int) #esto lee los parametros de la URL, entonces lo obtenemos y lo transformamos a int
    comuna = db.get_comuna_con_region(region_id) #obtenemos la comuna segun el id de region 
    return jsonify(comuna) #retornamos el json, por eso es api 

#estadisticas, no sirve pa na por ahora, pero por mientras para que quede listo
@app.route("/estadisticas", methods=["GET"])
def stats():
    return render_template("estadisticas.html")

#MAIN
if __name__ == "__main__":
    app.run(debug=True)
