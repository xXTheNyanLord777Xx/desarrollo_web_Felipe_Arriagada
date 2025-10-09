import re
import filetype
# -------------------------------
# Validaciones de avisos
# -------------------------------

def validate_aviso(aviso: dict) -> tuple[bool, str]:
    # nombre
    if not aviso["nombre"] or len(aviso["nombre"]) < 3 or len(aviso["nombre"]) > 200:
        return False, "El nombre debe tener entre 3 y 200 caracteres."

    # email
    email = aviso["email"]
    if not email or not re.match(r"^[\w\.-]+@[\w\.-]+\.[A-Za-z]{2,}$", email):
        return False, "El email ingresado no es válido."
    if len(email) > 100:
        return False, "El email no puede tener más de 100 caracteres."

    # telefono (opcional)
    phone = aviso["phone"]
    if phone and not re.match(r"^\+\d{2,3}\.\d{8,11}$", phone):
        return False, "El teléfono debe tener formato +NNN.NNNNNNNN"

    # tipo
    if aviso["tipo"] not in ("gato", "perro"):
        return False, "Debe seleccionar tipo 'gato' o 'perro'."

    # cantidad
    if not aviso["cantidad"].isdigit() or int(aviso["cantidad"]) < 1:
        return False, "La cantidad debe ser un número entero mayor o igual a 1."

    # edad
    if not aviso["edad"].isdigit() or int(aviso["edad"]) < 1:
        return False, "La edad debe ser un número entero mayor o igual a 1."

    # unidad
    if aviso["unidad"] not in ("meses", "años", "anios"):
        return False, "La unidad de edad debe ser 'meses' o 'años'."

    # comuna obligatoria
    if not aviso["select_comuna"] or not aviso["select_comuna"].isdigit():
        return False, "Debe seleccionar una comuna."

    return True, ""


#CONTACTOS

def validate_contactos(contactos: list[dict]) -> tuple[bool, str]:
    for c in contactos:
        if not c["nombre"] or not c["identificador"]:
            continue  
        if len(c["identificador"]) < 4 or len(c["identificador"]) > 50:
            return False, "El identificador debe tener entre 4 y 50 caracteres."
    return True, ""


#FOTOS

ALLOWED_EXT = {"png", "jpg", "jpeg", "gif", "webp"}

def validate_fotos(files) -> tuple[bool, str]:
    valid_files = [f for f in files if f and f.filename]
    if len(valid_files) < 1:
        return False, "Debe adjuntar al menos 1 foto."
    if len(valid_files) > 5:
        return False, "No puede adjuntar más de 5 fotos."

    for f in valid_files:
        if "." not in f.filename:
            return False, f"El archivo {f.filename} no tiene extensión válida."
        ext = f.filename.rsplit(".", 1)[1].lower()
        if ext not in ALLOWED_EXT:
            return False, f"Extensión no permitida: {ext}."

    return True, ""

def validate_username(value):
    return value and len(value) > 4


def validate_password(value):
    malas = ["1234", "admin1", "odio a mis Aux >:(2"]
    return bool(re.search(r"\d", value)) and not value in malas

def validate_email(value):
    return "@" in value

def validate_conf_text(conf_text):
    return True

def validate_conf_img(conf_img):
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
    ALLOWED_MIMETYPES = {"image/jpeg", "image/png", "image/gif"}

    # check if a file was submitted
    if conf_img is None:
        return False

    # check if the browser submitted an empty file
    if conf_img.filename == "":
        return False
    
    # check file extension
    ftype_guess = filetype.guess(conf_img)
    if ftype_guess.extension not in ALLOWED_EXTENSIONS:
        return False
    # check mimetype
    if ftype_guess.mime not in ALLOWED_MIMETYPES:
        return False
    return True