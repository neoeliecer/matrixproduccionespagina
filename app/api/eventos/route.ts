import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const repoOwner = "neoeliecer";
const repoName = "matrixproduccionespagina";
const filePath = "data/events.json";
const githubApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

// Helper to read events (trying GitHub first, falling back to local filesystem)
async function getEvents(githubToken?: string) {
  let events: any[] = [];
  let sha = "";

  // 1. Try reading from GitHub if token exists
  if (githubToken) {
    try {
      const response = await fetch(githubApiUrl, {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "NextJS-Events-CMS",
        },
        cache: "no-store",
      });
      if (response.ok) {
        const fileData = await response.json();
        sha = fileData.sha;
        const decodedContent = Buffer.from(fileData.content, "base64").toString("utf-8");
        events = JSON.parse(decodedContent);
        return { events, sha };
      }
    } catch (e) {
      console.error("Error reading events from GitHub:", e);
    }
  }

  // 2. Fallback to reading from local filesystem
  try {
    const localPath = path.join(process.cwd(), "data", "events.json");
    if (fs.existsSync(localPath)) {
      const localContent = fs.readFileSync(localPath, "utf-8");
      events = JSON.parse(localContent);
    }
  } catch (e) {
    console.error("Error reading events from local filesystem:", e);
  }

  return { events, sha };
}

// Helper to write events (updating local filesystem, and updating GitHub if token exists)
async function saveEvents(events: any[], sha?: string, githubToken?: string) {
  // 1. Always update local file first (for instant local updates/fallback)
  try {
    const localPath = path.join(process.cwd(), "data", "events.json");
    const dir = path.dirname(localPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(localPath, JSON.stringify(events, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing events to local filesystem:", e);
  }

  // 2. Write to GitHub if token exists
  if (githubToken) {
    try {
      const updatedContentBase64 = Buffer.from(JSON.stringify(events, null, 2)).toString("base64");
      const putFileResponse = await fetch(githubApiUrl, {
        method: "PUT",
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "NextJS-Events-CMS",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `🤖 AutoCMS: Cartelera de eventos actualizada`,
          content: updatedContentBase64,
          sha: sha || undefined,
          branch: "main",
        }),
      });
      return putFileResponse.ok;
    } catch (e) {
      console.error("Error writing events to GitHub:", e);
    }
  }

  return true;
}

// GET Method: Returns the up-to-date events catalog
export async function GET() {
  try {
    const githubToken = process.env.GITHUB_TOKEN;
    const { events } = await getEvents(githubToken);
    return NextResponse.json({ success: true, events });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al obtener eventos" }, { status: 500 });
  }
}

// POST Method: Supports autocompleting and publishing
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { password, action, title, userOpinion, event } = body;

    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const githubToken = process.env.GITHUB_TOKEN;
    const groqApiKey = process.env.GROQ_API_KEY;

    // --- ACCIÓN: AUTOCOMPLETAR CON IA ---
    // Requiere obligatoriamente la contraseña de administrador
    if (action === "autocompletar") {
      if (!password || password !== adminPassword) {
        return NextResponse.json({ error: "Contraseña de administrador incorrecta." }, { status: 401 });
      }

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
  "tag": "Categoría o etiqueta corta del evento (ej. 'Teatro', 'Cine', 'Cultural')",
  "excerpt": "Un resumen corto y atrapante de 2 líneas sobre el evento cultural para el catálogo (ej. 'Compañías teatrales de todo el mundo se reúnen en Cali para presentar obras que invitan a la reflexión social.')",
  "description": "Tu crónica o noticia completa e inspiradora (de 3 a 4 párrafos en español). Explica la importancia del evento, qué se vive allí, actividades destacadas o impacto social. Puedes usar formato markdown básico (como subtítulos ### o listas con asteriscos * ) para estructurar el texto bellamente.",
  "categoryLocation": "Elige estrictamente una de estas 6 opciones según la ciudad/país del evento: 'Cali', 'Colombia', 'Estados Unidos', 'Nueva York', 'Atlanta' o 'España'"
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

    // --- ACCIÓN: GUARDAR NUEVO EVENTO ---
    if (!event || !event.title || !event.description) {
      return NextResponse.json({ error: "Datos del evento incompletos." }, { status: 400 });
    }

    // Cargar los eventos actuales
    const { events: currentEvents, sha: fileSha } = await getEvents(githubToken);

    // Evitar duplicados por título (comparando primeros 15 caracteres para mayor resiliencia)
    const isDuplicate = currentEvents.some((item) => {
      const cleanNew = event.title.toLowerCase().trim().substring(0, 15);
      const cleanExisting = item.title.toLowerCase().trim().substring(0, 15);
      return cleanNew === cleanExisting || cleanExisting.includes(cleanNew) || cleanNew.includes(cleanExisting);
    });

    if (isDuplicate) {
      return NextResponse.json({ error: "Este evento cultural ya se encuentra registrado." }, { status: 400 });
    }

    // Procesar galería de fotos (convertir string separado por comas a array o usar el array existente)
    let galleryArray: string[] = [];
    if (event.gallery && typeof event.gallery === "string") {
      galleryArray = event.gallery
        .split(",")
        .map((url: string) => url.trim())
        .filter((url: string) => url.startsWith("http"));
    } else if (Array.isArray(event.gallery)) {
      galleryArray = event.gallery;
    }

    // Adaptar categoría/etiqueta
    let rawTag = event.tag?.trim() || "Cultural";
    if (rawTag.toLowerCase().includes("cine")) rawTag = "Cine";
    else if (rawTag.toLowerCase().includes("teatro")) rawTag = "Teatro";
    else rawTag = "Cultural";

    const newEvent = {
      title: event.title.trim(),
      location: event.location?.trim() || "No especificado",
      date: event.date?.trim() || "No especificado",
      tag: rawTag,
      image: event.image?.trim() || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800",
      gallery: galleryArray,
      excerpt: event.excerpt?.trim() || event.description.substring(0, 120) + "...",
      description: event.description.trim(),
      categoryLocation: event.categoryLocation?.trim() || "Cali" // Por defecto en Cali
    };

    currentEvents.unshift(newEvent);

    // Limitar tamaño del catálogo para optimizar pre-render
    let updatedEvents = currentEvents;
    if (updatedEvents.length > 50) {
      updatedEvents = updatedEvents.slice(0, 50);
    }

    // Guardar (Local y GitHub si está disponible)
    const saveSuccess = await saveEvents(updatedEvents, fileSha, githubToken);

    if (!saveSuccess) {
      return NextResponse.json(
        { error: "Error guardando el evento en el repositorio." },
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
