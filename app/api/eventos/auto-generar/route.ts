import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// Feeds RSS especializados de Google News para espectáculos, teatro, cine y cultura por región
const FEEDS_EVENTOS = [
  {
    location: "Cali",
    lang: "es",
    urls: [
      "https://news.google.com/rss/search?q=cine+teatro+eventos+culturales+cali&hl=es-419&gl=CO&ceid=CO:es-419",
      "https://news.google.com/rss/search?q=agenda+cultural+teatro+cali&hl=es-419&gl=CO&ceid=CO:es-419"
    ]
  },
  {
    location: "Medellín",
    lang: "es",
    urls: [
      "https://news.google.com/rss/search?q=cine+teatro+eventos+culturales+medellin&hl=es-419&gl=CO&ceid=CO:es-419",
      "https://news.google.com/rss/search?q=agenda+cultural+teatro+medellin&hl=es-419&gl=CO&ceid=CO:es-419"
    ]
  },
  {
    location: "Bogotá",
    lang: "es",
    urls: [
      "https://news.google.com/rss/search?q=cine+teatro+eventos+culturales+bogota&hl=es-419&gl=CO&ceid=CO:es-419",
      "https://news.google.com/rss/search?q=agenda+cultural+teatro+bogota&hl=es-419&gl=CO&ceid=CO:es-419"
    ]
  },
  {
    location: "Manizales",
    lang: "es",
    urls: [
      "https://news.google.com/rss/search?q=cine+teatro+eventos+culturales+manizales&hl=es-419&gl=CO&ceid=CO:es-419",
      "https://news.google.com/rss/search?q=agenda+cultural+teatro+manizales&hl=es-419&gl=CO&ceid=CO:es-419",
      "https://news.google.com/rss/search?q=festival+teatro+manizales&hl=es-419&gl=CO&ceid=CO:es-419"
    ]
  },
  {
    location: "Colombia",
    lang: "es",
    urls: [
      "https://news.google.com/rss/search?q=cine+teatro+cultural+colombia&hl=es-419&gl=CO&ceid=CO:es-419",
      "https://news.google.com/rss/search?q=festival+teatro+cine+colombia&hl=es-419&gl=CO&ceid=CO:es-419"
    ]
  },
  {
    location: "España",
    lang: "es",
    urls: [
      "https://news.google.com/rss/search?q=teatro+cine+eventos+culturales+madrid+barcelona&hl=es&gl=ES&ceid=ES:es",
      "https://news.google.com/rss/search?q=agenda+cultural+espectaculos+españa&hl=es&gl=ES&ceid=ES:es"
    ]
  },
  {
    location: "Estados Unidos",
    lang: "en",
    urls: [
      "https://news.google.com/rss/search?q=broadway+theater+events+usa&hl=en&gl=US&ceid=US:en",
      "https://news.google.com/rss/search?q=cultural+events+festivals+usa&hl=en&gl=US&ceid=US:en"
    ]
  },
  {
    location: "Nueva York",
    lang: "en",
    urls: [
      "https://news.google.com/rss/search?q=broadway+shows+theater+new+york&hl=en&gl=US&ceid=US:en",
      "https://news.google.com/rss/search?q=cultural+events+festivals+nyc&hl=en&gl=US&ceid=US:en"
    ]
  },
  {
    location: "Atlanta",
    lang: "en",
    urls: [
      "https://news.google.com/rss/search?q=theater+cinema+shows+atlanta&hl=en&gl=US&ceid=US:en",
      "https://news.google.com/rss/search?q=cultural+events+festivals+atlanta&hl=en&gl=US&ceid=US:en"
    ]
  }
];

// Parser liviano de RSS XML
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

// GitHub constants
const repoOwner = "neoeliecer";
const repoName = "matrixproduccionespagina";
const filePath = "data/events.json";
const githubApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

async function getEvents(githubToken?: string) {
  let events: any[] = [];
  let sha = "";

  if (githubToken) {
    try {
      const response = await fetch(githubApiUrl, {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "NextJS-Events-Auto",
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

async function saveEvents(events: any[], sha?: string, githubToken?: string, titleName?: string) {
  // Update local file
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

  // Update GitHub
  if (githubToken) {
    try {
      const updatedContentBase64 = Buffer.from(JSON.stringify(events, null, 2)).toString("base64");
      const putFileResponse = await fetch(githubApiUrl, {
        method: "PUT",
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "NextJS-Events-Auto",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `🤖 AutoEventos: Nuevo evento por IA: "${titleName || 'Curado por Matrix'}"`,
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

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { password, location } = body;

    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const groqApiKey = process.env.GROQ_API_KEY;
    const githubToken = process.env.GITHUB_TOKEN;

    // Si se provee contraseña, se debe validar (caso n8n/cron jobs).
    // Si viene del cliente interactivo para demos, no se requiere contraseña obligatoria.
    if (password && password !== adminPassword) {
      return NextResponse.json({ error: "Contraseña de administrador incorrecta." }, { status: 401 });
    }

    if (!groqApiKey) {
      return NextResponse.json(
        { error: "La API key de Groq (GROQ_API_KEY) no está configurada." },
        { status: 500 }
      );
    }

    // 1. Cargar los eventos existentes para control de duplicados
    const { events: currentEvents, sha: fileSha } = await getEvents(githubToken);

    // 2. Determinar la ubicación de búsqueda
    let selectedGroup = FEEDS_EVENTOS[0];
    if (location && typeof location === "string") {
      const matchedGroup = FEEDS_EVENTOS.find(
        (f) => f.location.toLowerCase() === location.toLowerCase()
      );
      if (matchedGroup) {
        selectedGroup = matchedGroup;
      } else {
        // Fallback o selección aleatoria
        selectedGroup = FEEDS_EVENTOS[Math.floor(Math.random() * FEEDS_EVENTOS.length)];
      }
    } else {
      // Selección aleatoria si no se especifica
      selectedGroup = FEEDS_EVENTOS[Math.floor(Math.random() * FEEDS_EVENTOS.length)];
    }

    // 3. Buscar noticias frescas en los feeds correspondientes a la ubicación elegida
    let rssItems: Array<{ title: string; description: string; link: string }> = [];
    let selectedFeedUrl = "";
    let availableItem: { title: string; description: string; link: string } | null = null;

    // Desordenar feeds para aleatoriedad
    const shuffledUrls = [...selectedGroup.urls].sort(() => 0.5 - Math.random());

    for (const url of shuffledUrls) {
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
        if (response.ok) {
          const xmlText = await response.text();
          const items = parseRssXml(xmlText);

          if (items.length > 0) {
            // Filtrar estrictamente duplicados
            const nonDuplicate = items.find((item) => {
              const cleanNew = item.title.toLowerCase().substring(0, 15);
              const isDuplicated = currentEvents.some((c) => {
                const existingTitle = c.title.toLowerCase();
                return existingTitle.includes(cleanNew) || cleanNew.includes(existingTitle.substring(0, 15));
              });
              return !isDuplicated;
            });

            if (nonDuplicate) {
              rssItems = items;
              availableItem = nonDuplicate;
              selectedFeedUrl = url;
              break;
            }
          }
        }
      } catch (err) {
        console.warn(`Error leyendo feed: ${url}, intentando otro...`);
      }
    }

    // Fallback por si fallan todos los feeds o están repetidos (creamos una plantilla de evento premium)
    if (!availableItem) {
      if (selectedGroup.location === "Cali") {
        availableItem = {
          title: "Temporada de Teatro de Cali y Artes Vivas del Valle",
          description: "La escena local caleña presenta una cartelera especial con directores locales, obras clásicas adaptadas e instalaciones multisensoriales en el Teatro Municipal.",
          link: "https://www.cali.gov.co/cultura/"
        };
      } else if (selectedGroup.location === "Medellín") {
        availableItem = {
          title: "Festival Internacional de Cine y Teatro de Medellín",
          description: "Medellín se viste de arte con proyecciones independientes y artes escénicas en las calles y teatros de la ciudad de la eterna primavera.",
          link: "https://www.medellin.gov.co/cultura"
        };
      } else if (selectedGroup.location === "Bogotá") {
        availableItem = {
          title: "Feria de las Artes Escénicas y Cine Iberoamericano en Bogotá",
          description: "La capital colombiana acoge a decenas de compañías de teatro y directores de cine en una muestra cultural sin precedentes en Corferias.",
          link: "https://www.culturarecreacionydeporte.gov.co"
        };
      } else if (selectedGroup.location === "Manizales") {
        availableItem = {
          title: "Festival Internacional de Teatro de Manizales",
          description: "La ciudad de las puertas abiertas celebra la nueva edición del festival de teatro más antiguo de América con obras nacionales e internacionales.",
          link: "https://www.festivaldemanizales.com/"
        };
      } else if (selectedGroup.location === "España") {
        availableItem = {
          title: "Festival de Cine de Madrid y Muestra Estival de Teatro",
          description: "La capital madrileña se llena de cine independiente, debates con realizadores y obras de teatro contemporáneas al aire libre.",
          link: "https://www.madridcultura.es"
        };
      } else if (selectedGroup.location === "Nueva York") {
        availableItem = {
          title: "Broadway Summer Theater Festival and Film Screenings in Central Park",
          description: "Nueva York celebra el regreso de grandes directores a los teatros independientes y proyecciones de películas al aire libre con música en vivo.",
          link: "https://www.nycgo.com"
        };
      } else if (selectedGroup.location === "Atlanta") {
        availableItem = {
          title: "Atlanta Independent Cinema Showcase and Theater Arts Gala",
          description: "Un encuentro del cine sureño e independiente que reúne largometrajes, documentales sociales y muestras teatrales en Atlanta.",
          link: "https://www.atlanta.net"
        };
      } else {
        availableItem = {
          title: "Encuentro Internacional de Cine Documental y Teatro Social",
          description: "Muestra de artes escénicas y piezas de cine que exploran el impacto ambiental, la resiliencia y el cambio cultural.",
          link: "https://matrixproducciones.com"
        };
      }
      selectedFeedUrl = "Fallback Especial de la Red";
    }

    // 4. Redactar el evento y reestructurarlo con Groq
    const systemPrompt = `Eres un cronista cultural, periodista y redactor de "Matrix Producciones".
Tu tarea es tomar la siguiente noticia o evento real de actualidad y reescribirla en español en forma de un evento cultural sumamente inspirador, vibrante y atractivo en español para nuestra cartelera.
El ámbito/ubicación del evento es estrictamente: "${selectedGroup.location}".

Título de origen: "${availableItem.title}"
Resumen de origen: "${availableItem.description}"
Enlace de origen: "${availableItem.link}"

Debes devolver ÚNICAMENTE un objeto JSON válido con los campos exactos descritos a continuación (no añadas explicaciones fuera del JSON):
{
  "title": "Un título conciso, elegante e inspirador en español (no el mismo de la fuente, sé creativo)",
  "location": "Lugar específico de realización y ciudad (ej. 'Bulevar del Río, Cali' o 'Teatro Español, Madrid' o 'Broadway Theater District, Nueva York')",
  "date": "Fecha del evento amigable (ej. '18 de Octubre, 2026' o deduce una realista o colócala a 1 mes en el futuro)",
  "tag": "Elige estrictamente una de estas tres opciones: 'Cine' o 'Teatro' o 'Cultural'",
  "excerpt": "Un resumen corto y atrapante de 2 líneas sobre el evento cultural para el catálogo",
  "description": "Una reseña o noticia completa e inspiradora (de 3 párrafos en español). Explica qué se vivirá allí, importancia cultural, actividades destacadas. Puedes usar formato markdown básico (subtítulos ### o listas con asteriscos *) para estructurarla bellamente.",
  "image": "URL de imagen realista de Unsplash relacionada con cine, teatro, cámaras o arte según corresponda (ej. https://images.unsplash.com/photo-...)"
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
    const generatedEvent = JSON.parse(groqData.choices[0].message.content);

    // Añadir el campo categoryLocation exacto y enlaces
    generatedEvent.categoryLocation = selectedGroup.location;
    generatedEvent.gallery = [];
    generatedEvent.link = availableItem.link || ""; // Enlace real de origen de la noticia o evento

    // Prepend a los eventos y guardar
    currentEvents.unshift(generatedEvent);

    // Limitar tamaño
    let updatedEvents = currentEvents;
    if (updatedEvents.length > 50) {
      updatedEvents = updatedEvents.slice(0, 50);
    }

    const saveSuccess = await saveEvents(updatedEvents, fileSha, githubToken, generatedEvent.title);

    if (!saveSuccess) {
      return NextResponse.json(
        { error: "Error al guardar el evento en el repositorio, pero se guardó localmente.", event: generatedEvent },
        { status: 502 }
      );
    }

    // Envío de Boletín Automático a Suscriptores mediante Brevo REST API
    if (groqApiKey && githubToken) {
      const brevoApiKey = process.env.BREVO_API_KEY;
      if (brevoApiKey) {
        try {
          const repoOwner = "neoeliecer";
          const repoName = "matrixproduccionespagina";
          const subscribersUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/data/subscribers.json`;
          
          const getSubsResponse = await fetch(subscribersUrl, {
            headers: {
              Authorization: `token ${githubToken}`,
              Accept: "application/vnd.github.v3+json",
              "User-Agent": "NextJS-Events-Auto",
            },
            cache: "no-store",
          });

          if (getSubsResponse.ok) {
            const subsData = await getSubsResponse.json();
            const decodedSubs = Buffer.from(subsData.content, "base64").toString("utf-8");
            const allSubscribers: any[] = JSON.parse(decodedSubs);

            // Filtrar suscriptores basados en ubicación e intereses
            // Si el suscriptor es un string antiguo, asumimos interés en todo y "Todas" las ciudades.
            const targetSubscribers = allSubscribers.filter(sub => {
              if (typeof sub === "string") return true;
              
              const isInterestedInEvents = sub.interests && sub.interests.includes("Eventos");
              const matchesLocation = sub.location === "Todas" || sub.location === selectedGroup.location;
              
              return isInterestedInEvents && matchesLocation;
            });

            if (targetSubscribers.length > 0) {
              const bccEmails = targetSubscribers.map(sub => {
                return typeof sub === "string" ? { email: sub } : { email: sub.email };
              });

              // Enviar correos en copia oculta (BCC)
              const sendEmailResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
                method: "POST",
                headers: {
                  "api-key": brevoApiKey,
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
                body: JSON.stringify({
                  sender: { name: "Matrix Producciones", email: "info@matrixproducciones.com" },
                  to: [{ email: "info@matrixproducciones.com", name: "Boletín Matrix" }],
                  bcc: bccEmails,
                  subject: `🎭 Nuevo Evento en ${selectedGroup.location}: ${generatedEvent.title}`,
                  htmlContent: `
                    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #030303; border: 1px solid #1a1a1a; border-radius: 16px; overflow: hidden; color: #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                      <div style="background-color: #080808; padding: 28px; text-align: center; border-bottom: 1px solid #111111;">
                        <h1 style="color: #00ff88; font-size: 18px; text-transform: uppercase; letter-spacing: 5px; margin: 0; font-weight: bold;">Matrix Producciones</h1>
                        <span style="color: #666666; font-size: 9px; text-transform: uppercase; letter-spacing: 3px; display: block; margin-top: 5px;">Alerta de Evento Cultural</span>
                      </div>
                      <div style="padding: 32px 24px;">
                        <span style="background-color: rgba(0,255,136,0.1); border: 1px solid rgba(0,255,136,0.2); padding: 4px 12px; border-radius: 4px; font-size: 9px; font-weight: bold; text-transform: uppercase; color: #00ff88; letter-spacing: 2px; display: inline-block; margin-bottom: 16px;">📍 ${selectedGroup.location} | ${generatedEvent.tag}</span>
                        <h1 style="font-size: 22px; line-height: 1.3; font-weight: 800; margin: 0 0 16px 0; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">${generatedEvent.title}</h1>
                        <p style="font-size: 14px; color: #00ff88; font-weight: bold; margin-bottom: 16px;">🗓️ ${generatedEvent.date} | 🏛️ ${generatedEvent.location}</p>
                        <p style="font-size: 14px; color: #888888; line-height: 1.6; font-weight: 300; margin-bottom: 24px;">${generatedEvent.excerpt}</p>
                        ${generatedEvent.image ? `<img src="${generatedEvent.image}" alt="${generatedEvent.title}" style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 24px; border: 1px solid #1a1a1a;" />` : ""}
                        <div style="text-align: center; margin-top: 32px; margin-bottom: 16px;">
                          <a href="https://matrixproducciones.com/eventos" style="background-color: #00ff88; color: #000000; font-weight: bold; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; padding: 16px 32px; border-radius: 2px; text-decoration: none; display: inline-block;">Ver en Cartelera →</a>
                        </div>
                      </div>
                      <div style="background-color: #080808; padding: 20px; text-align: center; font-size: 10px; color: #444444; border-top: 1px solid #111111; line-height: 1.6;">
                        &copy; ${new Date().getFullYear()} Matrix Producciones. Todos los derechos reservados.<br />
                        Estás recibiendo este correo porque te suscribiste a las alertas de Eventos en ${selectedGroup.location} a través de matrixproducciones.com.
                      </div>
                    </div>
                  `
                })
              });

              if (sendEmailResponse.ok) {
                console.log(`Alerta de evento enviada con éxito a ${targetSubscribers.length} suscriptores de ${selectedGroup.location}.`);
              } else {
                const mailErr = await sendEmailResponse.text();
                console.error("Error enviando alerta de evento a través de Brevo:", mailErr);
              }
            }
          }
        } catch (mailError) {
          console.error("Excepción en el proceso de envío de alerta de evento:", mailError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "¡Evento cultural rastreado y publicado por IA con éxito!",
      source: {
        title: availableItem.title,
        feed: selectedFeedUrl,
        location: selectedGroup.location
      },
      event: generatedEvent
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error interno de servidor" }, { status: 500 });
  }
}
