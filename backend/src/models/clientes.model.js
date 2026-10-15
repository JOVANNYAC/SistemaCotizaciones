// Modelo de clientes con persistencia en SQLite
import db from "../database/conexion.js";

// Obtener todos los clientes
function obtenerTodos() {
    return db.prepare("SELECT * FROM clientes ORDER BY id").all();
}

// Obtener un cliente por id
function obtenerPorId(id) {
    return db.prepare("SELECT * FROM clientes WHERE id = ?").get(id);
}

// Crear un nuevo cliente
function crear(cliente) {

    const resultado = db.prepare(
        "INSERT INTO clientes (nombre, telefono, email, direccion) VALUES (?, ?, ?, ?)"
    ).run(cliente.nombre, cliente.telefono || "", cliente.email || "", cliente.direccion || "");

    return {
        id: resultado.lastInsertRowid,
        nombre: cliente.nombre,
        telefono: cliente.telefono || "",
        email: cliente.email || "",
        direccion: cliente.direccion || ""
    };
}

// Actualizar un cliente existente
function actualizar(id, cliente) {

    const resultado = db.prepare(
        "UPDATE clientes SET nombre = ?, telefono = ?, email = ?, direccion = ? WHERE id = ?"
    ).run(cliente.nombre, cliente.telefono || "", cliente.email || "", cliente.direccion || "", id);

    if (resultado.changes === 0) {
        return null;
    }

    return obtenerPorId(id);
}

// Exportamos las funciones del modelo
export default {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar
};
