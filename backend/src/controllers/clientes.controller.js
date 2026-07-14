import clientesModel from "../models/clientes.model.js";

export const obtenerClientes = (req, res) => {

    const clientes = clientesModel.obtenerTodos();

    res.json(clientes);

};

export const crearCliente = (req, res) => {

    const cliente = req.body;

    const nuevoCliente = clientesModel.crear(cliente);

    res.json({
        mensaje: "Cliente creado correctamente",
        cliente: nuevoCliente
    });

};