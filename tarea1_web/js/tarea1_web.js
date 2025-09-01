//obtener elementos botones
const btnAviso = document.getElementById("btn-aviso");
const btnListado = document.getElementById("btn-listado");
const btnEstadisticas = document.getElementById("btn-estadisticas");

//funcion que nos redirige a una pagina html llamada aviso
const mostrarAviso = () => {
    window.location.href = "../html/aviso.html"
}
const mostrarListado = () => {
    window.location.href = "../html/listado.html"
}
const mostrarEstadisticas = () => {
    window.location.href = "../html/estadisticas.html"
}

// Asignar eventos
btnAviso.addEventListener("click", mostrarAviso);
btnListado.addEventListener("click", mostrarListado);
btnEstadisticas.addEventListener("click", mostrarEstadisticas);