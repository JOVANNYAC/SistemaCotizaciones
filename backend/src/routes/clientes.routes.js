import { Router } from "express";
import {
    obtenerClientes,
    crearCliente,
    actualizarCliente
} from "../controllers/clientes.controller.js";

const router = Router();

router.get("/", obtenerClientes);
router.post("/", crearCliente);
router.put("/:id", actualizarCliente);

export default router;