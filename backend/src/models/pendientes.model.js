// Modelo de pendientes tipo to-do con SQLite
import db from "../database/conexion.js";

function obtenerTodos() {
    return db.prepare("SELECT * FROM pendientes ORDER BY completado, id").all();
}

function crear(datos) {
    const fecha = new Date().toISOString().split("T")[0];
    const r = db.prepare(
        "INSERT INTO pendientes (titulo, clienteId, cotizacionId, trabajoId, completado, fecha) VALUES (?, ?, ?, ?, 0, ?)"
    ).run(
        datos.titulo,
        datos.clienteId || null,
        datos.cotizacionId || null,
        datos.trabajoId || null,
        fecha
    );
    return { id: r.lastInsertRowid, ...datos, clienteId: datos.clienteId || null, cotizacionId: datos.cotizacionId || null, trabajoId: datos.trabajoId || null, completado: 0, fecha };
}

function cambiarEstado(id, completado) {
    const r = db.prepare("UPDATE pendientes SET completado = ? WHERE id = ?").run(completado ? 1 : 0, id);
    if (r.changes === 0) return null;
    return db.prepare("SELECT * FROM pendientes WHERE id = ?").get(id);
}

function eliminar(id) {
    const r = db.prepare("DELETE FROM pendientes WHERE id = ?").run(id);
    return r.changes > 0;
}

export default { obtenerTodos, crear, cambiarEstado, eliminar };
