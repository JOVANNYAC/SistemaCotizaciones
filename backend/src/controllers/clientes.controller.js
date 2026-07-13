export const obtenerClientes = (req, res) => {

    const clientes = [
        {
            id: 1,
            nombre: "Empresa ABC"
        },
        {
            id: 2,
            nombre: "Ferretería Central"
        }
    ];

    res.json(clientes);

};

export const crearCliente = (req, res) => {

    const cliente = req.body;

    res.json({
        mensaje: "Cliente recibido correctamente",
        cliente: cliente
    });

};