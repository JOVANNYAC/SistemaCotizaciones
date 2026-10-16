// Guardamos datos en memoria para filtrar sin pedir al servidor cada vez
let todasCotizaciones = [];
let todosClientes = [];

function nombreCliente(id) {
    const cliente = todosClientes.find((c) => c.id === id);
    return cliente ? cliente.nombre : `ID ${id}`;
}

// Cargar clientes en el select de crear y en el filtro
async function cargarClientes() {
    const respuesta = await fetch("http://localhost:3000/clientes");
    todosClientes = await respuesta.json();
    const select = document.getElementById("cliente");
    const filtro = document.getElementById("filtro-cliente");
    select.innerHTML = "";
    filtro.innerHTML = '<option value="">Todos los clientes</option>';
    todosClientes.forEach((cliente) => {
        const opcion = document.createElement("option");
        opcion.value = cliente.id;
        opcion.textContent = cliente.nombre;
        select.appendChild(opcion);

        const opcionFiltro = document.createElement("option");
        opcionFiltro.value = cliente.id;
        opcionFiltro.textContent = cliente.nombre;
        filtro.appendChild(opcionFiltro);
    });
}

// Cargar historial de cotizaciones
async function cargarCotizaciones() {
    const respuesta = await fetch("http://localhost:3000/cotizaciones");
    todasCotizaciones = await respuesta.json();
    pintarCotizaciones();
}

// Pintar lista aplicando búsqueda y filtro
function pintarCotizaciones() {
    const texto = document.getElementById("buscar").value.toLowerCase().trim();
    const clienteFiltro = document.getElementById("filtro-cliente").value;
    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    const filtradas = todasCotizaciones.filter((coti) => {
        if (clienteFiltro && String(coti.clienteId) !== clienteFiltro) {
            return false;
        }
        if (!texto) {
            return true;
        }
        const conceptos = coti.items.map((i) => i.descripcion.toLowerCase()).join(" ");
        return String(coti.id).includes(texto)
            || nombreCliente(coti.clienteId).toLowerCase().includes(texto)
            || conceptos.includes(texto);
    });

    if (filtradas.length === 0) {
        lista.textContent = "Sin resultados para esa búsqueda.";
        return;
    }
    filtradas.forEach((coti) => {
        const div = document.createElement("div");
        div.className = "cotizacion";
        div.innerHTML = `
            <strong>Folio ${coti.id}</strong> - ${nombreCliente(coti.clienteId)} - ${coti.fecha}<br>
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
window.descargarPdf = descargarPdf;

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

// Filtros en vivo
document.getElementById("buscar").addEventListener("input", pintarCotizaciones);
document.getElementById("filtro-cliente").addEventListener("change", pintarCotizaciones);

// Carga inicial
cargarClientes().then(cargarCotizaciones);
