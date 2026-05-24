import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { password, action, title, userOpinion, event } = body;

    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const githubToken = process.env.GITHUB_TOKEN;
    const groqApiKey = process.env.GROQ_API_KEY;

    // 1. Control de seguridad
    if (!password || password !== adminPassword) {
      return NextResponse.json({ error: "Contraseña de administrador incorrecta." }, { status: 401 });
    }

    // --- ACCIÓN: AUTOCOMPLETAR CON IA ---
    if (action === "autocompletar") {
      if (!title || title.trim() === "") {
        return NextResponse.json({ error: "Debes ingresar el título del evento para autocompletar." }, { status: 400 });
      }

      if (!groqApiKey) {
        return NextResponse.json({ error: "La API key de Groq no está configurada." }, { status: 500 });
      }

      const systemPrompt = `Eres un redactor y cronista cultural experto para "Matrix Producciones". 
Tu objetivo es tomar el título del evento titulado "${title}" y redactar una reseña o crónica cultural profesional, vibrante y atractiva en español.
El tono debe ser cinematográfico, cultural, apasionado y elegante.

${userOpinion && userOpinion.trim() !== "" ? `IMPORTANTE - Borrador / Inicio de la noticia proporcionado por el director Eliecer: Él te ha dado este borrador, datos iniciales o inicio de la noticia para que lo mejores, pulas y expandas directamente en tu redacción: "${userOpinion}". Asegúrate de incorporar fielmente sus ideas y mejorar el texto haciéndolo ver sumamente profesional.` : ""}

Debes devolver ÚNICAMENTE un objeto JSON válido con los campos exactos descritos a continuación (no añadas explicaciones fuera del JSON):
{
  "location": "Lugar y ciudad del evento (ej. 'Teatro Municipal Enrique Buenaventura, Cali')",
  "date": "Fecha del evento (ej. '20 de Septiembre, 2026')",
  "tag": "Categoría o etiqueta corta del evento (ej. 'Teatro & Comunidad', 'Música & Tradición', 'Cine', 'Arte')",
  "excerpt": "Un resumen corto y atrapante de 2 líneas sobre el evento cultural para el catálogo (ej. 'Compañías teatrales de todo el mundo se reúnen en Cali para presentar obras que invitan a la reflexión social.')",
  "description": "Tu crónica o noticia completa e inspiradora (de 3 a 4 párrafos en español). Explica la importancia del evento, qué se vive allí, actividades destacadas o impacto social. Puedes usar formato markdown básico (como subtítulos ### o listas con asteriscos * ) para estructurar el texto bellamente."
}`;

      const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "system", content: systemPrompt }],
          temperature: 0.7,
          max_tokens: 1500,
          response_format: { type: "json_object" }
        }),
      });

      if (!groqResponse.ok) {
        const errText = await groqResponse.text();
        return NextResponse.json({ error: `Error en Groq API: ${errText}` }, { status: 502 });
      }

      const groqData = await groqResponse.json();
      const generatedData = JSON.parse(groqData.choices[0].message.content);

      return NextResponse.json({
        success: true,
        data: generatedData
      });
    }

    if (!githubToken) {
      return NextResponse.json(
        { error: "GITHUB_TOKEN no está configurada en el servidor." },
        { status: 500 }
      );
    }

    const repoOwner = "neoeliecer";
    const repoName = "matrixproduccionespagina";
    const filePath = "data/events.json";
    const githubApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    let currentEvents: any[] = [];
    let fileSha = "";

    // 2. Obtener los eventos actuales desde GitHub
    try {
      const getFileResponse = await fetch(githubApiUrl, {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "NextJS-Events-CMS",
        },
        cache: "no-store",
      });

      if (getFileResponse.ok) {
        const fileData = await getFileResponse.json();
        fileSha = fileData.sha;
        const decodedContent = Buffer.from(fileData.content, "base64").toString("utf-8");
        currentEvents = JSON.parse(decodedContent);
      }
    } catch (e) {
      console.error("Error leyendo events.json de GitHub:", e);
    }

    // --- ACCIÓN: GUARDAR NUEVO EVENTO ---
    if (!event || !event.title || !event.description) {
      return NextResponse.json({ error: "Datos del evento incompletos." }, { status: 400 });
    }

    // Evitar duplicados por título
    const isDuplicate = currentEvents.some(
      (item) => item.title.toLowerCase().trim() === event.title.toLowerCase().trim()
    );

    if (isDuplicate) {
      return NextResponse.json({ error: "Este evento cultural ya se encuentra registrado." }, { status: 400 });
    }

    // Procesar galería de fotos (convertir string separado por comas a array)
    let galleryArray: string[] = [];
    if (event.gallery && typeof event.gallery === "string") {
      galleryArray = event.gallery
        .split(",")
        .map((url: string) => url.trim())
        .filter((url: string) => url.startsWith("http"));
    } else if (Array.isArray(event.gallery)) {
      galleryArray = event.gallery;
    }

    const newEvent = {
      title: event.title.trim(),
      location: event.location?.trim() || "No especificado",
      date: event.date?.trim() || "No especificado",
      tag: event.tag?.trim() || "Cultura",
      image: event.image?.trim() || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800",
      gallery: galleryArray,
      excerpt: event.excerpt?.trim() || event.description.substring(0, 120) + "...",
      description: event.description.trim()
    };

    currentEvents.unshift(newEvent);

    // Limitar tamaño del catálogo para optimizar pre-render
    if (currentEvents.length > 50) {
      currentEvents = currentEvents.slice(0, 50);
    }

    // Guardar de vuelta en GitHub
    const updatedContentBase64 = Buffer.from(JSON.stringify(currentEvents, null, 2)).toString("base64");

    const putFileResponse = await fetch(githubApiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "NextJS-Events-CMS",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `🤖 AutoCMS: Nuevo evento cultural añadido: "${newEvent.title}"`,
        content: updatedContentBase64,
        sha: fileSha || undefined,
        branch: "main",
      }),
    });

    if (!putFileResponse.ok) {
      const putErr = await putFileResponse.text();
      return NextResponse.json(
        { error: `Error guardando evento en GitHub: ${putErr}` },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "¡Evento cultural añadido con éxito!",
      event: newEvent,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}
