import express from "express";

const app = express();

const PORT = 3000;

// Ruta principal
app.get("/", (req, res) => {
    res.send("🚀 Servidor del Sistema de Cotizaciones funcionando correctamente");
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
});