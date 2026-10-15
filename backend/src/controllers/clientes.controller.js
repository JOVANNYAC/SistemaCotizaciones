import clientesModel from "../models/clientes.model.js";

export const obtenerClientes = (req, res) => {

    const clientes = clientesModel.obtenerTodos();

    res.json(clientes);

};

export const crearCliente = (req, res) => {

    const cliente = req.body;

    if (!cliente.nombre || typeof cliente.nombre !== "string" || cliente.nombre.trim() === "") {
        return res.status(400).json({
            mensaje: "El campo nombre es obligatorio"
        });
    }

    const nuevoCliente = clientesModel.crear({
        nombre: cliente.nombre.trim(),
        telefono: cliente.telefono || "",
        email: cliente.email || "",
        direccion: cliente.direccion || ""
    });

    res.status(201).json({
        mensaje: "Cliente creado correctamente",
        cliente: nuevoCliente
    });

};

export const actualizarCliente = (req, res) => {

    const id = Number(req.params.id);
    const cliente = req.body;

    if (!cliente.nombre || typeof cliente.nombre !== "string" || cliente.nombre.trim() === "") {
        return res.status(400).json({
            mensaje: "El campo nombre es obligatorio"
        });
    }

    const actualizado = clientesModel.actualizar(id, {
        nombre: cliente.nombre.trim(),
        telefono: cliente.telefono || "",
        email: cliente.email || "",
        direccion: cliente.direccion || ""
    });

    if (!actualizado) {
        return res.status(404).json({
            mensaje: "Cliente no encontrado"
        });
    }

    res.json({
        mensaje: "Cliente actualizado correctamente",
        cliente: actualizado
    });

};