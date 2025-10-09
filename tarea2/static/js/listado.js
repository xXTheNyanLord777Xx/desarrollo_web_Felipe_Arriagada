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
            //lo mostramos
            modalAviso.style.display = 'flex';
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
