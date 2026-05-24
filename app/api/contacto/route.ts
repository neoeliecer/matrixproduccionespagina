import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { type, name, email, message, projectType } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Datos del formulario incompletos." }, { status: 400 });
    }

    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) {
      return NextResponse.json(
        { error: "El servicio de correos no está configurado en el servidor." },
        { status: 500 }
      );
    }

    const isProposal = type === "propuesta";
    const subject = isProposal 
      ? `💡 Nueva Propuesta de Proyecto: ${name}`
      : `✉️ Nuevo Mensaje de Contacto: ${name}`;

    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #030303; border: 1px solid #1a1a1a; border-radius: 16px; overflow: hidden; color: #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        <div style="background-color: #080808; padding: 28px; text-align: center; border-bottom: 1px solid #111111;">
          <h1 style="color: #00ff88; font-size: 18px; text-transform: uppercase; letter-spacing: 5px; margin: 0; font-weight: bold;">Matrix Producciones</h1>
          <span style="color: #666666; font-size: 9px; text-transform: uppercase; letter-spacing: 3px; display: block; margin-top: 5px;">Notificación de Formulario</span>
        </div>
        <div style="padding: 32px 24px;">
          <span style="background-color: rgba(0,255,136,0.1); border: 1px solid rgba(0,255,136,0.2); padding: 4px 12px; border-radius: 4px; font-size: 9px; font-weight: bold; text-transform: uppercase; color: #00ff88; letter-spacing: 2px; display: inline-block; margin-bottom: 16px;">
            ${isProposal ? "Propuesta Recibida" : "Mensaje de Contacto"}
          </span>
          <h2 style="font-size: 20px; font-weight: 800; margin: 0 0 24px 0; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">Detalles del Envío</h2>
          
          <div style="background-color: #080808; border: 1px solid #1a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 10px 0; font-size: 13px; color: #888888;"><strong style="color: #ffffff; text-transform: uppercase; font-size: 11px; tracking: 1px;">Nombre:</strong> ${name}</p>
            <p style="margin: 0 0 10px 0; font-size: 13px; color: #888888;"><strong style="color: #ffffff; text-transform: uppercase; font-size: 11px; tracking: 1px;">Correo:</strong> <a href="mailto:${email}" style="color: #00ff88; text-decoration: none;">${email}</a></p>
            ${isProposal ? `<p style="margin: 0; font-size: 13px; color: #888888;"><strong style="color: #ffffff; text-transform: uppercase; font-size: 11px; tracking: 1px;">Tipo de Proyecto:</strong> ${projectType || "No especificado"}</p>` : ""}
          </div>

          <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #00ff88; margin-top: 24px; margin-bottom: 8px;">Mensaje / Descripción:</h3>
          <p style="font-size: 14px; color: #dddddd; line-height: 1.6; font-weight: 300; background-color: #080808; border: 1px solid #1a1a1a; border-radius: 8px; padding: 20px; margin: 0; white-space: pre-wrap;">${message}</p>
        </div>
        <div style="background-color: #080808; padding: 20px; text-align: center; font-size: 10px; color: #444444; border-top: 1px solid #111111;">
          &copy; ${new Date().getFullYear()} Matrix Producciones. Alerta del Sistema CMS.
        </div>
      </div>
    `;

    // Enviar correo a Eliecer (eliecer.asesor@gmail.com)
    const sendEmailResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": brevoApiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Web Matrix", email: "info@matrixproducciones.com" },
        to: [
          { email: "eliecer.asesor@gmail.com", name: "Eliecer Matrix" },
          { email: "info@matrixproducciones.com", name: "Copia Matrix" }
        ],
        subject: subject,
        htmlContent: htmlContent,
        replyTo: { email: email, name: name }
      }),
    });

    if (!sendEmailResponse.ok) {
      const mailErr = await sendEmailResponse.text();
      return NextResponse.json(
        { error: `Error enviando correo a través de Brevo: ${mailErr}` },
        { status: 502 }
      );
    }

    // Enviar correo de confirmación al cliente
    try {
      const clientHtmlContent = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #030303; border: 1px solid #1a1a1a; border-radius: 16px; overflow: hidden; color: #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <div style="background-color: #080808; padding: 28px; text-align: center; border-bottom: 1px solid #111111;">
            <h1 style="color: #00ff88; font-size: 18px; text-transform: uppercase; letter-spacing: 5px; margin: 0; font-weight: bold;">Matrix Producciones</h1>
            <span style="color: #666666; font-size: 9px; text-transform: uppercase; letter-spacing: 3px; display: block; margin-top: 5px;">Confirmación de Recibido</span>
          </div>
          <div style="padding: 32px 24px;">
            <h2 style="font-size: 20px; font-weight: 800; margin: 0 0 16px 0; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">¡Hola ${name}!</h2>
            <p style="font-size: 14px; color: #888888; line-height: 1.6; font-weight: 300; margin-bottom: 24px;">
              Hemos recibido con éxito tu ${isProposal ? "propuesta cinematográfica" : "mensaje de contacto"} a través de nuestra página web. 
              En Matrix Producciones nos apasiona co-crear historias de impacto social y ambiental, por lo que analizaremos tu propuesta a la brevedad.
            </p>
            <p style="font-size: 14px; color: #888888; line-height: 1.6; font-weight: 300; margin-bottom: 32px;">
              Un productor de nuestro equipo se pondrá en contacto contigo muy pronto a este correo electrónico.
            </p>
            <div style="text-align: center; margin-bottom: 16px;">
              <a href="https://matrixproducciones.com" style="background-color: #00ff88; color: #000000; font-weight: bold; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; padding: 16px 32px; border-radius: 2px; text-decoration: none; display: inline-block;">Visitar Matrix Producciones</a>
            </div>
          </div>
          <div style="background-color: #080808; padding: 20px; text-align: center; font-size: 10px; color: #444444; border-top: 1px solid #111111; line-height: 1.6;">
            &copy; ${new Date().getFullYear()} Matrix Producciones. Cali, Colombia.
          </div>
        </div>
      `;

      await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoApiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          sender: { name: "Matrix Producciones", email: "info@matrixproducciones.com" },
          to: [{ email: email, name: name }],
          subject: `🎬 Recibimos tu ${isProposal ? "propuesta" : "mensaje"} - Matrix Producciones`,
          htmlContent: clientHtmlContent,
        }),
      });
    } catch (clientMailErr) {
      console.error("Error enviando correo de confirmación al cliente:", clientMailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Mensaje procesado y enviado con éxito al administrador y al cliente.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}
