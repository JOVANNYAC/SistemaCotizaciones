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

// Exportamos las funciones del modelo
export default {
    obtenerTodos
};