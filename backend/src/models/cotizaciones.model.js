// Modelo de cotizaciones con persistencia en SQLite
import db from "../database/conexion.js";

// Tasa de IVA para el cálculo (16% México)
const TASA_IVA = 0.16;

// Obtener todas las cotizaciones
function obtenerTodas() {
    const filas = db.prepare("SELECT * FROM cotizaciones ORDER BY id").all();
    // Convertir items de texto JSON a arreglo
    return filas.map((fila) => ({
        ...fila,
        items: JSON.parse(fila.items)
    }));
}

// Obtener una cotización por id
function obtenerPorId(id) {
    const fila = db.prepare("SELECT * FROM cotizaciones WHERE id = ?").get(id);
    if (!fila) {
        return null;
    }
    return {
        ...fila,
        items: JSON.parse(fila.items)
    };
}

// Crear una nueva cotización con cálculo automático
function crear(datos) {
    const itemsNormalizados = datos.items.map((item) => {
        const cantidad = Number(item.cantidad);
        const precio = Number(item.precio);
        return {
            descripcion: item.descripcion,
            cantidad: cantidad,
            precio: precio,
            subtotal: cantidad * precio
        };
    });

    const subtotal = itemsNormalizados.reduce((suma, item) => suma + item.subtotal, 0);
    const iva = subtotal * TASA_IVA;
    const total = subtotal + iva;
    const fecha = new Date().toISOString().split("T")[0];

    const resultado = db.prepare(
        "INSERT INTO cotizaciones (clienteId, fecha, items, subtotal, iva, total) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(datos.clienteId, fecha, JSON.stringify(itemsNormalizados), subtotal, iva, total);

    return {
        id: resultado.lastInsertRowid,
        clienteId: datos.clienteId,
        fecha: fecha,
        items: itemsNormalizados,
        subtotal: subtotal,
        iva: iva,
        total: total
    };
}

// Exportamos las funciones del modelo
export default {
    obtenerTodas,
    obtenerPorId,
    crear
};

