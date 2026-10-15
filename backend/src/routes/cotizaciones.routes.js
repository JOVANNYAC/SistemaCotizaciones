import { Router } from "express";
import {
    obtenerCotizaciones,
    crearCotizacion,
    descargarPdfCotizacion
} from "../controllers/cotizaciones.controller.js";

const router = Router();

router.get("/", obtenerCotizaciones);
router.get("/:id/pdf", descargarPdfCotizacion);
router.post("/", crearCotizacion);

export default router;
