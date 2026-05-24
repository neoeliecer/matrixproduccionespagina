import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Falta el historial de mensajes." }, { status: 400 });
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
    }

    return NextResponse.json({ reply: aiText });
  } catch (error: any) {
    console.error("Error en API de Chat:", error);
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}
