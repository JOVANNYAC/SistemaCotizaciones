// Arreglo temporal donde almacenaremos los clientes
let clientes = [
    {
        id: 1,
        nombre: "Empresa ABC"
    },
    {
        id: 2,
        nombre: "Ferretería Central"
    }
];

// Obtener todos los clientes
function obtenerTodos() {
    return clientes;
}

// Crear un nuevo cliente
function crear(cliente) {

    const nuevoCliente = {
        id: clientes.length + 1,
        nombre: cliente.nombre
    };

    clientes.push(nuevoCliente);

    return nuevoCliente;
}

// Exportamos las funciones del modelo
export default {
    obtenerTodos,
    crear
};