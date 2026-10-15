import cotizacionesModel from "../models/cotizaciones.model.js";
import clientesModel from "../models/clientes.model.js";
import { generarPdfCotizacion } from "../services/pdf.service.js";

export const obtenerCotizaciones = (req, res) => {

    const cotizaciones = cotizacionesModel.obtenerTodas();

    res.json(cotizaciones);

};

export const crearCotizacion = (req, res) => {

    const datos = req.body;

    // Validación: clienteId es obligatorio
    if (!datos.clienteId) {
        return res.status(400).json({
            mensaje: "El campo clienteId es obligatorio"
        });
    }

    // Validación: items debe ser un arreglo con al menos un elemento
    if (!Array.isArray(datos.items) || datos.items.length === 0) {
        return res.status(400).json({
            mensaje: "La cotización debe incluir al menos un item en el arreglo items"
        });
    }

    // Validación: cada item debe tener descripción, cantidad y precio válidos
    for (const item of datos.items) {
        if (!item.descripcion || typeof item.descripcion !== "string") {
            return res.status(400).json({
                mensaje: "Cada item debe tener una descripcion válida"
            });
        }
        if (Number(item.cantidad) <= 0) {
            return res.status(400).json({
                mensaje: "Cada item debe tener una cantidad mayor a 0"
            });
        }
        if (Number(item.precio) < 0) {
            return res.status(400).json({
                mensaje: "Cada item debe tener un precio válido mayor o igual a 0"
            });
        }
    }

    const nuevaCotizacion = cotizacionesModel.crear(datos);

    res.status(201).json({
        mensaje: "Cotización creada correctamente",
        cotizacion: nuevaCotizacion
    });

};

export const descargarPdfCotizacion = (req, res) => {

    const id = Number(req.params.id);

    const cotizacion = cotizacionesModel.obtenerPorId(id);

    if (!cotizacion) {
        return res.status(404).json({
            mensaje: "Cotización no encontrada"
        });
    }

    const cliente = clientesModel.obtenerPorId(cotizacion.clienteId);

    generarPdfCotizacion(cotizacion, cliente, res);

};
