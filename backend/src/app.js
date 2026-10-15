import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import clientesRoutes from "./routes/clientes.routes.js";
import cotizacionesRoutes from "./routes/cotizaciones.routes.js";

const app = express();

// Ruta base para servir el frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rutaFrontend = path.join(__dirname, "../../frontend");

// Middleware para interpretar JSON
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(rutaFrontend));

app.use("/clientes", clientesRoutes);
app.use("/cotizaciones", cotizacionesRoutes);

const PORT = 3000;

// Ruta principal
app.get("/", (req, res) => {
    res.send("🚀 Servidor del Sistema de Cotizaciones funcionando correctamente");
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
});