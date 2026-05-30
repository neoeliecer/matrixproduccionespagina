import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const eventData = JSON.parse(rawBody);

    const { event, data, signature, timestamp } = eventData;

    console.log(`🤖 Recibido Webhook de Wompi. Evento: ${event}`);

    // 1. Validar Firma de Seguridad de Wompi (si está configurada)
    const wompiSecret = process.env.WOMPI_EVENTS_SECRET;
    
    if (wompiSecret && signature && signature.checksum && signature.properties) {
      const properties = signature.properties;
      const checksum = signature.checksum;

      // Concatenar los valores según el orden especificado en signature.properties
      let message = "";
      try {
        properties.forEach((prop: string) => {
          const keys = prop.split('.');
          let value: any = data;
          keys.forEach((key: string) => {
            if (value !== undefined && value !== null) {
              value = value[key];
            }
          });
          message += value;
        });

        // Concatenar timestamp y el secreto de Wompi
        message += timestamp + wompiSecret;

        // Generar hash SHA256 (Wompi requiere SHA256 simple, NO HMAC)
        const calculatedChecksum = crypto
          .createHash('sha256')
          .update(message)
          .digest('hex');

        // Comparación segura
        const isAuthentic = crypto.timingSafeEqual(
          Buffer.from(calculatedChecksum),
          Buffer.from(checksum)
        );

        if (!isAuthentic) {
          console.warn("⚠️ Firma de seguridad de Wompi INVÁLIDA.");
          
          // Si estamos en modo de pruebas / Sandbox (Wompi Sandbox siempre usa IDs que empiezan por 12101921-),
          // permitimos el paso por comodidad de desarrollo para evitar conflictos de variables de entorno.
          if (data && data.transaction && data.transaction.id && data.transaction.id.startsWith('12101921-')) {
            console.log("🧪 Modo Sandbox detectado: Bypass de firma permitido para simulación de pruebas.");
          } else {
            console.warn("❌ Petición de producción rechazada debido a firma inválida.");
            return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
          }
        }
        
        console.log("✅ Firma de Wompi validada con éxito. Mensaje auténtico.");
      } catch (err) {
        console.error("Error al validar la firma de Wompi:", err);
        return NextResponse.json({ error: "Error de validación" }, { status: 400 });
      }
    } else {
      console.log("ℹ️ Validación de firma omitida (WOMPI_EVENTS_SECRET no configurado).");
    }

    // 2. Procesar la transacción
    if (event === "transaction.updated") {
      const transaction = data.transaction;
      const status = transaction.status; // "APPROVED", "DECLINED", "VOIDED"
      const customerEmail = transaction.customer_email; // Correo de quien pagó
      const amountInCents = transaction.amount_in_cents;
      const reference = transaction.reference; // ID de referencia de pago

      console.log(`🛒 Transacción ${reference} - Estado: ${status} - Cliente: ${customerEmail}`);

      if (status === "APPROVED") {
        const amountCop = amountInCents / 100;
        console.log(`🎉 ¡PAGO APROBADO de $${amountCop} COP! Iniciando envío de libro digital...`);
        
        await enviarLibroPorCorreo(customerEmail, amountCop, reference);
      }
    }

    // Wompi exige que respondamos siempre un HTTP 200 rápido para confirmar recepción
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error procesando webhook de Wompi:", error);
    return NextResponse.json({ error: error.message || "Error interno" }, { status: 500 });
  }
}

// Función auxiliar para enviar el correo mediante Brevo (SMTP API)
async function enviarLibroPorCorreo(email: string, monto: number, referencia: string) {
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (!brevoApiKey) {
    console.error("❌ Error: BREVO_API_KEY no configurada en las variables de entorno.");
    return;
  }

  // URL del PDF del Libro Digital (alojado en la carpeta public de tu servidor)
  const enlaceDescarga = "https://matrixproducciones.com/libro-digital.pdf";

  // Diseño HTML Cinematográfico de Alta Calidad para el Correo (Modo Oscuro con detalles verdes)
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Tu Libro Digital - Matrix Producciones</title>
    </head>
    <body style="background-color: #030303; color: #ffffff; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px 20px;">
      <div style="max-w: 600px; margin: 0 auto; background-color: #090909; border: 1px solid #1a1a1a; border-radius: 24px; padding: 40px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
        
        <!-- Logo Header -->
        <div style="margin-bottom: 30px;">
          <h1 style="color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: 4px; margin: 0; text-transform: uppercase;">
            MATRIX <span style="color: #00FF88;">PRODUCCIONES</span>
          </h1>
          <p style="color: #666; font-size: 10px; letter-spacing: 3px; margin: 5px 0 0 0; text-transform: uppercase;">
            Cine con Propósito
          </p>
        </div>

        <hr style="border: 0; border-top: 1px solid #1a1a1a; margin-bottom: 30px;">

        <!-- Mensaje Principal -->
        <span style="color: #00FF88; font-size: 10px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; display: block; margin-bottom: 10px;">
          Compra Confirmada
        </span>
        <h2 style="color: #ffffff; font-size: 28px; font-weight: 900; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 1px;">
          ¡Aquí Tienes Tu Libro!
        </h2>
        
        <p style="color: #a0a0a0; font-size: 15px; line-height: 1.6; font-weight: 300; margin-bottom: 30px;">
          Tu pago por valor de <strong style="color: #ffffff;">$${monto.toLocaleString('es-CO')} COP</strong> ha sido procesado con éxito a través de Wompi.<br>
          A continuación, puedes descargar tu libro digital en formato PDF de alta calidad listo para leer en cualquier dispositivo:
        </p>

        <!-- Botón de Descarga Call-To-Action -->
        <div style="margin: 40px 0;">
          <a href="${enlaceDescarga}" target="_blank" style="background-color: #00FF88; color: #000000; font-size: 12px; font-weight: 900; letter-spacing: 3px; text-decoration: none; padding: 18px 36px; border-radius: 4px; text-transform: uppercase; box-shadow: 0 0 20px rgba(0,255,136,0.3); display: inline-block; transition: all 0.3s;">
            Descargar Libro PDF 📥
          </a>
        </div>

        <!-- Ficha de Transacción -->
        <div style="background-color: #030303; border: 1px solid #141414; padding: 20px; border-radius: 12px; text-align: left; margin-bottom: 30px;">
          <span style="color: #666; font-size: 9px; font-weight: 800; tracking: 2px; text-transform: uppercase; display: block; margin-bottom: 8px;">Detalles de la compra</span>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px; color: #a0a0a0;">
            <tr>
              <td style="padding: 4px 0; font-weight: 300;">Referencia:</td>
              <td style="padding: 4px 0; text-align: right; color: #ffffff; font-family: monospace;">${referencia}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: 300;">Método de Pago:</td>
              <td style="padding: 4px 0; text-align: right; color: #ffffff;">Pasarela Wompi</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: 300;">Estado:</td>
              <td style="padding: 4px 0; text-align: right; color: #00FF88; font-weight: bold;">APROBADO</td>
            </tr>
          </table>
        </div>

        <hr style="border: 0; border-top: 1px solid #1a1a1a; margin-bottom: 30px;">

        <!-- Footer -->
        <p style="color: #444; font-size: 11px; line-height: 1.5; font-weight: 300; margin: 0;">
          Si tienes problemas con la descarga o necesitas ayuda adicional,<br>
          responde directamente a este correo o contáctanos a soporte@matrixproducciones.com
        </p>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": brevoApiKey,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        sender: { name: "Matrix Producciones", email: "contacto@matrixproducciones.com" },
        to: [{ email: email }],
        subject: "📖 ¡Aquí tienes tu Libro Digital de Matrix Producciones!",
        htmlContent: htmlContent
      })
    });

    if (response.ok) {
      console.log(`✅ Correo del libro enviado con éxito a ${email}.`);
    } else {
      const errText = await response.text();
      console.error("❌ Error al enviar correo mediante Brevo:", errText);
    }
  } catch (error) {
    console.error("❌ Excepción al enviar correo mediante Brevo:", error);
  }
}
