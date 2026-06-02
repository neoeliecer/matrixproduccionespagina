import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json().catch(() => ({ email: "" }));

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Por favor, ingresa un correo electrónico válido." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      return NextResponse.json(
        { error: "GITHUB_TOKEN no configurado en el servidor." },
        { status: 500 }
      );
    }

    const repoOwner = "neoeliecer";
    const repoName = "matrixproduccionespagina";
    const filePath = "data/subscribers.json";
    const githubApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    let currentSubscribers: string[] = [];
    let fileSha = "";

    // 1. Obtener la lista actual de suscriptores desde GitHub
    try {
      const getFileResponse = await fetch(githubApiUrl, {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "NextJS-Blog-CMS",
        },
        cache: "no-store",
      });

      if (getFileResponse.ok) {
        const fileData = await getFileResponse.json();
        fileSha = fileData.sha;
        const decodedContent = Buffer.from(fileData.content, "base64").toString("utf-8");
        currentSubscribers = JSON.parse(decodedContent);
      }
    } catch (e) {
      console.error("Error leyendo subscribers.json de GitHub, inicializando vacío:", e);
    }

    // 2. Verificar duplicados
    if (currentSubscribers.includes(cleanEmail)) {
      return NextResponse.json({
        success: true,
        alreadySubscribed: true,
        message: "Este correo ya está registrado en nuestro boletín.",
      });
    }

    // 3. Añadir el nuevo suscriptor
    currentSubscribers.push(cleanEmail);

    // 4. Guardar la lista actualizada de vuelta en GitHub
    const updatedContentBase64 = Buffer.from(JSON.stringify(currentSubscribers, null, 2)).toString("base64");

    const putFileResponse = await fetch(githubApiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "NextJS-Blog-CMS",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `🤖 AutoNewsletter: Registro de nuevo suscriptor: ${cleanEmail}`,
        content: updatedContentBase64,
        sha: fileSha || undefined,
        branch: "main",
      }),
    });

    if (!putFileResponse.ok) {
      const putErr = await putFileResponse.text();
      return NextResponse.json(
        { error: `Error registrando suscriptor en GitHub: ${putErr}` },
        { status: 502 }
      );
    }

    // Enviar notificación por correo de la nueva suscripción
    await enviarNotificacionSuscripcion(cleanEmail);

    return NextResponse.json({
      success: true,
      message: "¡Te has suscrito con éxito al boletín de Matrix Producciones!",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}

// Función auxiliar para enviar notificación de nuevo suscriptor mediante Brevo
async function enviarNotificacionSuscripcion(subscriberEmail: string) {
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (!brevoApiKey) {
    console.warn("⚠️ Advertencia: BREVO_API_KEY no configurada en las variables de entorno.");
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nuevo Suscriptor - Matrix Producciones</title>
    </head>
    <body style="background-color: #030303; color: #ffffff; font-family: sans-serif; padding: 30px 15px; margin: 0;">
      <div style="max-w: 600px; margin: 0 auto; background-color: #090909; border: 1px solid #1a1a1a; border-radius: 16px; padding: 40px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
        
        <!-- Header -->
        <div style="margin-bottom: 25px;">
          <h1 style="color: #ffffff; font-size: 20px; font-weight: 900; letter-spacing: 3px; margin: 0; text-transform: uppercase;">
            MATRIX <span style="color: #00FF88;">PRODUCCIONES</span>
          </h1>
          <p style="color: #666; font-size: 9px; letter-spacing: 2px; margin: 5px 0 0 0; text-transform: uppercase;">
            Notificación de Sistema
          </p>
        </div>

        <hr style="border: 0; border-top: 1px solid #1a1a1a; margin-bottom: 25px;">

        <span style="color: #00FF88; font-size: 9px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 10px;">
          Boletín de Novedades
        </span>
        <h2 style="color: #ffffff; font-size: 24px; font-weight: 900; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 1px;">
          🔔 ¡Nuevo Suscriptor!
        </h2>
        
        <p style="color: #a0a0a0; font-size: 14px; line-height: 1.6; font-weight: 300; margin-bottom: 25px;">
          Un visitante se ha registrado para recibir las alertas y boletines semanales de tu productora de cine.
        </p>

        <!-- Ficha de Datos -->
        <div style="background-color: #030303; border: 1px solid #141414; padding: 20px; border-radius: 12px; display: inline-block; margin-bottom: 25px; min-width: 280px;">
          <span style="color: #666; font-size: 8px; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 5px; letter-spacing: 1px;">Correo Registrado</span>
          <span style="color: #ffffff; font-size: 16px; font-weight: bold; font-family: monospace;">${subscriberEmail}</span>
        </div>

        <hr style="border: 0; border-top: 1px solid #1a1a1a; margin-bottom: 25px;">

        <p style="color: #444; font-size: 10px; font-weight: 300; margin: 0;">
          Este correo fue enviado de forma automática desde el servidor de matrixproducciones.com
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
        sender: { name: "Matrix Producciones", email: "info@matrixproducciones.com" },
        to: [{ email: "info@matrixproducciones.com", name: "Eliecer Rojas" }],
        subject: `🔔 Nuevo Suscriptor del Boletín: ${subscriberEmail}`,
        htmlContent: htmlContent
      })
    });

    if (response.ok) {
      console.log(`✅ Notificación de suscripción enviada con éxito para ${subscriberEmail}.`);
    } else {
      const errText = await response.text();
      console.error("❌ Error al enviar notificación de suscripción:", errText);
    }
  } catch (error) {
    console.error("❌ Excepción al enviar notificación de suscripción:", error);
  }
}
