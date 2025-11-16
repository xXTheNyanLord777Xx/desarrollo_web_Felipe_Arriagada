document.querySelectorAll('.btn-evaluar').forEach(btn => {
    btn.addEventListener('click', async () => {

        const id  = btn.dataset.id;

        const input = prompt('Ingresa una nota entre 1 y 7:');
        if (input === null) return;

        const nota = parseInt(input, 10);
        if (Number.isNaN(nota) || nota < 1 || nota > 7) {
            alert("La nota debe ser un numero entre 1 y 7:");
            return;
        }

        try {
            const response = await fetch(`/set-nota/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    nota: nota
                })
            });

            const data = await response.json();

            if (!data.ok) {
                alert("Error: " + data.error);
                return;
            }

            const fila = btn.closest("tr");
            const colProm = fila.querySelector(".col-promedio");

            colProm.textContent = data.promedio.toFixed(1);

            alert("Nota subida correctamente");

        } catch (err) {
            alert("Error en servidor");
            console.error(err);
        }
    });
});
