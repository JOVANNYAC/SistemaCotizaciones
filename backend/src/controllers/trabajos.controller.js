import trabajosModel from "../models/trabajos.model.js";
import clientesModel from "../models/clientes.model.js";
import cotizacionesModel from "../models/cotizaciones.model.js";

export const obtenerTrabajos = (req, res) => {
    const trabajos = trabajosModel.obtenerTodos();
    res.json(trabajos);
};

export const crearTrabajo = (req, res) => {
    const datos = req.body;

    if (!datos.clienteId) {
        return res.status(400).json({ mensaje: "El campo clienteId es obligatorio" });
    }
    if (!datos.descripcion || typeof datos.descripcion !== "string" || datos.descripcion.trim() === "") {
        return res.status(400).json({ mensaje: "El campo descripcion es obligatorio" });
    }

    const cliente = clientesModel.obtenerPorId(Number(datos.clienteId));
    if (!cliente) {
        return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }

    // Si viene cotización, debe existir y ser del mismo cliente
    let total = Number(datos.total) || 0;
    let cotizacionId = datos.cotizacionId ? Number(datos.cotizacionId) : null;
    if (cotizacionId) {
        const cotizacion = cotizacionesModel.obtenerPorId(cotizacionId);
        if (!cotizacion) {
            return res.status(404).json({ mensaje: "Cotización no encontrada" });
        }
        // Si la cotización trae total, lo usamos salvo que manden otro
        if (!datos.total) {
            total = cotizacion.total;
        }
    }

    if (datos.estado && !trabajosModel.ESTADOS_VALIDOS.includes(datos.estado)) {
        return res.status(400).json({ mensaje: "Estado no válido" });
    }

    const nuevo = trabajosModel.crear({
        clienteId: Number(datos.clienteId),
        cotizacionId: cotizacionId,
        descripcion: datos.descripcion.trim(),
        estado: datos.estado || "pendiente_por_cotizar",
        total: total
    });

    res.status(201).json({ mensaje: "Trabajo creado correctamente", trabajo: nuevo });
};

export const actualizarEstadoTrabajo = (req, res) => {
    const id = Number(req.params.id);
    const { estado } = req.body;

    if (!trabajosModel.ESTADOS_VALIDOS.includes(estado)) {
        return res.status(400).json({ mensaje: "Estado no válido" });
    }

    const actualizado = trabajosModel.actualizarEstado(id, estado);
    if (!actualizado) {
        return res.status(404).json({ mensaje: "Trabajo no encontrado" });
    }

    res.json({ mensaje: "Estado actualizado correctamente", trabajo: actualizado });
};
