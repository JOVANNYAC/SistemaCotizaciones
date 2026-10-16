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

### Fase 2: Persistencia con SQLite

- Se instaló `better-sqlite3@13.0.3` como conector SQLite síncrono y simple.
- Se creó `backend/src/database/conexion.js` que crea `cotizaciones.db` con tablas `clientes` y `cotizaciones` e inserta 2 clientes de ejemplo si está vacío.
- Se migró `clientes.model.js` de arreglo en memoria a `SELECT` e `INSERT` con placeholders `?`.
- Se migró `cotizaciones.model.js` conservando cálculo map/reduce + IVA 16%, guardando `items` como JSON y usando `AUTOINCREMENT`.
- Verificación funcional: tras reiniciar el servidor, GET /cotizaciones conserva la cotización id 1 con total 4640. La BD local `*.db` no se sube a Git.

### Fase 3: Generación de PDF

- Se instaló `pdfkit@^0.20.2` para generar PDF sin dependencias pesadas.
- Se agregó `obtenerPorId` en `cotizaciones.model.js` y `clientes.model.js` con `SELECT ... WHERE id = ?`.
- Se creó `backend/src/services/pdf.service.js` que genera documento con folio, fecha, cliente, conceptos y totales y lo envía con `Content-Type: application/pdf`.
- Se agregó `descargarPdfCotizacion` en el controlador con manejo 404 si no existe.
- Se expuso `GET /cotizaciones/:id/pdf` para descargar como `cotizacion-ID.pdf`.
- Verificación funcional: GET /cotizaciones/1/pdf descarga y visualiza datos correctos. Plantilla queda pendiente de mejora futura.

### Fase 4: Formulario frontend

- Se creó `frontend/index.html` con formulario de cliente+items y lista de historial con botón PDF.
- Se creó `frontend/app.js` con fetch a /clientes, /cotizaciones y descarga de PDF.
- Se sirvió frontend desde Express con `express.static` sin romper la API.
- Verificación funcional: http://localhost:3000/ muestra formulario e historial. Diseño pendiente de adaptación futura.

### Fase 5: Módulo completo de clientes

- Se amplió tabla `clientes` a `nombre, telefono, email, direccion` con migración automática ALTER TABLE.
- Se agregó `actualizar` en modelo con `UPDATE ... WHERE id = ?` y validación de nombre en controlador.
- Se expuso `PUT /clientes/:id` para editar con 400/404, y `POST` ahora devuelve 201.
- Se creó `frontend/clientes.html` y `frontend/clientes.js` con crear, listar y editar en la misma página.
- Se agregó navegación Cotizaciones | Clientes en ambas páginas.

### Fase 6: Enfoque móvil 4 módulos

- Se creó `frontend/home.html` con 4 iconos táctiles: Cotización, Clientes, Trabajos, Pendientes.
- Se creó `frontend/cotizaciones.html` + `frontend/cotizaciones.js` con buscador por folio/cliente/concepto y filtro por cliente.
- Se crearon placeholders `frontend/trabajos.html` y `frontend/pendientes.html` para reservar módulos.
- Se actualizó navegación a Inicio + 4 módulos en clientes.
- Verificación funcional: home muestra 4 iconos, filtro cotizaciones funciona. Detalles de diseño pendientes.

### Fase 7: Trabajos y pendientes vinculados

- Se creó tabla `trabajos` con clienteId, cotizacionId, descripcion, estado y total.
- Se creó API `GET/POST /trabajos` y `PUT /trabajos/:id/estado` con 4 estados.
- Se creó tabla `pendientes` to-do con titulo y vínculos opcionales a cliente/cotización/trabajo.
- Se creó API `GET/POST/PUT/DELETE /pendientes`.
- Se crearon `trabajos.html/js` y `pendientes.html/js` con crear, filtrar, cambiar estado y eliminar.
- Se corrigieron funciones globales window.* y manejo robusto con response.ok y try/catch.
- Verificación funcional: tras reiniciar servidor, trabajos y pendientes crean y listan correctamente.