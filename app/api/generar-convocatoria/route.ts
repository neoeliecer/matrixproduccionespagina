import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Lista curada de feeds RSS especializados en convocatorias, estímulos y cine
const FEEDS_CONVOCATORIAS = [
  {
    name: "Colombia - Estímulos & Becas",
    scope: "Colombia",
    urls: [
      "https://news.google.com/rss/search?q=estimulos+ministerio+cultura+colombia&hl=es&gl=CO&ceid=CO:es",
      "https://news.google.com/rss/search?q=becas+cine+colombia&hl=es&gl=CO&ceid=CO:es",
      "https://news.google.com/rss/search?q=convocatoria+proimagenes+colombia&hl=es&gl=CO&ceid=CO:es"
    ]
  },
  {
    name: "Colombia - Castings & Proyectos",
    scope: "Colombia",
    urls: [
      "https://news.google.com/rss/search?q=casting+actores+cali+bogota&hl=es&gl=CO&ceid=CO:es",
      "https://news.google.com/rss/search?q=convocatoria+cine+pacifico+colombiano&hl=es&gl=CO&ceid=CO:es",
      "https://news.google.com/rss/search?q=convocatoria+cortometraje+colombia&hl=es&gl=CO&ceid=CO:es"
    ]
  },
  {
    name: "Internacional - Becas & Fondos",
    scope: "Internacional",
    urls: [
      "https://news.google.com/rss/search?q=film+grants+international&hl=en&gl=US&ceid=US:en",
      "https://news.google.com/rss/search?q=documentary+funding+grants&hl=en&gl=US&ceid=US:en",
      "https://news.google.com/rss/search?q=ibermedia+convocatoria&hl=es&gl=CO&ceid=CO:es"
    ]
  },
  {
    name: "Internacional - Festivales & Envíos",
    scope: "Internacional",
    urls: [
      "https://news.google.com/rss/search?q=film+festival+submissions+open&hl=en&gl=US&ceid=US:en",
      "https://filmfreeway.com/festivals/rss"
    ]
  }
];

// Helper para extraer campos básicos de un XML RSS (título y descripción) sin librerías pesadas
function parseRssXml(xml: string) {
  const items: Array<{ title: string; description: string; link: string }> = [];
  const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

  for (const itemXml of itemMatches) {
    const titleMatch = itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || itemXml.match(/<title>([\s\S]*?)<\/title>/);
    const descMatch = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) || itemXml.match(/<description>([\s\S]*?)<\/description>/);
    const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);

    const title = titleMatch ? titleMatch[1].replace(/<\/?[^>]+(>|$)/g, "").trim() : "";
    const description = descMatch ? descMatch[1].replace(/<\/?[^>]+(>|$)/g, "").trim() : "";
    const link = linkMatch ? linkMatch[1].trim() : "";

    if (title) {
      items.push({ title, description, link });
    }
  }
  return items;
}

export async function POST(request: Request) {
  try {
    const { password } = await request.json().catch(() => ({ password: "" }));

    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const groqApiKey = process.env.GROQ_API_KEY;
    const githubToken = process.env.GITHUB_TOKEN;

    // Control de acceso seguro
    if (password && password !== adminPassword) {
      return NextResponse.json({ error: "Contraseña inválida" }, { status: 401 });
    }

    if (!groqApiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY no está configurada." },
        { status: 500 }
      );
    }

    if (!githubToken) {
      return NextResponse.json(
        { error: "GITHUB_TOKEN no está configurada." },
        { status: 500 }
      );
    }

    // 1. Obtener las convocatorias actuales desde GitHub para evitar duplicados
    const repoOwner = "neoeliecer";
    const repoName = "matrixproduccionespagina";
    const filePath = "data/convocatorias.json";

    const githubApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
    
    let currentConvocatorias: any[] = [];
    let fileSha = "";

    try {
      const getFileResponse = await fetch(githubApiUrl, {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "NextJS-Convocatorias-CMS",
        },
        cache: "no-store",
      });

      if (getFileResponse.ok) {
        const fileData = await getFileResponse.json();
        fileSha = fileData.sha;
        const decodedContent = Buffer.from(fileData.content, "base64").toString("utf-8");
        currentConvocatorias = JSON.parse(decodedContent);
      }
    } catch (e) {
      console.error("Error leyendo convocatorias.json de GitHub:", e);
    }

    // 2. Buscar un artículo en los feeds que no esté en la base de datos
    let selectedFeedUrl = "";
    let selectedGroupScope = "Colombia";
    let selectedGroupName = "Colombia - Estímulos & Becas";
    let rssItems: Array<{ title: string; description: string; link: string }> = [];

    // Desordenar grupos de feeds para aleatoriedad
    const shuffledGroups = [...FEEDS_CONVOCATORIAS].sort(() => 0.5 - Math.random());
    
    let availableItem: { title: string; description: string; link: string } | null = null;

    for (const group of shuffledGroups) {
      const shuffledUrls = [...group.urls].sort(() => 0.5 - Math.random());
      for (const url of shuffledUrls) {
        try {
          const rssResponse = await fetch(url, { signal: AbortSignal.timeout(8000) });
          if (rssResponse.ok) {
            const xmlText = await rssResponse.text();
            const items = parseRssXml(xmlText);
            
            if (items.length > 0) {
              // Buscar el primer item que NO esté duplicado
              const nonDuplicateItem = items.find((item) => {
                const cleanTitle = item.title.toLowerCase().substring(0, 15);
                const isDuplicated = currentConvocatorias.some((c) => {
                  const existingTitle = c.title.toLowerCase();
                  return existingTitle.includes(cleanTitle) || cleanTitle.includes(existingTitle.substring(0, 15));
                });
                return !isDuplicated;
              });

              if (nonDuplicateItem) {
                rssItems = items;
                availableItem = nonDuplicateItem;
                selectedFeedUrl = url;
                selectedGroupScope = group.scope;
                selectedGroupName = group.name;
                break;
              }
            }
          }
        } catch (err) {
          console.warn(`Error leyendo feed: ${url}, intentando otro...`);
        }
      }
      if (availableItem) break;
    }

    // Fallback por si fallan los feeds o todos están duplicados (generamos una basada en info clásica)
    if (!availableItem) {
      availableItem = {
        title: "Convocatoria Especial de Fomento Cinematográfico en Iberoamérica",
        description: "Apoyos financieros y becas de co-producción para el desarrollo de guiones y preproducción de obras de ficción y documental.",
        link: "https://www.programaibermedia.com"
      };
      selectedGroupScope = Math.random() > 0.5 ? "Colombia" : "Internacional";
      selectedFeedUrl = "Fallback";
    }

    // 3. Consultar a la Groq API para estructurar y curar la convocatoria
    const systemPrompt = `Eres un agente experto en curación y redacción de convocatorias y oportunidades para cineastas, actores y directores en "Matrix Producciones" (Cali, Colombia).
Tu objetivo es tomar la siguiente noticia o convocatoria real e interpretarla para estructurar una convocatoria extremadamente atractiva, profesional, detallada y útil en español.

El ámbito de la convocatoria es: "${selectedGroupScope}".
Título de la fuente original: "${availableItem.title}"
Resumen de la fuente original: "${availableItem.description}"
Enlace original: "${availableItem.link}"

Debes devolver ÚNICAMENTE un objeto JSON válido con los campos exactos descritos a continuación (no añadas explicaciones fuera del JSON):
{
  "title": "Un título corto, profesional y conciso de la convocatoria en español (no copies literalmente de la fuente, sé creativo)",
  "excerpt": "Un resumen corto y atrapante de 2 líneas sobre de qué trata la oportunidad y a quién va dirigida",
  "category": "Elige estrictamente una de las siguientes opciones: 'Casting' o 'Becas & Estímulos' o 'Festivales' o 'Fondos de Fomento'",
  "scope": "Elige estrictamente 'Colombia' o 'Internacional'",
  "deadline": "Fecha de cierre amigable en español (ej. '15 de Agosto, 2026'). Deduce una realista de acuerdo a la noticia o colócala a 2 meses en el futuro",
  "entity": "Nombre de la entidad, institución o productora convocante (ej. 'Ministerio de Cultura', 'Ibermedia', 'Proimágenes', 'Festival de Cannes', etc.)",
  "image": "URL de imagen realista de Unsplash relacionada con cine, actuación, teatro, audiciones o grabación de películas (debe ser una URL real de https://images.unsplash.com/...)",
  "requirements": "Resumen rápido y conciso en una línea de los requisitos indispensables (ej. 'Residir en Colombia, portafolio de cortometrajes y guion final')",
  "content": "Descripción profunda de la convocatoria (de 3 a 4 párrafos). Usa subtítulos markdown '###' para estructurar los requisitos y detalles del apoyo (ej: '### Quiénes pueden postularse' y '### Beneficios y Apoyo')",
  "link": "Enlace oficial o de la fuente para aplicar (usa '${availableItem.link}' si es válido, de lo contrario coloca uno coherente)"
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
      return NextResponse.json(
        { error: `Error en Groq API: ${errText}` },
        { status: 502 }
      );
    }

    const groqData = await groqResponse.json();
    const generatedConvocatoria = JSON.parse(groqData.choices[0].message.content);

    // Complementar con la fecha actual de publicación en español
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    generatedConvocatoria.date = new Date().toLocaleDateString("es-ES", options);

    // 4. Agregar a la base de datos y subir a GitHub
    currentConvocatorias.unshift(generatedConvocatoria);

    // Mantener un límite razonable en el archivo para que no crezca desmedidamente
    if (currentConvocatorias.length > 50) {
      currentConvocatorias = currentConvocatorias.slice(0, 50);
    }

    const updatedContentBase64 = Buffer.from(JSON.stringify(currentConvocatorias, null, 2)).toString("base64");

    const putFileResponse = await fetch(githubApiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "NextJS-Convocatorias-CMS",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `🤖 AutoConvocatoria: Nueva oportunidad IA: "${generatedConvocatoria.title}"`,
        content: updatedContentBase64,
        sha: fileSha || undefined,
        branch: "main",
      }),
    });

    if (!putFileResponse.ok) {
      const putErr = await putFileResponse.text();
      return NextResponse.json(
        { error: `Error guardando en GitHub: ${putErr}`, convocatoria: generatedConvocatoria },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Convocatoria generada y publicada con éxito.",
      source: {
        title: availableItem.title,
        feed: selectedFeedUrl,
        group: selectedGroupName
      },
      convocatoria: generatedConvocatoria,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}
