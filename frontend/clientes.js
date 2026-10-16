// ID en edición, null significa crear nuevo
let idEnEdicion = null;

async function cargarClientes() {
    const respuesta = await fetch("http://localhost:3000/clientes");
    const clientes = await respuesta.json();
    const lista = document.getElementById("lista");
    lista.innerHTML = "";
    if (clientes.length === 0) {
        lista.textContent = "Aún no hay clientes.";
        return;
    }
    clientes.forEach((cliente) => {
        const div = document.createElement("div");
        div.className = "cliente";
        div.innerHTML = `
            <strong>${cliente.nombre}</strong><br>
            Tel: ${cliente.telefono || "-"} | Email: ${cliente.email || "-"}<br>
            Dir: ${cliente.direccion || "-"}
            <br><button class="secundario" onclick="editarCliente(${cliente.id})">Editar</button>
        `;
        lista.appendChild(div);
    });
}

async function editarCliente(id) {
    const respuesta = await fetch("http://localhost:3000/clientes");
    const clientes = await respuesta.json();
    const cliente = clientes.find((c) => c.id === id);
    if (!cliente) return;

    document.getElementById("nombre").value = cliente.nombre || "";
    document.getElementById("telefono").value = cliente.telefono || "";
    document.getElementById("email").value = cliente.email || "";
    document.getElementById("direccion").value = cliente.direccion || "";

    idEnEdicion = id;
    document.getElementById("titulo-form").textContent = `Editar cliente ${id}`;
    document.getElementById("btn-guardar").textContent = "Actualizar cliente";
    document.getElementById("btn-cancelar").style.display = "inline-block";
}
window.editarCliente = editarCliente;

function cancelarEdicion() {
    idEnEdicion = null;
    document.getElementById("form-cliente").reset();
    document.getElementById("titulo-form").textContent = "Crear cliente";
    document.getElementById("btn-guardar").textContent = "Guardar cliente";
    document.getElementById("btn-cancelar").style.display = "none";
    document.getElementById("mensaje").textContent = "";
}

document.getElementById("btn-cancelar").addEventListener("click", cancelarEdicion);

document.getElementById("form-cliente").addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const mensaje = document.getElementById("mensaje");

    const datos = {
        nombre: document.getElementById("nombre").value,
        telefono: document.getElementById("telefono").value,
        email: document.getElementById("email").value,
        direccion: document.getElementById("direccion").value
    };

    try {
        let respuesta;
        if (idEnEdicion === null) {
            respuesta = await fetch("http://localhost:3000/clientes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
        } else {
            respuesta = await fetch(`http://localhost:3000/clientes/${idEnEdicion}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
        }

        const resultado = await respuesta.json();
        if (!respuesta.ok) {
            mensaje.textContent = "Error: " + resultado.mensaje;
            return;
        }
        mensaje.textContent = resultado.mensaje;
        cancelarEdicion();
        await cargarClientes();
    } catch (error) {
        mensaje.textContent = "No se pudo conectar con el servidor. Verifica npm start.";
    }
});

cargarClientes();
