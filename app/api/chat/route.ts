import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Falta el historial de mensajes." }, { status: 400 });
    }

    // Detección de primera interacción en el chat (Saludo + primer mensaje del usuario = 2 mensajes)
    if (messages.length === 2 && messages[1]?.role === "user") {
      const firstMessageText = messages[1].content || "";
      enviarNotificacionChatInicio(firstMessageText).catch((err) =>
        console.error("Error al disparar notificación de inicio de chat:", err)
      );
    }

    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      console.error("❌ ERROR: GROQ_API_KEY no está configurada en las variables de entorno.");
      return NextResponse.json({ error: "API de Inteligencia Artificial no configurada en el servidor." }, { status: 500 });
    }

    // System Prompt detallado de Matrix Producciones
    const systemPrompt = `Eres "Asistente Matrix", la Inteligencia Artificial oficial de Matrix Producciones, una prestigiosa productora cinematográfica y de servicios audiovisuales premium con sede en Cali, Colombia. 
Tu misión es atender a los visitantes de nuestra página web en tiempo real. Sé sumamente cortés, apasionado por el cine, servicial y carismático. Usa emojis de cine 🎬, de cámara 🎥 o de fotos 📸 estratégicamente. 
Habla con seguridad, orgullo de nuestra trayectoria (3 años, 2 historias filmadas) y describe con pasión lo que hacemos.

Servicios de Matrix Producciones:
1. Cine Documental y Cortometrajes con alto valor cultural, social y ético.
2. Registro Fotográfico Profesional de Eventos corporativos y sociales.
3. Entrevistas y Contenidos de Video dinámicos para Redes Sociales.
4. Producción de Campañas de Marketing Social y Convocatorias de Fomento.

Información útil sobre la web:
- Sección de Recomendadas: "/recomendadas" (Cine con propósito social, trailers y críticas).
- Sección de Convocatorias: "/convocatorias" (Becas, estímulos, festivales vigentes curados por IA).
- Sección de Eventos Culturales: "/eventos" (La agenda cultural y galerías de fotos de Cali).
- Formulario de Contacto: "/contacto" (Para escribirnos directamente).
- Formulario de Propuestas: "/propuesta" (Para enviar proyectos cinematográficos en co-creación).
- WhatsApp Oficial: +57 317 473 4070 (enlace a wa.me/573174734070).

Newsletter y Blog:
- Blog: "/blog" (Tendencias y novedades del cine en español).
- Newsletter: Invita al usuario a registrarse en el pie de página ("Newsletter") para recibir alertas y novedades al correo de inmediato.

🚨 REGLA ULTRA IMPORTANTE DE REGISTRO EN GOOGLE SHEETS:
Si el cliente en el chat te dice voluntariamente su Nombre y su Correo Electrónico (o si se los pides amablemente y te los da), debes agregar EXACTAMENTE esta etiqueta oculta al final de tu respuesta de texto en una línea nueva:
[REGISTRAR_CLIENTE: NombreDelCliente, CorreoDelCliente]
Ejemplo: "¡Perfecto, Carlos! He agendado tus datos... [REGISTRAR_CLIENTE: Carlos, carlos@correo.com]"
(Esta etiqueta se procesará por debajo para guardarlo en la base de datos de Google Sheets de Eliecer, y luego se limpiará de la pantalla).

Mantén tus respuestas elegantes, organizadas con negritas de WhatsApp/Markdown, con saltos de línea legibles y no demasiado largas.`;

    const payload = {
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 800
    };

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Error en Groq API:", errorData);
      return NextResponse.json({ error: "Error de comunicación con la IA." }, { status: 502 });
    }

    const data = await response.json();
    let aiText = data.choices[0].message.content || "";

    // 🔍 Detección del registro automático en Google Sheets
    const registerRegex = /\[REGISTRAR_CLIENTE:\s*(.*?),\s*(.*?)\]/;
    const match = aiText.match(registerRegex);

    if (match) {
      const name = match[1].trim();
      const email = match[2].trim();
      
      // Limpiamos la respuesta para que el usuario no vea el código técnico
      aiText = aiText.replace(registerRegex, "").trim();

      // Enviar datos en segundo plano a Google Sheets mediante tu Apps Script Web App
      const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK || "https://script.google.com/macros/s/AKfycbyq2-nMUEfBWHQY264hmrWVPxw2PqbwB4anBtkgUYmmA7eCGOr8BVnHmT0SgaKTqet6nQ/exec";
      
      fetch(webhookUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          email: email,
          message: "[Chat Web] Cliente registrado automáticamente por el asistente de la Web"
        })
      }).catch(err => console.error("❌ Error guardando lead en Google Sheets:", err.message));

      // Suscribir automáticamente al Newsletter de Brevo
      fetch("https://matrixproducciones.com/api/suscribir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email })
      }).catch(err => console.error("❌ Error suscribiendo lead al newsletter:", err.message));

      // Notificar por correo al administrador del nuevo lead
      enviarNotificacionLeadCapturado(name, email).catch(err =>
        console.error("Error al enviar notificación de lead capturado:", err)
      );
    }

    return NextResponse.json({ reply: aiText });
  } catch (error: any) {
    console.error("Error en API de Chat:", error);
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}

// Función auxiliar para enviar notificación de inicio de chat mediante Brevo
async function enviarNotificacionChatInicio(firstMessage: string) {
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
      <title>Nueva Conversación - Asistente Matrix</title>
    </head>
    <body style="background-color: #030303; color: #ffffff; font-family: sans-serif; padding: 30px 15px; margin: 0;">
      <div style="max-w: 600px; margin: 0 auto; background-color: #090909; border: 1px solid #1a1a1a; border-radius: 16px; padding: 40px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
        
        <!-- Header -->
        <div style="margin-bottom: 25px;">
          <h1 style="color: #ffffff; font-size: 20px; font-weight: 900; letter-spacing: 3px; margin: 0; text-transform: uppercase;">
            MATRIX <span style="color: #00FF88;">PRODUCCIONES</span>
          </h1>
          <p style="color: #666; font-size: 9px; letter-spacing: 2px; margin: 5px 0 0 0; text-transform: uppercase;">
            Asistente Matrix IA
          </p>
        </div>

        <hr style="border: 0; border-top: 1px solid #1a1a1a; margin-bottom: 25px;">

        <span style="color: #00FF88; font-size: 9px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 10px;">
          Interacción en Vivo
        </span>
        <h2 style="color: #ffffff; font-size: 24px; font-weight: 900; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 1px;">
          💬 Nueva Conversación Iniciada
        </h2>
        
        <p style="color: #a0a0a0; font-size: 14px; line-height: 1.6; font-weight: 300; margin-bottom: 25px;">
          Un visitante de tu sitio web acaba de enviarle su primera consulta a tu Asistente de Inteligencia Artificial.
        </p>

        <!-- Mensaje del Usuario -->
        <div style="background-color: #030303; border: 1px solid #141414; padding: 25px; border-radius: 12px; text-align: left; margin-bottom: 25px;">
          <span style="color: #666; font-size: 8px; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 10px; letter-spacing: 1px;">Primer Mensaje Escrito</span>
          <p style="color: #ffffff; font-size: 14px; line-height: 1.6; font-style: italic; margin: 0; font-family: monospace; border-left: 3px solid #00FF88; padding-left: 15px;">
            "${firstMessage}"
          </p>
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
        sender: { name: "Asistente Matrix", email: "info@matrixproducciones.com" },
        to: [{ email: "info@matrixproducciones.com", name: "Eliecer Rojas" }],
        subject: `💬 Nueva Conversación Iniciada en la Web`,
        htmlContent: htmlContent
      })
    });

    if (response.ok) {
      console.log(`✅ Notificación de inicio de chat enviada con éxito.`);
    } else {
      const errText = await response.text();
      console.error("❌ Error al enviar notificación de inicio de chat:", errText);
    }
  } catch (error) {
    console.error("❌ Excepción al enviar notificación de inicio de chat:", error);
  }
}

// Función auxiliar para enviar notificación de lead capturado mediante Brevo
async function enviarNotificacionLeadCapturado(name: string, email: string) {
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
      <title>Nuevo Lead - Asistente Matrix</title>
    </head>
    <body style="background-color: #030303; color: #ffffff; font-family: sans-serif; padding: 30px 15px; margin: 0;">
      <div style="max-w: 600px; margin: 0 auto; background-color: #090909; border: 1px solid #1a1a1a; border-radius: 16px; padding: 40px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
        
        <!-- Header -->
        <div style="margin-bottom: 25px;">
          <h1 style="color: #ffffff; font-size: 20px; font-weight: 900; letter-spacing: 3px; margin: 0; text-transform: uppercase;">
            MATRIX <span style="color: #00FF88;">PRODUCCIONES</span>
          </h1>
          <p style="color: #666; font-size: 9px; letter-spacing: 2px; margin: 5px 0 0 0; text-transform: uppercase;">
            Captura de Contacto
          </p>
        </div>

        <hr style="border: 0; border-top: 1px solid #1a1a1a; margin-bottom: 25px;">

        <span style="color: #00FF88; font-size: 9px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 10px;">
          Asistente Matrix IA
        </span>
        <h2 style="color: #ffffff; font-size: 24px; font-weight: 900; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 1px;">
          🎯 ¡Nuevo Lead Registrado!
        </h2>
        
        <p style="color: #a0a0a0; font-size: 14px; line-height: 1.6; font-weight: 300; margin-bottom: 25px;">
          El Asistente de IA ha capturado con éxito los datos de contacto de un potencial cliente en el chat en vivo y los ha guardado en Google Sheets.
        </p>

        <!-- Ficha de Datos -->
        <div style="background-color: #030303; border: 1px solid #141414; padding: 25px; border-radius: 12px; text-align: left; margin-bottom: 25px; display: inline-block; min-width: 320px; box-sizing: border-box;">
          <div style="margin-bottom: 15px;">
            <span style="color: #666; font-size: 8px; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 5px; letter-spacing: 1px;">Nombre Completo</span>
            <span style="color: #ffffff; font-size: 15px; font-weight: bold; font-family: sans-serif;">${name}</span>
          </div>
          <div>
            <span style="color: #666; font-size: 8px; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 5px; letter-spacing: 1px;">Correo Electrónico</span>
            <span style="color: #00FF88; font-size: 15px; font-weight: bold; font-family: monospace;">${email}</span>
          </div>
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
        sender: { name: "Asistente Matrix", email: "info@matrixproducciones.com" },
        to: [{ email: "info@matrixproducciones.com", name: "Eliecer Rojas" }],
        subject: `🎯 Nuevo Lead Registrado: ${name} (${email})`,
        htmlContent: htmlContent
      })
    });

    if (response.ok) {
      console.log(`✅ Notificación de lead capturado enviada con éxito.`);
    } else {
      const errText = await response.text();
      console.error("❌ Error al enviar notificación de lead capturado:", errText);
    }
  } catch (error) {
    console.error("❌ Excepción al enviar notificación de lead capturado:", error);
  }
}
