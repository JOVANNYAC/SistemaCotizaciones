import { Router } from "express";
import {
    obtenerPendientes,
    crearPendiente,
    cambiarEstadoPendiente,
    eliminarPendiente
} from "../controllers/pendientes.controller.js";

const router = Router();

router.get("/", obtenerPendientes);
router.post("/", crearPendiente);
router.put("/:id", cambiarEstadoPendiente);
router.delete("/:id", eliminarPendiente);

export default router;
