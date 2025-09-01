//primero debemos ver las variables

//tenemos las siguientes ids de nuestro form:
//nombre, email, phone, contactar, select-region, select-comuna, tipo, cantidad, unidad, fecha-entrega
//descripcion, files, button

//con esto debemos crear funciones del tipo Validate que nos den la validacion tal que al final en un isValid
//se vea que cumplen todas.

//las funciones seran escritas del formato: ValidateId, siendo Id la Id del objeto a validar

const ValidateName = (name) => {
    if(!name) return false;
    let lengthValid = name.trim().length >= 3 && name.trim().length <= 200; //entre 3 y 200 caracteres
    return lengthValid;
}

const ValidateEmail = (email) => {
  if (!email) return false;
  const lengthValid = email.length <= 100;
  const re = /^[\w.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  const formatValid = re.test(email);
  return lengthValid && formatValid;
}


const ValidatePhone = (phone) => {
  if (!phone) return true;//OJO QUE ES OPCIONAL, si no ponen anda igual true
  //pero si ponen algo que siga las reglas:
  let lengthValid = phoneNumber.length >= 8;//mayor a 8
  let re = /^[0-9]+$/; //formato
  let formatValid = re.test(phone);
  return lengthValid && formatValid;
}

// no hay validarcontactar pues es menu de seleccion, pero se necesita que haga display de un bloque de texto
//que si tiene condiciones, para ello ocupamos changeArguments, con algunos cambios eso si:
function changeArguments() {
    const contactar = document.getElementById("contactar"); //nuestro menu de seleccion
    const bloquetexto = document.getElementById("bloque-texto"); //el bloque de texto id

    if (contactar.value !== "") { //cuando elegimos una opcion de contacto se hace display
      bloquetexto.style.display = "block";
    }
    else{ //sino se mantiene oculta
        bloquetexto.style.display = "none";
    }
}
document.getElementById("contactar").addEventListener("change", changeArguments);
//mas abajo se llama a la funcion, que sino explotaba
//ahora nos falta restringir el texto
const ValidateContactar = (bloque) =>{ //deberia ser validar bloque pero para mas entendimiento mejor ese
    let lenghtValid = bloque.trim().length <=100 && bloque.trim().length >= 4 //que cumpla la condicion
    return lenghtValid
}

//sigue select-region y select-comuna que van de la mano, tenemos los datos en region_comuna.js entonces
//de ahi sacaremos los datos para ocuparlos aca en la funcion, como fue llamada en el html antes q este
//entonces podemos manipularlo
//es casi lo mismo solo que se recorre distionto(al tener los datos ordenados de otra manera) y lo hacemos
//en base a nombres e ids

const poblarRegiones = () => {
  const regionSelect = document.getElementById("select-region");
  regionSelect.innerHTML = '<option value="">Seleccione una región</option>';

  regionComuna.regiones.forEach((region) => {
    const option = document.createElement("option");
    option.value = region.numero;    
    option.textContent = region.nombre; 
    regionSelect.appendChild(option);
  });
};

const updateComuna = () => {
  const regionSelect = document.getElementById("select-region");
  const comunaSelect = document.getElementById("select-comuna");
  const selectedRegion = parseInt(regionSelect.value, 10);

  comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';

  const region = regionComuna.regiones.find((r) => r.numero === selectedRegion);
  if (region) {
    region.comunas.forEach((comuna) => {
      const option = document.createElement("option");
      option.value = comuna.id;
      option.textContent = comuna.nombre;
      comunaSelect.appendChild(option);
    });
  }
};

document.getElementById("select-region").addEventListener("change", updateComuna);

window.onload = () => { //al cargar la pag
  changeArguments();
  poblarRegiones();
};

const ValidateSelect = (select) => {
  if(!select) return false;
  return true
}

const ValidateTipo = (tipo) => {
    if (tipo.value !== "") { //cuando se escoge una opcion
      return true; //lo dejamos pasar
    }
    else{ //sino falso y no se puede enviar aviso
        return false;
    }
}

const ValidateUnidad = () =>{
    if (tipo.value !== "") { //cuando se escoge una opcion
      return true; //lo dejamos pasar
    }
    else{ //sino falso y no se puede enviar aviso
        return false;
    }
}

//para validatefiles se ocupa la misma del aux 3

const ValidateFiles = (files) => {
  if (!files) return false;
  let lengthValid = 1 <= files.length && files.length <= 5;//min 1, max 5
  let typeValid = true;
  for (const file of files) {
    let fileFamily = file.type.split("/")[0];
    typeValid &&= fileFamily == "image" || file.type == "application/pdf";
  }
  return lengthValid && typeValid;
}

//con todas nuestras funciones que validan, procedemos a hacer validate form, del aux pero con unos cambios
//que seria añadir las funciones que tenemos aca

const ValidateForm = () => {
  //elemntos del dom
  //nombre, email, phone, contactar, select-region, select-comuna, tipo, cantidad, unidad, fecha-entrega
  //descripcion, files
  let myForm = document.forms["formAviso"];

  let name = myForm["nombre"].value;
  let email = myForm["email"].value;
  let phone = myForm["phone"].value;
  let select_region = myForm["select-region"].value;
  let select_comuna = myForm["select-comuna"].value;
  let tipo = myForm["tipo"].value;
  let unidad = myForm["unidad"].value;
  let files = myForm["files"].files;


  // variables auxiliares de validación y función.
  let invalidInputs = [];
  let isValid = true;
  const setInvalidInput = (inputName) => {
    invalidInputs.push(inputName);
    isValid &&= false;
  };

  // si uno falla se mete en InvalidInput, mencionando cual test fallo
  if (!ValidateName(name)) {
    setInvalidInput("Nombre");
  }
  if (!ValidateEmail(email)) {
    setInvalidInput("Email");
  }
  if (!ValidatePhone(phone)) {
    setInvalidInput("Número");
  }
  if (!ValidateFiles(files)) {
    setInvalidInput("Fotos");
  }
  if (!ValidateSelect(select_region)) {
    setInvalidInput("select-region");
  }
  if (!ValidateSelect(select_comuna)) {
    setInvalidInput("select-comuna");
  }
  if (!ValidateTipo(tipo)) {
    setInvalidInput("tipo");
  }
  if (!ValidateUnidad(unidad)) {
    setInvalidInput("unidad");
  }

  //esto muestra validacion
  let validationBox = document.getElementById("val-box");
  let validationMessageElem = document.getElementById("val-msg");
  let validationListElem = document.getElementById("val-list");
  let formContainer = document.querySelector(".main-container");

  if (!isValid) {
    validationListElem.textContent = "";
    // agregar elementos inválidos al elemento val-list.
    for (input of invalidInputs) {
      let listElement = document.createElement("li");
      listElement.innerText = input;
      validationListElem.append(listElement);
    }
    // establecer val-msg
    validationMessageElem.innerText = "Los siguientes campos son inválidos:";

    // aplicar estilos de error
    validationBox.style.backgroundColor = "#ffdddd";
    validationBox.style.borderLeftColor = "#f44336";

    // hacer visible el mensaje de validación
    validationBox.hidden = false;
  } else {
    // Ocultar el formulario
    myForm.style.display = "none";

    // establecer mensaje de éxito
    validationMessageElem.innerText = "¡Formulario válido! ¿Deseas enviarlo o volver?";
    validationListElem.textContent = "";

    // aplicar estilos de éxito
    validationBox.style.backgroundColor = "#ddffdd";
    validationBox.style.borderLeftColor = "#4CAF50";

    // Agregar botones para enviar el formulario o volver
    let submitButton = document.createElement("button");
    submitButton.innerText = "Enviar";
    submitButton.style.marginRight = "10px";
    submitButton.addEventListener("click", () => {
      // myForm.submit();
      // no tenemos un backend al cual enviarle los datos
    });

    let backButton = document.createElement("button"); //boton para devolverse
    backButton.innerText = "Volver";
    backButton.addEventListener("click", () => {
      // Mostrar el formulario nuevamente
      myForm.style.display = "block";
      validationBox.hidden = true;
    });

    validationListElem.appendChild(submitButton);
    validationListElem.appendChild(backButton);

    // hacer visible el mensaje de validación
    validationBox.hidden = false;
  }
};

//btns
let agregarBtn = document.getElementById("agregar-btn");
let volverBtn = document.getElementById("btn-volver");

const mostrarPortada = () => {
    window.location.href = "../html/tarea1_web.html"
}

agregarBtn.addEventListener("click", ValidateForm); //agregar es con validate form
volverBtn.addEventListener("click", mostrarPortada); //back es con mostrarPortada