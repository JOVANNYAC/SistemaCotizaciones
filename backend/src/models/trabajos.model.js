// Modelo de trabajos con persistencia en SQLite
import db from "../database/conexion.js";

// Estados permitidos para un trabajo
const ESTADOS_VALIDOS = ["pendiente_por_cotizar", "por_cobrar", "facturado", "cobrado"];

// Obtener todos los trabajos
function obtenerTodos() {
    return db.prepare("SELECT * FROM trabajos ORDER BY id").all();
}

// Crear un nuevo trabajo vinculado a cliente y opcionalmente a cotización
function crear(datos) {
    const fecha = new Date().toISOString().split("T")[0];
    const resultado = db.prepare(
        "INSERT INTO trabajos (clienteId, cotizacionId, descripcion, estado, total, fecha) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(
        datos.clienteId,
        datos.cotizacionId || null,
        datos.descripcion,
        datos.estado || "pendiente_por_cotizar",
        Number(datos.total) || 0,
        fecha
    );

    return {
        id: resultado.lastInsertRowid,
        clienteId: datos.clienteId,
        cotizacionId: datos.cotizacionId || null,
        descripcion: datos.descripcion,
        estado: datos.estado || "pendiente_por_cotizar",
        total: Number(datos.total) || 0,
        fecha: fecha
    };
}

// Actualizar el estado de un trabajo
function actualizarEstado(id, estado) {
    const resultado = db.prepare("UPDATE trabajos SET estado = ? WHERE id = ?").run(estado, id);
    if (resultado.changes === 0) {
        return null;
    }
    return db.prepare("SELECT * FROM trabajos WHERE id = ?").get(id);
}

export default {
    obtenerTodos,
    crear,
    actualizarEstado,
    ESTADOS_VALIDOS
};
