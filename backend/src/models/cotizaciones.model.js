// Arreglo temporal donde almacenaremos las cotizaciones
// Más adelante este arreglo se reemplazará por SQLite
let cotizaciones = [];

// Tasa de IVA para el cálculo (16% México)
const TASA_IVA = 0.16;

// Obtener todas las cotizaciones
function obtenerTodas() {
    return cotizaciones;
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

    const nuevaCotizacion = {
        id: cotizaciones.length + 1,
        clienteId: datos.clienteId,
        fecha: new Date().toISOString().split("T")[0],
        items: itemsNormalizados,
        subtotal: subtotal,
        iva: iva,
        total: total
    };

    cotizaciones.push(nuevaCotizacion);

    return nuevaCotizacion;
}

// Exportamos las funciones del modelo
export default {
    obtenerTodas,
    crear
};
