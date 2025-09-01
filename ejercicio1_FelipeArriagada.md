# Ejercicio 1

**Nombre**: [Felipe Arriagada]

---

## Pregunta 1 (6 puntos)

# 1.1 (3 puntos)
Explique por que el realizar validaciones del input del usuario en el front-end es una facilidad pero no una medida de seguridad.

**Respuesta**:

Se debe a que javascript esta siendo ejecutado en el front-end, el navegador. No es medida de seguridad ya que es muy facil de bypasear.Lo que si hacemos es que validamos en el front end ya que es mas eficiente, es un feature. La medida de validacion en el back-end seria una medida de seguridad.

# 1.2 (3 puntos)
Explique en detalle el rol de **HTML, CSS y JavaScript** en la creación del front-end de una aplicación web. Especifique la función de cada tecnología y cómo se combinan para construir una interfaz interactiva y visualmente atractiva.

**Respuesta:**:
primero, el front-end es la parte con la cual interactua el usuario, los botones texto, la cara de la app. Luego, HTML serian todos los botones, titulos, imagenes, etc. Lo que se encuentra presente en la pagina, para ello hace uso de etiquetas que osn las que estan en <>. Sigue CSS, este ve la parte de la estetica, los colores, bordes, etc. Finalmente JavaScript es el "lenguaje" con el que se interactua, es el puente que nos permite decir que hace un boton cuando se presiona sobre el u otras interacciones.
Juntos forman una estructura tal que HTML es el DOM, CSS el CSSOM y JavaScript cambia el DOM. (DOM con CSSOM son los que componen a un navegador)


## Pregunta 2 (6 puntos)
A continuación, se presentan dos tareas prácticas:  

1. **(3 puntos)** Implementar un código que reciba un nombre ingresado por el usuario y muestre un mensaje de bienvenida.  
   - Si el usuario se llama **[Tu Nombre]**, debe mostrarse un mensaje especial en negrita y en color azul.  
   - El contenido debe actualizarse sin recargar la página.  

2. **(3 puntos)** Implementar un contador de calificación con dos botones para aumentar y disminuir la nota actual.  
   - La calificación debe tener valores apropiados.  
   - La calificación debe actualizarse sin recargar la página.  

### Código HTML:
```html
<div>
    <h3>Parte 1: Mensaje de Bienvenida</h3>
    <label for="nombre">Ingrese su nombre:</label>
    <input type="text" id="nombre">
    <button type="button" id="btn-enviar">Enviar</button>
    <p id="mensaje"></p>
</div>

<hr>

<div>
    <h3>Parte 2: Contador de Calificación</h3>
    <p>Nota actual: <span id="calificacion">1</span></p>
    <button type="button" id="btn-disminuir">Disminuir</button>
    <button type="button" id="btn-aumentar">Aumentar</button>
</div>
```


Implemente un sistema para modificar la nota actual, utilizando la plantilla disponible más abajo, y programe únicamente donde se le indica. Se espera que tras apretar un botón, la nota se actualice sin la necesidad de recargar la página. No está permitido modificar el HTML.

**Respuesta**:
```js
// Obtener elementos para el mensaje de bienvenida

// con estos accedemos a la id del elemento, de esta manera lo cambiamos con javascript
//inputs del DOM por el ID, entonces por cada id del html de arriba creamos uno de estos caminos:
let userNameInput = document.getElementById("nombre"); // input del nombre
const btnEnviar = document.getElementById("btn-enviar"); // boton enviar
const mensaje = document.getElementById("mensaje"); //mensaje, el que sale dsp de enviar



// Obtener elementos para el contador

let calificacion = document.getElementById("calificacion"); //calificacion EN LA PANTALLA
const btnAumentar = document.getElementById("btn-aumentar"); //boton aumentar
const btnDisminuir = document.getElementById("btn-disminuir"); //boton disminuir


// Calificación inicial

//Fuera del dom solo tendremos la nota que va cambiando
let notaInicial = 1;

// Función para mostrar mensaje de bienvenida
const mostrarMensaje = () => {
    const nombre = userNameInput.value //accedemos al valor
    //ahora plicamos la condicion, un if nomas
    if (nombre === "Tu Nombre") { 
        // strong seria nuestra negrita, es como el <b> y el color es blue
        //ocupamos inner pues necesitamos cambiar el contenido con etiquetas HTML
        mensaje.innerHTML = `<strong style="color:blue">ohayo ${nombre}-chan</strong>`;
    } else { //el caso donde no es "Tu Nombre", mismo msg pero sin negritas por lo tanto solo ocupamos
        //textContent el cual nos da el texto pelado, sin las etiquetas
        mensaje.textContent = `ohayo ${nombre}-chan`; //jeje
    }

};

// Función para aumentar la calificación
const aumentarCalificacion = () => {
    if (notaInicial < 7) { //si la nota esta bajo 7
        notaInicial++; //aumentamos en 1
        calificacion.textContent = notaInicial //mostramos la nota (actualizar calificacion) con el valor que modificamos
    }

};

// Función para disminuir la calificación
const disminuirCalificacion = () => {
    if (notaInicial > 1) { //si la nota es mayor a 1
        notaInicial--; //le restamos 1
        calificacion.textContent = notaInicial; //nuevamente, actualizamos la nota que se esta mostrando
    }
};

// Asignar eventos
//los eventos son para los botones entonces, tenemos 3 botones:
//no entiendo pq en el aux le ponen btn y no button??? pero filo queda cute
//click es cuando pulsamos, y llamamos a las funciones que realizan la accion del btn
btnEnviar.addEventListener("click", mostrarMensaje);
btnAumentar.addEventListener("click", aumentarCalificacion);
btnDisminuir.addEventListener("click", disminuirCalificacion);

```
