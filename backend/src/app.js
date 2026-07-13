import express from "express";
import clientesRoutes from "./routes/clientes.routes.js";

const app = express();

// Middleware para interpretar JSON
app.use(express.json());

app.use("/clientes", clientesRoutes);

const PORT = 3000;

// Ruta principal
app.get("/", (req, res) => {
    res.send("🚀 Servidor del Sistema de Cotizaciones funcionando correctamente");
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
});