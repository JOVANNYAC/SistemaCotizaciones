import PDFDocument from "pdfkit";

// Genera el PDF de una cotización y lo envía directo a la respuesta Express
export function generarPdfCotizacion(cotizacion, cliente, res) {
    const doc = new PDFDocument({ margin: 50 });

    // Cabeceras para que el navegador lo descargue como PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=cotizacion-${cotizacion.id}.pdf`);

    // Conectar el documento al response
    doc.pipe(res);

    // Encabezado
    doc.fontSize(20).text("Cotización", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Folio: ${cotizacion.id}`);
    doc.text(`Fecha: ${cotizacion.fecha}`);
    doc.text(`Cliente: ${cliente ? cliente.nombre : "ID " + cotizacion.clienteId}`);
    doc.moveDown();

    // Tabla de items
    doc.fontSize(14).text("Conceptos:");
    doc.moveDown(0.5);
    cotizacion.items.forEach((item, index) => {
        doc.fontSize(11).text(
            `${index + 1}. ${item.descripcion} - Cant: ${item.cantidad} x $${item.precio} = $${item.subtotal}`
        );
    });
    doc.moveDown();

    // Totales
    doc.fontSize(12).text(`Subtotal: $${cotizacion.subtotal}`);
    doc.text(`IVA (16%): $${cotizacion.iva}`);
    doc.fontSize(14).text(`Total: $${cotizacion.total}`);
    doc.moveDown();
    doc.fontSize(10).text("Gracias por su preferencia. SistemaCotizaciones.", { align: "center" });

    // Finalizar el PDF
    doc.end();
}
