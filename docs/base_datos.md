# Base de datos SQLite

Base local en `backend/src/database/cotizaciones.db`. No se sube a Git.

## Tablas

### clientes
- id INTEGER PRIMARY KEY AUTOINCREMENT
- nombre TEXT NOT NULL

### cotizaciones
- id INTEGER PRIMARY KEY AUTOINCREMENT
- clienteId INTEGER NOT NULL
- fecha TEXT NOT NULL (YYYY-MM-DD)
- items TEXT NOT NULL (arreglo en formato JSON)
- subtotal REAL NOT NULL
- iva REAL NOT NULL
- total REAL NOT NULL

## Conceptos
- AUTOINCREMENT genera folio automático sin repetir.
- ? en INSERT evita inyección SQL.
- items se guarda con JSON.stringify y se lee con JSON.parse.

