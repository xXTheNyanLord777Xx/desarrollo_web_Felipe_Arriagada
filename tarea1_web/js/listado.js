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
//la poisicion en z, es para que este por sobre todo
modal.style.zIndex = '9999';

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
//para el boton de volver
const btnVolver = document.getElementById("btn-volver");
const mostrarVolver = () => {
    window.location.href = "../html/tarea1_web.html"
}

btnVolver.addEventListener("click", mostrarVolver);
;
