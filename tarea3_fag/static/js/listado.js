// Para agrandar y achicar las imagenes haremos uso de un modal
var modal = document.createElement('div'); //lo vi en internet, crea un div que es el fondo del modal
modal.style.position = 'fixed'; //fija la posicion asi si hacemos scrol o algo no se mueva
//estas dos lineas ubican el modal en 0.0
modal.style.top = '0';
modal.style.left = '0';
//ancho largo
modal.style.width = '100%';
modal.style.height = '100%';
//color del fondo
modal.style.background = 'rgba(0,0,0,0.7)';
//lo oculta al inicio
modal.style.display = 'none';
//centramos la cuadrado y la imagen
modal.style.alignItems = 'center';
modal.style.justifyContent = 'center';
//la poisicion en z, es para que este por sobre todo, CAMBIO: AHORA ESTARA SOBRE EL MODAL DE ABAJO
modal.style.zIndex = '10000';

//lo mismo pero ahora creamos el cuadrado blanco donde estara la foto
var cuadrado = document.createElement('div');
//hacemos el fondo blanco
cuadrado.style.background = 'white';
//esto es para que no rellene la foto en el cuadrado blanco, asi mantenemos su tamaño
cuadrado.style.padding = '10px';
//centramos
cuadrado.style.textAlign = 'center';

var imgGrande = document.createElement('img');
//el tamaño de la img
imgGrande.width = 800;   
imgGrande.height = 600;  

//esto es para el boton de cerrar que aparece al agrandar la img
var btnCerrar = document.createElement('button');

//lo que dice el boton
btnCerrar.textContent = 'Cerrar';
//lo mostramos y centramos con auto y 10px
btnCerrar.style.display = 'block';
btnCerrar.style.margin = '10px auto 0 auto';
//cuando se clickea sobre el se cierra
btnCerrar.onclick = () => {
  modal.style.display = 'none';
  imgGrande.src = '';
};

//esto hace que tanto la img,caja y boton esten dentro de la caja
cuadrado.appendChild(imgGrande);
cuadrado.appendChild(btnCerrar);
modal.appendChild(cuadrado);
//AGREGAMOS MODAL A LA PAG
document.body.appendChild(modal);

//funcion para vergrande, en el html tienen el onclick y se ejecuta esto:
function verGrande(img) {
  var grande = img.getAttribute('src');
  imgGrande.src = grande;
  modal.style.display = 'flex';
}

//MODAL DE LA COLUMNA PARA T2

//seleccionamos los elementos que utilizaremos en el modal
const modalAviso = document.getElementById('modal-aviso');//el del aviso
const modalContent = document.getElementById('modal-content');//su contenido
const btnCerrarModal = document.getElementById('btn-cerrar-modal');//boton para cerrarlo

//para cerrarlo es lo mismo que los otros botones, ojito que el modal tiene que estar oculto
btnCerrarModal.onclick = () => {
    modalAviso.style.display = 'none';//con este controlamos cuando se muestra 
    modalContent.innerHTML = '';//esto lo limpia, asi nos aseguramos de que no quede informacion anterior guardada
}

//TAREA 3



//ahora una funcion para mostrar el aviso del modal
//basicamente recibe el id del aviso que viene del html
//para saber cual columna estamos utilizando y que datos poner
function mostrarDetalleAviso(avisoId) {
    //fetch hace una peticion al servidor, esto es, hacer un GET
    //luego el then convierte nuestra respuesta en un json, para que podamos manipularlo con javascript
    //then se utiliza para que una vez suceda la linea, ocurre lo siguiente
    fetch(`/api/aviso/${avisoId}`).then(response => response.json()).then(aviso => {
            
            //Con los datos ya listos construimos el html que sera nuestro modal
            //como existen datos que son opcionales, se utilizo ?, que basicamente te da el beneficio a duda
            //por el lado derecho lo que sicede si es Verdadero, el otro el Falso
            //de esta manera si no hay algun dato se rellena con str vacio "" 
            let html = `
                <h2>Detalles del Aviso #${aviso.id}</h2>
                
                <div style="margin: 20px 0;">
                    <h3>Info</h3>
                    <p><strong>Tipo:</strong> ${aviso.tipo}</p>
                    <p><strong>Cantidad:</strong> ${aviso.cantidad}</p>
                    <p><strong>Edad:</strong> ${aviso.edad} ${aviso.unidad_medida === 'm' ? 'meses' : 'años'}</p> 
                    ${aviso.descripcion ? `<p><strong>Descripción:</strong> ${aviso.descripcion}</p>` : ''}
                </div>
                
                <div style="margin: 20px 0;">
                    <h3>Ubicacion</h3>
                    <p><strong>Región:</strong> ${aviso.region_nombre}</p>
                    <p><strong>Comuna:</strong> ${aviso.comuna_nombre}</p>
                    ${aviso.sector ? `<p><strong>Sector:</strong> ${aviso.sector}</p>` : ''}
                </div>
                
                <div style="margin: 20px 0;">
                    <h3>Contacto</h3>
                    <p><strong>Nombre:</strong> ${aviso.nombre}</p>
                    <p><strong>Email:</strong> ${aviso.email}</p>
                    ${aviso.celular ? `<p><strong>Celular:</strong> ${aviso.celular}</p>` : ''}
                </div>
                
                <div style="margin: 20px 0;">
                    <h3>Contactar por:</h3>
                    <p><strong>${aviso.contactos[0].nombre}:</strong> ${aviso.contactos[0].identificador}</p>
                </div>
                
                <div style="margin: 20px 0;">
                    <h3>Fechas</h3>
                    <p><strong>Fecha de ingreso:</strong> ${aviso.fecha_ingreso}</p>
                    <p><strong>Fecha de entrega:</strong> ${aviso.fecha_entrega}</p>
                </div>

                <div style="margin: 20px 0;">

                    <h3>Comentarios</h3>
                    <ul id="lista-comentarios" style="padding-left:16px; margin-bottom:12px;"></ul>
                        <h3>Agregar comentario</h3>
                        <form id="form-comentario" novalidate>
                <div>
                        <label>Nombre
                        <input type="text" id="c-nombre" name="nombre" minlength="3" maxlength="80" required>
                        </label>
                </div>
                <div>
                    <label>Comentario 
                    <textarea id="c-texto" name="texto" rows="4" cols="50" minlength="5" required></textarea>
                    </label>
                </div>
                    <button id="agregar-btn" type="button">Enviar</button>
                    <div id="c-errores" style="color:#c00; margin-top:6px;"></div>
                        </form>
                </div>
                
                <div style="margin: 20px 0;">
                    <h3>Fotos</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                        <img src="${aviso.fotos[0].ruta_archivo}/${aviso.fotos[0].nombre_archivo}" 
                             style="width: 150px; height: 150px; object-fit: cover; cursor: pointer; border-radius: 4px;"
                             onclick="verGrande(this)" alt="Foto del aviso">
                    </div>
                </div>

            `;
            //insertamos el html creado en el modal
            modalContent.innerHTML = html;
           
            //PARTE CARGAR LOS COMENTARIOS
            //debemos hacerlo dentro del modal que es basicamente el html 2
            //primero obtenemos el ul, que esta definido en el html de arriba
            //que en este caso es la lista de comentarios
            const ul = document.getElementById("lista-comentarios");

            //comprobamos que el con la validacion nica lo es, pero nos permite ver cuando hay o no
            //hay comentarios, es mas q nada para mostrar el mensaje de que no hay comentarios
            if (aviso.comentarios.length > 0) {
                //por cada comentario
                aviso.comentarios.forEach(c => {
                    //creamos un nuevo elemento li y le damos el siguiente formato css
                    const li = document.createElement("li");
                    //formato css(espacios fondos y bordes)
                    li.style.marginBottom = "10px";
                    li.style.padding = "8px";
                    li.style.backgroundColor = "#f5f5f5";
                    li.style.borderRadius = "4px";
                    //este es para el formato del comentario
                    li.innerHTML = `<strong>${c.nombre}</strong> <span style="color:#666; font-size:0.9em;">(${c.fecha})</span><br>${c.texto}`;
                    //agregamos el comentario a la lista
                    ul.appendChild(li);
                });
            } else {
                //esto es para mostrar que no hay comentarios :ppp
                ul.innerHTML = "<li style='color:#666;'>No hay comentarios aún.</li>";
            }

            //EL FORMULARIO

            //obtenemos el formulario
            const form = document.getElementById("form-comentario");
            //guardamos la id en dataset
            form.dataset.avisoId = avisoId;

            //boton de enviar:
            //un eventlistener de click en donde obtenemos el nombre texto y donde mostramos errores
            document.getElementById("agregar-btn").addEventListener("click", () => {
              const nombre = document.getElementById("c-nombre").value.trim();
              const texto  = document.getElementById("c-texto").value.trim();
              const box    = document.getElementById("c-errores");

              const errores = [];
              //validamos
              if (nombre.length < 3 || nombre.length > 80) {
                errores.push("El nombre debe tener entre 3 y 80 caracteres.");
              }
              if (texto.length < 5) {
                errores.push("El comentario debe tener al menos 5 caracteres.");
              }
              if (errores.length) {
                //mostramos los errores en la cajita de errores creada y no enviamos nada
                box.textContent = errores.join(" ");
                return;
              }
              //si no hay errores no mostramos nada
              box.textContent = "";
              
              //para enviar los datos hacemos el formdata
              const formData = new FormData();
              //añadimos el nombre y texto
              formData.append("nombre", nombre);
              formData.append("texto", texto);
              
              //hacemos peticion para crear nuevo comentario
              fetch(`/api/aviso/${avisoId}/comentario`, {
                method: "POST",
                body: formData  
              })
              //ahora procesamos la respuesta y la parseamos
              .then(async r => {
                //parseamos
                const payload = await r.json();
                //obtenemos el comentario
                const c = payload.comentario;

                //esto es para quitar el no hay comentarios
                //queryselector busca en li los que tengan el atributo dado
                //en este caso sera el msg no hay comentarios
                const mensajeVacio = ul.querySelector('li[style*="color:#666"]');
                if (mensajeVacio) { //si existe lo dejamos en vacio
                    ul.innerHTML = "";
                }
              
                //Con los mismos estilos creamos el elemento
                const li = document.createElement("li");
                li.style.marginBottom = "10px";
                li.style.padding = "8px";
                li.style.backgroundColor = "#f5f5f5";
                li.style.borderRadius = "4px";
                li.innerHTML = `<strong>${c.nombre}</strong> <span style="color:#666; font-size:0.9em;">(${c.fecha})</span><br>${c.texto}`;
                
                //agregamos a la lista comentarios
                ul.prepend(li); 
                //limpiamos el form
                form.reset(); 
                //limpiamos la tabla de erroes
                box.textContent = ""; 
            })
                .catch(err => {//el catch por si hay algun error
                  console.error(err);
                  box.textContent = "Error";
                });
              });

              //mostramos el modal
              modalAviso.style.display = 'flex';
            })
            .catch(err => {//hacemos catch del primer fetch que es el de modal
              console.error("Error en modal", err);
            });
        }

document.addEventListener('DOMContentLoaded', () => {
    //seleccionamos la fila
    const filas = document.querySelectorAll('.fila-clickable');
    //por cada fila en filas
    filas.forEach(fila => {
        const avisoId = fila.getAttribute('data-aviso-id');//obtenemos el dato
        //si tenemos el avisoId, entonces al presionar se muestra el detalle de aviso
        if (avisoId) {
            fila.style.cursor = 'pointer';
            fila.onclick = () => mostrarDetalleAviso(avisoId);
        }
    });
});

//para el boton de volver
const btnVolver = document.getElementById("btn-volver");
const mostrarVolver = () => {
    window.location.href = "../templates/index.html"
}

btnVolver.addEventListener("click", mostrarVolver);
;
