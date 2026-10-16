import { Router } from "express";
import {
    obtenerTrabajos,
    crearTrabajo,
    actualizarEstadoTrabajo
} from "../controllers/trabajos.controller.js";

const router = Router();

router.get("/", obtenerTrabajos);
router.post("/", crearTrabajo);
router.put("/:id/estado", actualizarEstadoTrabajo);

export default router;
