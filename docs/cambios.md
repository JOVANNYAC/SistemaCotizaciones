# Historial de cambios

## 2026-07-10

### Infraestructura inicial del proyecto

- Se creó la estructura base del proyecto.
- Se configuró Node.js con Express.
- Se configuró JavaScript ES Modules.
- Se creó el primer servidor Express.
- Se inicializó Git.
- Se realizó el primer commit.
- Se creó el repositorio remoto en GitHub.
- Se conectó el repositorio local con GitHub mediante `origin`.
- Se realizó el primer `git push`.
- La rama `main` quedó enlazada con `origin/main`.

## 2026-10-14

### Fase 1: Módulo de cotizaciones en memoria

- Se creó `backend/src/models/cotizaciones.model.js` con arreglo temporal y cálculo automático de subtotal, IVA 16% y total.
- Se creó `backend/src/controllers/cotizaciones.controller.js` con validación de clienteId e items y respuestas 201/400.
- Se creó `backend/src/routes/cotizaciones.routes.js` con GET y POST en `/cotizaciones`.
- Se conectó el módulo en `backend/src/app.js` sin modificar el módulo de clientes.
- Verificación funcional: GET /clientes devuelve 2 clientes, GET /cotizaciones devuelve arreglo, POST /cotizaciones calcula total 4640 correctamente.