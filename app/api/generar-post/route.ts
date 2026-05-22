import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { password } = await request.json().catch(() => ({ password: "" }));

    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const groqApiKey = process.env.GROQ_API_KEY;
    const githubToken = process.env.GITHUB_TOKEN;

    // Secure checking
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

    // 1. Query Groq API to generate the article
    const systemPrompt = `Eres un redactor creativo experto en cine documental de impacto social y medioambiental para la productora "Matrix Producciones" (liderada por Eliecer en Cali, Colombia).
Genera un artículo de blog sumamente inspirador y profesional.
Debes responder ÚNICAMENTE con un objeto JSON válido con los siguientes campos estrictos (no agregues texto fuera del JSON):
{
  "title": "Título llamativo e inspirador en español",
  "excerpt": "Un resumen corto y atrapante de 2 líneas",
  "category": "Detrás de Cámaras" o "Opinión" o "Historias" o "Novedades",
  "readTime": "X min",
  "author": "Eliecer" o "Equipo Matrix",
  "image": "URL de imagen real de Unsplash relacionada con cine, cámaras, naturaleza o Cali (ej. de https://images.unsplash.com/photo-...)",
  "content": "Contenido completo del artículo detallado (entre 3 y 4 párrafos largos). Usa subtítulos con '###' (ej. '### Detrás del lente') para estructurar el contenido."
}`;

    const userPrompt = `Genera un nuevo artículo exclusivo para el blog de Matrix Producciones. Asegúrate de que el tema sea diferente a "La Despedida" y "Mandalas". Puede hablar sobre la grabación en parajes naturales colombianos, el sonido de la naturaleza en el cine, o nuevas tecnologías de cámara lenta para capturar aves. Devuelve el JSON puro.`;

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        response_format: { type: "json_object" },
      }),
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      return NextResponse.json({ error: `Fallo al conectar con Groq: ${errText}` }, { status: 502 });
    }

    const groqData = await groqResponse.json();
    let newPost;
    try {
      newPost = JSON.parse(groqData.choices[0].message.content);
      // Inject current date
      const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
      newPost.date = new Date().toLocaleDateString("es-ES", options);
    } catch (e) {
      return NextResponse.json(
        { error: "Groq no devolvió un JSON válido.", raw: groqData.choices[0].message.content },
        { status: 502 }
      );
    }

    // 2. Fetch the current data/posts.json from GitHub
    const owner = "neoeliecer";
    const repo = "matrixproduccionespagina";
    const path = "data/posts.json";
    const githubUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    const githubGetRes = await fetch(githubUrl, {
      headers: {
        "Authorization": `token ${githubToken}`,
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Matrix-Producciones-CMS",
      },
      cache: "no-store",
    });

    if (!githubGetRes.ok) {
      return NextResponse.json(
        { error: `Fallo al leer data/posts.json de GitHub: ${await githubGetRes.text()}` },
        { status: 502 }
      );
    }

    const githubFileData = await githubGetRes.json();
    const currentSha = githubFileData.sha;
    const decodedContent = Buffer.from(githubFileData.content, "base64").toString("utf-8");
    const postsArray = JSON.parse(decodedContent);

    // 3. Append the new post
    postsArray.unshift(newPost); // Add to the beginning

    // 4. Commit updated file back to GitHub
    const updatedContentBase64 = Buffer.from(JSON.stringify(postsArray, null, 2)).toString("base64");

    const githubPutRes = await fetch(githubUrl, {
      method: "PUT",
      headers: {
        "Authorization": `token ${githubToken}`,
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "User-Agent": "Matrix-Producciones-CMS",
      },
      body: JSON.stringify({
        message: `🤖 AI Commit: Publicar nuevo artículo "${newPost.title}"`,
        content: updatedContentBase64,
        sha: currentSha,
      }),
    });

    if (!githubPutRes.ok) {
      return NextResponse.json(
        { error: `Fallo al escribir en GitHub: ${await githubPutRes.text()}` },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "¡Artículo generado y subido a GitHub con éxito!",
      post: newPost,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Ocurrió un error inesperado." }, { status: 500 });
  }
}
