import pendientesModel from "../models/pendientes.model.js";

export const obtenerPendientes = (req, res) => {
    res.json(pendientesModel.obtenerTodos());
};

export const crearPendiente = (req, res) => {
    const { titulo, clienteId, cotizacionId, trabajoId } = req.body;
    if (!titulo || typeof titulo !== "string" || titulo.trim() === "") {
        return res.status(400).json({ mensaje: "El título es obligatorio" });
    }
    const nuevo = pendientesModel.crear({
        titulo: titulo.trim(),
        clienteId: clienteId ? Number(clienteId) : null,
        cotizacionId: cotizacionId ? Number(cotizacionId) : null,
        trabajoId: trabajoId ? Number(trabajoId) : null
    });
    res.status(201).json({ mensaje: "Pendiente creado", pendiente: nuevo });
};

export const cambiarEstadoPendiente = (req, res) => {
    const id = Number(req.params.id);
    const completado = Boolean(req.body.completado);
    const actualizado = pendientesModel.cambiarEstado(id, completado);
    if (!actualizado) return res.status(404).json({ mensaje: "Pendiente no encontrado" });
    res.json({ mensaje: "Actualizado", pendiente: actualizado });
};

export const eliminarPendiente = (req, res) => {
    const id = Number(req.params.id);
    const ok = pendientesModel.eliminar(id);
    if (!ok) return res.status(404).json({ mensaje: "Pendiente no encontrado" });
    res.json({ mensaje: "Pendiente eliminado" });
};
