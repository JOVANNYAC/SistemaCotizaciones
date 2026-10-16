let todosTrabajos = [];
let todosClientes = [];
let todasCotizaciones = [];

function nombreCliente(id) {
    const c = todosClientes.find((x) => x.id === id);
    return c ? c.nombre : `ID ${id}`;
}

async function cargarBase() {
    const mensaje = document.getElementById("mensaje");
    try {
        const [rCli, rCoti, rTra] = await Promise.all([
            fetch("http://localhost:3000/clientes"),
            fetch("http://localhost:3000/cotizaciones"),
            fetch("http://localhost:3000/trabajos")
        ]);
        if (!rCli.ok || !rCoti.ok || !rTra.ok) {
            throw new Error("API no lista. Reinicia npm start con el código nuevo.");
        }
        todosClientes = await rCli.json();
    todasCotizaciones = await rCoti.json();
    todosTrabajos = await rTra.json();

    const selCli = document.getElementById("cliente");
    const selCoti = document.getElementById("cotizacion");
    const filtroCli = document.getElementById("filtro-cliente");
    selCli.innerHTML = "";
    filtroCli.innerHTML = '<option value="">Todos los clientes</option>';
    todosClientes.forEach((c) => {
        const o1 = document.createElement("option");
        o1.value = c.id; o1.textContent = c.nombre; selCli.appendChild(o1);
        const o2 = document.createElement("option");
        o2.value = c.id; o2.textContent = c.nombre; filtroCli.appendChild(o2);
    });
    selCoti.innerHTML = '<option value="">Sin cotización - trabajo directo</option>';
    todasCotizaciones.forEach((ct) => {
        const o = document.createElement("option");
        o.value = ct.id;
        o.textContent = `Folio ${ct.id} - ${nombreCliente(ct.clienteId)} - $${ct.total}`;
        selCoti.appendChild(o);
    });
    pintar();
    } catch (e) {
        mensaje.textContent = "No se pudo cargar: " + e.message;
        document.getElementById("lista").textContent = "Revisa que npm start esté reiniciado y abre /trabajos directo.";
    }
}

function pintar() {
    const est = document.getElementById("filtro-estado").value;
    const cli = document.getElementById("filtro-cliente").value;
    const lista = document.getElementById("lista");
    lista.innerHTML = "";
    const filtrados = todosTrabajos.filter((t) => {
        if (est && t.estado !== est) return false;
        if (cli && String(t.clienteId) !== cli) return false;
        return true;
    });
    if (filtrados.length === 0) {
        lista.textContent = "Sin trabajos para ese filtro.";
        return;
    }
    filtrados.forEach((t) => {
        const div = document.createElement("div");
        div.className = "trabajo";
        div.innerHTML = `
            <strong>${t.descripcion}</strong> <span class="estado">${t.estado}</span><br>
            Cliente: ${nombreCliente(t.clienteId)} | ${t.fecha} | Total: $${t.total}
            ${t.cotizacionId ? `| Cotización folio ${t.cotizacionId}` : "| Sin cotización"}<br>
            <button class="secundario" onclick="cambiarEstado(${t.id}, 'por_cobrar')">Por cobrar</button>
            <button class="secundario" onclick="cambiarEstado(${t.id}, 'facturado')">Facturado</button>
            <button class="secundario" onclick="cambiarEstado(${t.id}, 'cobrado')">Cobrado</button>
        `;
        lista.appendChild(div);
    });
}

async function cambiarEstado(id, estado) {
    const mensaje = document.getElementById("mensaje");
    try {
        const r = await fetch(`http://localhost:3000/trabajos/${id}/estado`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado })
        });
        if (!r.ok) {
            const res = await r.json();
            if (mensaje) mensaje.textContent = "Error: " + res.mensaje;
            return;
        }
        const r2 = await fetch("http://localhost:3000/trabajos");
        todosTrabajos = await r2.json();
        pintar();
    } catch (e) {
        if (mensaje) mensaje.textContent = "No se pudo conectar. Verifica npm start reiniciado.";
    }
}

// Exponer para onclick en HTML
window.cambiarEstado = cambiarEstado;

document.getElementById("cotizacion").addEventListener("change", (e) => {
    const id = Number(e.target.value);
    const coti = todasCotizaciones.find((c) => c.id === id);
    if (coti) {
        document.getElementById("total").value = coti.total;
        document.getElementById("cliente").value = String(coti.clienteId);
        if (!document.getElementById("descripcion").value) {
            document.getElementById("descripcion").value = coti.items.map((i) => i.descripcion).join(", ");
        }
    }
});

document.getElementById("form-trabajo").addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const mensaje = document.getElementById("mensaje");
    const datos = {
        clienteId: Number(document.getElementById("cliente").value),
        cotizacionId: document.getElementById("cotizacion").value ? Number(document.getElementById("cotizacion").value) : null,
        descripcion: document.getElementById("descripcion").value,
        estado: document.getElementById("estado").value,
        total: Number(document.getElementById("total").value)
    };
    try {
        const r = await fetch("http://localhost:3000/trabajos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });
        const res = await r.json();
        if (!r.ok) { mensaje.textContent = "Error: " + res.mensaje; return; }
        mensaje.textContent = res.mensaje;
        const r2 = await fetch("http://localhost:3000/trabajos");
        todosTrabajos = await r2.json();
        pintar();
    } catch (e) {
        mensaje.textContent = "No se pudo conectar. Verifica npm start.";
    }
});

document.getElementById("filtro-estado").addEventListener("change", pintar);
document.getElementById("filtro-cliente").addEventListener("change", pintar);

cargarBase();
