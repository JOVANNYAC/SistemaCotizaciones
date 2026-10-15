// Cargar clientes en el select
async function cargarClientes() {
    const respuesta = await fetch("http://localhost:3000/clientes");
    const clientes = await respuesta.json();
    const select = document.getElementById("cliente");
    select.innerHTML = "";
    clientes.forEach((cliente) => {
        const opcion = document.createElement("option");
        opcion.value = cliente.id;
        opcion.textContent = cliente.nombre;
        select.appendChild(opcion);
    });
}

// Cargar historial de cotizaciones
async function cargarCotizaciones() {
    const respuesta = await fetch("http://localhost:3000/cotizaciones");
    const cotizaciones = await respuesta.json();
    const lista = document.getElementById("lista");
    lista.innerHTML = "";
    if (cotizaciones.length === 0) {
        lista.textContent = "Aún no hay cotizaciones.";
        return;
    }
    cotizaciones.forEach((coti) => {
        const div = document.createElement("div");
        div.className = "cotizacion";
        div.innerHTML = `
            <strong>Folio ${coti.id}</strong> - Cliente ${coti.clienteId} - ${coti.fecha}<br>
            Total: $${coti.total}
            <button class="secundario" onclick="descargarPdf(${coti.id})">Descargar PDF</button>
        `;
        lista.appendChild(div);
    });
}

// Descargar PDF de una cotización
function descargarPdf(id) {
    window.open(`http://localhost:3000/cotizaciones/${id}/pdf`, "_blank");
}

// Agregar otro item al formulario
document.getElementById("agregar-item").addEventListener("click", () => {
    const contenedor = document.getElementById("items");
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
        <label>Descripción:</label>
        <input type="text" class="descripcion" required>
        <label>Cantidad:</label>
        <input type="number" class="cantidad" value="1" min="1" required>
        <label>Precio:</label>
        <input type="number" class="precio" value="0" min="0" step="0.01" required>
    `;
    contenedor.appendChild(div);
});

// Enviar formulario para crear cotización
document.getElementById("form-cotizacion").addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const mensaje = document.getElementById("mensaje");

    const clienteId = Number(document.getElementById("cliente").value);
    const descripciones = document.querySelectorAll(".descripcion");
    const cantidades = document.querySelectorAll(".cantidad");
    const precios = document.querySelectorAll(".precio");

    const items = [];
    for (let i = 0; i < descripciones.length; i++) {
        items.push({
            descripcion: descripciones[i].value,
            cantidad: Number(cantidades[i].value),
            precio: Number(precios[i].value)
        });
    }

    try {
        const respuesta = await fetch("http://localhost:3000/cotizaciones", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clienteId, items })
        });
        const datos = await respuesta.json();
        if (!respuesta.ok) {
            mensaje.textContent = "Error: " + datos.mensaje;
            return;
        }
        mensaje.textContent = `Cotización ${datos.cotizacion.id} creada con total $${datos.cotizacion.total}`;
        await cargarCotizaciones();
    } catch (error) {
        mensaje.textContent = "No se pudo conectar con el servidor. Verifica npm start.";
    }
});

// Carga inicial
cargarClientes();
cargarCotizaciones();
