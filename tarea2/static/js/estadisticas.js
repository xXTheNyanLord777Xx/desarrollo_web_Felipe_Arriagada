//para el boton de volver
const btnVolver = document.getElementById("btn-volver");
const mostrarVolver = () => {
    window.location.href = "../templates/index.html"
}

btnVolver.addEventListener("click", mostrarVolver);