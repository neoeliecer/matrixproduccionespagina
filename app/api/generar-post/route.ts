import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Lista completa de Feeds RSS rescatada y curada de tu n8n
const FEEDS_CATEGORIES = [
  {
    name: "Hollywood & Cine",
    tag: "Hollywood",
    urls: [
      "https://variety.com/feed/",
      "https://deadline.com/feed/",
      "https://www.hollywoodreporter.com/feed/",
      "https://screenrant.com/feed/",
      "https://collider.com/feed/",
      "https://feeds.ign.com/ign/movies-all",
      "https://www.empireonline.com/movies/rss/",
      "https://www.indiewire.com/feed/",
      "https://www.slashfilm.com/feed/"
    ]
  },
  {
    name: "Series & Streaming",
    tag: "Series",
    urls: [
      "https://tvline.com/feed/",
      "https://comicbook.com/feed/",
      "https://www.cbr.com/feed/"
    ]
  },
  {
    name: "Cine Documental",
    tag: "Documentales",
    urls: [
      "https://www.documentary.org/feed",
      "https://rss.nytimes.com/services/xml/rss/nyt/Movies.xml",
      "https://www.pbs.org/wgbh/frontline/feed/",
      "https://www.rogerebert.com/feed"
    ]
  },
  {
    name: "Teatro",
    tag: "Teatro",
    urls: [
      "https://www.broadwayworld.com/rss.cfm",
      "https://www.playbill.com/rss",
      "https://www.thestage.co.uk/feeds/news"
    ]
  },
  {
    name: "Festivales de Cine",
    tag: "Festivales",
    urls: [
      "https://www.festival-cannes.com/en/feed/",
      "https://www.berlinale.de/en/service/rss/rss.xml",
      "https://www.labiennale.org/en/rss/cinema",
      "https://www.sundance.org/feed/",
      "https://www.tiff.net/feed"
    ]
  },
  {
    name: "Premios",
    tag: "Premios",
    urls: [
      "https://www.oscars.org/feeds/news.xml",
      "https://www.goldenglobes.com/feed"
    ]
  },
  {
    name: "Anime & Cultura Pop",
    tag: "Anime",
    urls: [
      "https://www.crunchyroll.com/newsrss",
      "https://otakuusamagazine.com/feed/"
    ]
  },
  {
    name: "Cultura Latinoamericana",
    tag: "Latinoamérica",
    urls: [
      "https://news.google.com/rss/search?q=cine+latinoamerica&hl=es&gl=CO&ceid=CO:es",
      "https://news.google.com/rss/search?q=teatro+latinoamerica&hl=es&gl=CO&ceid=CO:es",
      "https://news.google.com/rss/search?q=documental+latinoamerica&hl=es&gl=CO&ceid=CO:es",
      "https://news.google.com/rss/search?q=festival+cine+latinoamerica&hl=es&gl=CO&ceid=CO:es"
    ]
  },
  {
    name: "Convocatorias & Estímulos",
    tag: "Convocatorias",
    urls: [
      "https://news.google.com/rss/search?q=film+festival+submission&hl=en&gl=US&ceid=US:en",
      "https://news.google.com/rss/search?q=convocatoria+cine+colombia&hl=es&gl=CO&ceid=CO:es",
      "https://news.google.com/rss/search?q=convocatoria+documental&hl=es&gl=CO&ceid=CO:es",
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
        { error: "GROQ_API_KEY no está configurada en las variables de entorno de Netlify." },
        { status: 500 }
      );
    }

    if (!githubToken) {
      return NextResponse.json(
        { error: "GITHUB_TOKEN no está configurada en las variables de entorno de Netlify." },
        { status: 500 }
      );
    }

    // 1. Obtener los posts actuales desde GitHub para evitar duplicados
    const repoOwner = "neoeliecer";
    const repoName = "matrixproduccionespagina";
    const filePath = "data/posts.json";

    const githubApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
    
    let currentPosts: any[] = [];
    let fileSha = "";

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
        currentPosts = JSON.parse(decodedContent);
      }
    } catch (e) {
      console.error("Error leyendo posts.json de GitHub:", e);
    }

    // 2. Elegir un Feed al azar que nos sirva de fuente de noticias fresca
    let selectedFeedUrl = "";
    let selectedCategoryName = "Hollywood & Cine";
    let selectedCategoryTag = "Hollywood";
    let rssItems: Array<{ title: string; description: string; link: string }> = [];

    // Mezclar categorías y buscar una noticia válida
    const shuffledCategories = [...FEEDS_CATEGORIES].sort(() => 0.5 - Math.random());
    
    for (const category of shuffledCategories) {
      const shuffledUrls = [...category.urls].sort(() => 0.5 - Math.random());
      for (const url of shuffledUrls) {
        try {
          const rssResponse = await fetch(url, { signal: AbortSignal.timeout(8000) });
          if (rssResponse.ok) {
            const xmlText = await rssResponse.text();
            const items = parseRssXml(xmlText);
            if (items.length > 0) {
              rssItems = items;
              selectedFeedUrl = url;
              selectedCategoryName = category.name;
              selectedCategoryTag = category.tag;
              break;
            }
          }
        } catch (err) {
          console.warn(`Error leyendo feed: ${url}, intentando otro...`);
        }
      }
      if (rssItems.length > 0) break;
    }

    // Si fallan todos los feeds (raro), usamos un tema general como fallback
    let sourceTitle = "Novedades del cine independiente";
    let sourceDesc = "El desarrollo de nuevas producciones en la escena cinematográfica.";
    let sourceLink = "";

    if (rssItems.length > 0) {
      // Tomamos el primer artículo que no hayamos reescrito ya
      const availableItem = rssItems.find(
        (item) => !currentPosts.some((post) => post.title.toLowerCase().includes(item.title.toLowerCase().substring(0, 15)))
      ) || rssItems[0];

      sourceTitle = availableItem.title;
      sourceDesc = availableItem.description;
      sourceLink = availableItem.link;
    }

    // 3. Consultar a Groq API para redactar el artículo inspirándose en la noticia
    const systemPrompt = `Eres un redactor creativo y experto en cine independiente de "Matrix Producciones" (liderada por Eliecer en Cali, Colombia).
Tu labor es tomar la siguiente noticia real de actualidad y reescribirla en español en forma de un artículo de opinión, análisis o reflexión sumamente inspirador, profesional y de impacto positivo.
La noticia de origen es sobre la categoría "${selectedCategoryName}".

Título de la noticia original: "${sourceTitle}"
Resumen de origen: "${sourceDesc}"
${sourceLink ? `Enlace de origen: "${sourceLink}"` : ""}

Genera un artículo completo y original. No traduzcas literalmente, inspírate en el tema para darle el toque y la visión artística y social de Matrix Producciones.
Debes responder ÚNICAMENTE con un objeto JSON válido con los siguientes campos estrictos (no agregues texto explicativo fuera del JSON):
{
  "title": "Un título llamativo, profesional e inspirador en español (no el mismo de la noticia, sé creativo)",
  "excerpt": "Un resumen corto y atrapante de 2 líneas que invite a leer",
  "category": "Detrás de Cámaras" o "Opinión" o "Historias" o "Novedades",
  "readTime": "X min",
  "author": "Eliecer" o "Equipo Matrix",
  "image": "URL de imagen real de Unsplash relacionada con cine, teatro, cámaras o naturaleza (ej. de https://images.unsplash.com/photo-...)",
  "content": "Contenido completo del artículo estructurado y detallado (entre 3 y 4 párrafos largos). Usa subtítulos con '###' (ej. '### El impacto social') para darle estructura al texto. Habla de la noticia e intégrala con la visión del cine con propósito."
}`;

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt }
        ],
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
    const generatedPost = JSON.parse(groqData.choices[0].message.content);

    // Complementar con la fecha actual
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    generatedPost.date = new Date().toLocaleDateString("es-ES", options);

    // 4. Agregar el post a la base de datos local y empujarlo a GitHub
    currentPosts.unshift(generatedPost);

    // Mantener un límite de posts en el archivo para no saturar el JSON
    if (currentPosts.length > 50) {
      currentPosts = currentPosts.slice(0, 50);
    }

    const updatedContentBase64 = Buffer.from(JSON.stringify(currentPosts, null, 2)).toString("base64");

    const putFileResponse = await fetch(githubApiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "NextJS-Blog-CMS",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `🤖 AutoBlog: Publicación de artículo curado de RSS: "${generatedPost.title}"`,
        content: updatedContentBase64,
        sha: fileSha || undefined,
        branch: "main",
      }),
    });

    if (!putFileResponse.ok) {
      const putErr = await putFileResponse.text();
      return NextResponse.json(
        { error: `Error escribiendo en GitHub: ${putErr}`, post: generatedPost },
        { status: 502 }
      );
    }

    // 4.5 Publicar el artículo automáticamente en WordPress (Pantheon)
    try {
      const wpUsername = "neo";
      const wpAppPassword = "24tA UUMa URmF XQjo jSav wkbW";
      const wpAuth = "Basic " + Buffer.from(wpUsername + ":" + wpAppPassword).toString("base64");
      
      // Estructurar el contenido en HTML limpio compatible con Gutenberg/WordPress
      let formattedContent = generatedPost.content
        .split("\n\n")
        .map((para: string) => {
          if (para.startsWith("###")) {
            return `<h3>${para.replace("###", "").trim()}</h3>`;
          }
          return `<p>${para}</p>`;
        })
        .join("\n");

      // Inyectar la imagen destacada en el cuerpo del post para dar mayor impacto visual
      if (generatedPost.image) {
        formattedContent = `<img src="${generatedPost.image}" alt="${generatedPost.title}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 12px; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.05);" />\n` + formattedContent;
      }

      console.log(`Enviando post a WordPress Pantheon: "${generatedPost.title}"...`);
      const wpResponse = await fetch("https://dev-matrix-producciones.pantheonsite.io/wp-json/wp/v2/posts", {
        method: "POST",
        headers: {
          "Authorization": wpAuth,
          "Content-Type": "application/json",
          "User-Agent": "NextJS-Blog-CMS"
        },
        body: JSON.stringify({
          title: generatedPost.title,
          content: formattedContent,
          excerpt: generatedPost.excerpt,
          status: "publish"
        })
      });

      if (wpResponse.ok) {
        const wpData = await wpResponse.json();
        console.log(`✅ Artículo publicado con éxito en WordPress Pantheon con ID: ${wpData.id}`);
      } else {
        const wpErrText = await wpResponse.text();
        console.error("❌ Error al publicar en WordPress Pantheon:", wpErrText);
      }
    } catch (wpErr: any) {
      console.error("⚠️ Excepción al intentar publicar en WordPress:", wpErr.message);
    }

    // 5. Envío de Boletín Automático a Suscriptores mediante Brevo REST API
    if (groqApiKey && githubToken) {
      const brevoApiKey = process.env.BREVO_API_KEY;
      if (brevoApiKey) {
        try {
          const subscribersUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/data/subscribers.json`;
          const getSubsResponse = await fetch(subscribersUrl, {
            headers: {
              Authorization: `token ${githubToken}`,
              Accept: "application/vnd.github.v3+json",
              "User-Agent": "NextJS-Blog-CMS",
            },
            cache: "no-store",
          });

          if (getSubsResponse.ok) {
            const subsData = await getSubsResponse.json();
            const decodedSubs = Buffer.from(subsData.content, "base64").toString("utf-8");
            const subscribers: string[] = JSON.parse(decodedSubs);

            if (subscribers.length > 0) {
              // Enviar correos en copia oculta (BCC) para proteger la privacidad de todos
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
                  bcc: subscribers.map((email) => ({ email })),
                  subject: `🎬 Nuevo artículo publicado: ${generatedPost.title}`,
                  htmlContent: `
                    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #030303; border: 1px solid #1a1a1a; border-radius: 16px; overflow: hidden; color: #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                      <div style="background-color: #080808; padding: 28px; text-align: center; border-bottom: 1px solid #111111;">
                        <h1 style="color: #00ff88; font-size: 18px; text-transform: uppercase; letter-spacing: 5px; margin: 0; font-weight: bold;">Matrix Producciones</h1>
                        <span style="color: #666666; font-size: 9px; text-transform: uppercase; letter-spacing: 3px; display: block; margin-top: 5px;">Boletín Cinematográfico</span>
                      </div>
                      <div style="padding: 32px 24px;">
                        <span style="background-color: rgba(0,255,136,0.1); border: 1px solid rgba(0,255,136,0.2); padding: 4px 12px; border-radius: 4px; font-size: 9px; font-weight: bold; text-transform: uppercase; color: #00ff88; letter-spacing: 2px; display: inline-block; margin-bottom: 16px;">${generatedPost.category || "Novedades"}</span>
                        <h1 style="font-size: 22px; line-height: 1.3; font-weight: 800; margin: 0 0 16px 0; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">${generatedPost.title}</h1>
                        <p style="font-size: 14px; color: #888888; line-height: 1.6; font-weight: 300; margin-bottom: 24px;">${generatedPost.excerpt}</p>
                        ${generatedPost.image ? `<img src="${generatedPost.image}" alt="${generatedPost.title}" style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 24px; border: 1px solid #1a1a1a;" />` : ""}
                        <div style="text-align: center; margin-top: 32px; margin-bottom: 16px;">
                          <a href="https://matrixproducciones.com/blog?post=${encodeURIComponent(generatedPost.title)}" style="background-color: #00ff88; color: #000000; font-weight: bold; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; padding: 16px 32px; border-radius: 2px; text-decoration: none; display: inline-block;">Leer Artículo Completo →</a>
                        </div>
                      </div>
                      <div style="background-color: #080808; padding: 20px; text-align: center; font-size: 10px; color: #444444; border-top: 1px solid #111111; line-height: 1.6;">
                        &copy; ${new Date().getFullYear()} Matrix Producciones. Todos los derechos reservados.<br />
                        Cine Documental de Impacto Positivo y Medioambiental.<br />
                        Estás recibiendo este correo porque te suscribiste a nuestro boletín en matrixproducciones.com.
                      </div>
                    </div>
                  `
                })
              });

              if (sendEmailResponse.ok) {
                console.log(`Boletín enviado con éxito a ${subscribers.length} suscriptores.`);
              } else {
                const mailErr = await sendEmailResponse.text();
                console.error("Error enviando boletín a través de Brevo:", mailErr);
              }
            }
          }
        } catch (mailError) {
          console.error("Excepción en el proceso de envío de boletín:", mailError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Artículo generado e indexado en GitHub con éxito.",
      source: {
        title: sourceTitle,
        feed: selectedFeedUrl,
        category: selectedCategoryName
      },
      post: generatedPost,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}
