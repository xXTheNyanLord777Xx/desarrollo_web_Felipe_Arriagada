//para el boton de volver
const btnVolver = document.getElementById("btn-volver");
const mostrarVolver = () => {
    window.location.href = "../html/tarea1_web.html"
}

btnVolver.addEventListener("click", mostrarVolver);