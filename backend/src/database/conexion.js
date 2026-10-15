import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

// Obtener la ruta del archivo actual para construir ruta absoluta a la BD
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rutaBD = path.join(__dirname, "cotizaciones.db");

// Crear o abrir la base de datos SQLite (archivo local)
const db = new Database(rutaBD);

// Crear tabla clientes si no existe
db.exec(`
    CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        telefono TEXT DEFAULT '',
        email TEXT DEFAULT '',
        direccion TEXT DEFAULT ''
    )
`);

// Migración simple: agregar columnas si la tabla ya existía solo con nombre
const columnas = db.prepare("PRAGMA table_info(clientes)").all().map((c) => c.name);
if (!columnas.includes("telefono")) {
    db.exec("ALTER TABLE clientes ADD COLUMN telefono TEXT DEFAULT ''");
}
if (!columnas.includes("email")) {
    db.exec("ALTER TABLE clientes ADD COLUMN email TEXT DEFAULT ''");
}
if (!columnas.includes("direccion")) {
    db.exec("ALTER TABLE clientes ADD COLUMN direccion TEXT DEFAULT ''");
}

// Crear tabla cotizaciones si no existe
// items se guarda como texto JSON porque SQLite no tiene tipo arreglo
db.exec(`
    CREATE TABLE IF NOT EXISTS cotizaciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clienteId INTEGER NOT NULL,
        fecha TEXT NOT NULL,
        items TEXT NOT NULL,
        subtotal REAL NOT NULL,
        iva REAL NOT NULL,
        total REAL NOT NULL
    )
`);

// Insertar clientes de ejemplo solo si la tabla está vacía
const totalClientes = db.prepare("SELECT COUNT(*) AS total FROM clientes").get().total;
if (totalClientes === 0) {
    const insertar = db.prepare("INSERT INTO clientes (nombre) VALUES (?)");
    insertar.run("Empresa ABC");
    insertar.run("Ferretería Central");
}

export default db;
