let todos = [];

async function cargarBase() {
    const mensaje = document.getElementById("mensaje");
    try {
        const [rCli, rCoti, rTra, rPen] = await Promise.all([
            fetch("http://localhost:3000/clientes"),
            fetch("http://localhost:3000/cotizaciones"),
            fetch("http://localhost:3000/trabajos"),
            fetch("http://localhost:3000/pendientes")
        ]);
        if (!rCli.ok || !rCoti.ok || !rTra.ok || !rPen.ok) {
            throw new Error("API no lista. Reinicia npm start con el código nuevo.");
        }
        const clientes = await rCli.json();
    const cotis = await rCoti.json();
    const trabs = await rTra.json();
    todos = await rPen.json();

    const selCli = document.getElementById("cliente");
    clientes.forEach((c) => {
        const o = document.createElement("option");
        o.value = c.id; o.textContent = c.nombre; selCli.appendChild(o);
    });
    const selCoti = document.getElementById("cotizacion");
    cotis.forEach((c) => {
        const o = document.createElement("option");
        o.value = c.id; o.textContent = `Folio ${c.id} - $${c.total}`; selCoti.appendChild(o);
    });
    const selTra = document.getElementById("trabajo");
    trabs.forEach((t) => {
        const o = document.createElement("option");
        o.value = t.id; o.textContent = `${t.descripcion} (${t.estado})`; selTra.appendChild(o);
    });
    pintar();
    } catch (e) {
        mensaje.textContent = "No se pudo cargar: " + e.message;
        document.getElementById("lista").textContent = "Revisa que npm start esté reiniciado con el código nuevo y abre /pendientes directo.";
    }
}

function pintar() {
    const lista = document.getElementById("lista");
    lista.innerHTML = "";
    if (todos.length === 0) { lista.textContent = "Sin pendientes. ¡Todo al día!"; return; }
    todos.forEach((p) => {
        const div = document.createElement("div");
        div.className = "pendiente";
        div.innerHTML = `
            <span class="${p.completado ? "hecho" : ""}">${p.titulo}</span><br>
            <small>Cliente:${p.clienteId || "-"} Coti:${p.cotizacionId || "-"} Trab:${p.trabajoId || "-"}</small><br>
            <button class="secundario" onclick="toggle(${p.id}, ${p.completado ? 0 : 1})">${p.completado ? "Reabrir" : "Completar"}</button>
            <button class="peligro" onclick="eliminar(${p.id})">Eliminar</button>
        `;
        lista.appendChild(div);
    });
}

async function toggle(id, completado) {
    try {
        await fetch(`http://localhost:3000/pendientes/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completado: Boolean(completado) })
        });
        const r = await fetch("http://localhost:3000/pendientes");
        todos = await r.json();
        pintar();
    } catch (e) {
        document.getElementById("mensaje").textContent = "No se pudo conectar. Verifica npm start reiniciado.";
    }
}

async function eliminar(id) {
    try {
        await fetch(`http://localhost:3000/pendientes/${id}`, { method: "DELETE" });
        const r = await fetch("http://localhost:3000/pendientes");
        todos = await r.json();
        pintar();
    } catch (e) {
        document.getElementById("mensaje").textContent = "No se pudo conectar. Verifica npm start reiniciado.";
    }
}

// Exponer para onclick en HTML
window.toggle = toggle;
window.eliminar = eliminar;

document.getElementById("form-pendiente").addEventListener("submit", async (e) => {
    e.preventDefault();
    const mensaje = document.getElementById("mensaje");
    const datos = {
        titulo: document.getElementById("titulo").value,
        clienteId: document.getElementById("cliente").value || null,
        cotizacionId: document.getElementById("cotizacion").value || null,
        trabajoId: document.getElementById("trabajo").value || null
    };
    try {
        const r = await fetch("http://localhost:3000/pendientes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });
        const res = await r.json();
        if (!r.ok) { mensaje.textContent = "Error: " + res.mensaje; return; }
        mensaje.textContent = res.mensaje + " con id " + res.pendiente.id;
        document.getElementById("form-pendiente").reset();
        const r2 = await fetch("http://localhost:3000/pendientes");
        todos = await r2.json();
        pintar();
    } catch (err) {
        mensaje.textContent = "No se pudo guardar: verifica npm start reiniciado y que /pendientes responda.";
    }
});

cargarBase();
