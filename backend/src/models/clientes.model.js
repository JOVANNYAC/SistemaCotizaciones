// Modelo de clientes con persistencia en SQLite
import db from "../database/conexion.js";

// Obtener todos los clientes
function obtenerTodos() {
    return db.prepare("SELECT * FROM clientes ORDER BY id").all();
}

// Crear un nuevo cliente
function crear(cliente) {

    const resultado = db.prepare("INSERT INTO clientes (nombre) VALUES (?)").run(cliente.nombre);

    return {
        id: resultado.lastInsertRowid,
        nombre: cliente.nombre
    };
}

// Exportamos las funciones del modelo
export default {
    obtenerTodos,
    crear
};
