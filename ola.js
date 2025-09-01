// Obtener elementos para el mensaje de bienvenida
const inputNombre = document.getElementById("nombre");
const btnEnviar = document.getElementById("btn-enviar");
const mensaje = document.getElementById("mensaje");

// Obtener elementos para el contador
const spanCalificacion = document.getElementById("calificacion");
const btnAumentar = document.getElementById("btn-aumentar");
const btnDisminuir = document.getElementById("btn-disminuir");

// Calificación inicial
let calificacion = 1;

// Función para mostrar mensaje de bienvenida
const mostrarMensaje = () => {
    const nombre = inputNombre.value.trim(); // quitamos espacios extra
    if (nombre === "Tu Nombre") { // aquí pones tu nombre
        mensaje.innerHTML = `<strong style="color:blue">¡Bienvenido, ${nombre}!</strong>`;
    } else {
        mensaje.textContent = `Bienvenido, ${nombre}`;
    }
};

// Función para aumentar la calificación
const aumentarCalificacion = () => {
    if (calificacion < 7) { // límite máximo
        calificacion++;
        spanCalificacion.textContent = calificacion;
    }
};

// Función para disminuir la calificación
const disminuirCalificacion = () => {
    if (calificacion > 1) { // límite mínimo
        calificacion--;
        spanCalificacion.textContent = calificacion;
    }
};

// Asignar eventos
btnEnviar.addEventListener("click", mostrarMensaje);
btnAumentar.addEventListener("click", aumentarCalificacion);
btnDisminuir.addEventListener("click", disminuirCalificacion);