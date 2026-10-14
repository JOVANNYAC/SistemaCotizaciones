import { Router } from "express";
import {
    obtenerCotizaciones,
    crearCotizacion
} from "../controllers/cotizaciones.controller.js";

const router = Router();

router.get("/", obtenerCotizaciones);
router.post("/", crearCotizacion);

export default router;
