import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { password, action, title, recommendation } = body;

    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const githubToken = process.env.GITHUB_TOKEN;
    const groqApiKey = process.env.GROQ_API_KEY;

    // 1. Control de seguridad común
    if (!password || password !== adminPassword) {
      return NextResponse.json({ error: "Contraseña de administrador incorrecta." }, { status: 401 });
    }

    // --- ACCIÓN: AUTOCOMPLETAR CON IA ---
    if (action === "autocompletar") {
      if (!title || title.trim() === "") {
        return NextResponse.json({ error: "Debes ingresar el título de la película para autocompletar." }, { status: 400 });
      }

      if (!groqApiKey) {
        return NextResponse.json({ error: "La API key de Groq no está configurada." }, { status: 500 });
      }

      const systemPrompt = `Eres un asistente experto en cine y valores humanos para "Matrix Producciones". 
Tu objetivo es analizar la película titulada "${title}" y generar un análisis de recomendación completo y profesional en español.
La película debe enfocarse en resaltar valores humanos positivos como la empatía, resiliencia, solidaridad, superación, fe, amor, etc.

Debes devolver ÚNICAMENTE un objeto JSON válido con los campos exactos descritos a continuación (no añadas explicaciones fuera del JSON):
{
  "director": "Nombre del director de la película (ej. 'Gabriele Muccino')",
  "year": "Año de estreno (ej. '2006')",
  "value": "Uno o dos valores humanos clave destacados en la película (ej. 'Resiliencia & Empatía')",
  "excerpt": "Un resumen corto y atrapante de 2 líneas sobre la película y por qué se recomienda (ej. 'La inspiradora lucha de un padre soltero por superar la pobreza y brindarle un futuro digno a su hijo, demostrando que la perseverancia puede derribar cualquier muro.')",
  "desc": "Tu crítica y veredicto profundo (de 3 a 4 párrafos en español). Explica por qué es una obra indispensable, qué emociones transmite y qué valiosa lección de vida aporta al espectador. Sé inspirador y cinematográfico. Puedes usar formato markdown básico si lo deseas.",
  "image": "Elige una URL de imagen real y hermosa de Unsplash de alta calidad que se relacione con la película o su temática (ej. si es drama/superación usa una URL de https://images.unsplash.com/ con IDs populares de naturaleza, superación, personas, siluetas al atardecer, etc.).",
  "trailerUrl": "Enlace de búsqueda directo en YouTube en español: 'https://www.youtube.com/results?search_query=trailer+espanol+' + el título de la película (remplazar espacios con +)"
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

      // Si la URL de imagen está vacía o no es válida, poner una por defecto
      if (!generatedData.image || !generatedData.image.startsWith("http")) {
        generatedData.image = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800";
      }

      return NextResponse.json({
        success: true,
        data: generatedData
      });
    }

    // --- ACCIÓN: GUARDAR RECOMENDACIÓN (POR DEFECTO) ---
    if (!recommendation || !recommendation.title || !recommendation.desc) {
      return NextResponse.json({ error: "Datos de película incompletos." }, { status: 400 });
    }

    if (!githubToken) {
      return NextResponse.json(
        { error: "GITHUB_TOKEN no está configurada en el servidor." },
        { status: 500 }
      );
    }

    const repoOwner = "neoeliecer";
    const repoName = "matrixproduccionespagina";
    const filePath = "data/recommendations.json";
    const githubApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    let currentRecommendations: any[] = [];
    let fileSha = "";

    // 2. Obtener las recomendaciones actuales desde GitHub
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
        currentRecommendations = JSON.parse(decodedContent);
      }
    } catch (e) {
      console.error("Error leyendo recommendations.json de GitHub:", e);
    }

    // 3. Evitar duplicados por título
    const isDuplicate = currentRecommendations.some(
      (item) => item.title.toLowerCase().trim() === recommendation.title.toLowerCase().trim()
    );

    if (isDuplicate) {
      return NextResponse.json({ error: "Esta película ya se encuentra recomendada en tu catálogo." }, { status: 400 });
    }

    // 4. Agregar la recomendación al inicio
    const newRecommendation = {
      title: recommendation.title.trim(),
      director: recommendation.director?.trim() || "No especificado",
      year: recommendation.year?.trim() || "No especificado",
      value: recommendation.value?.trim() || "Cine Social",
      image: recommendation.image?.trim() || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800",
      excerpt: recommendation.excerpt?.trim() || recommendation.desc.substring(0, 120) + "...",
      desc: recommendation.desc.trim(),
      trailerUrl: recommendation.trailerUrl?.trim() || "#"
    };

    currentRecommendations.unshift(newRecommendation);

    // 5. Limitar tamaño del catálogo para optimizar pre-render
    if (currentRecommendations.length > 50) {
      currentRecommendations = currentRecommendations.slice(0, 50);
    }

    // 6. Guardar de vuelta en GitHub
    const updatedContentBase64 = Buffer.from(JSON.stringify(currentRecommendations, null, 2)).toString("base64");

    const putFileResponse = await fetch(githubApiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "NextJS-Blog-CMS",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `🤖 AutoCMS: Nueva recomendación de película añadida: "${newRecommendation.title}"`,
        content: updatedContentBase64,
        sha: fileSha || undefined,
        branch: "main",
      }),
    });

    if (!putFileResponse.ok) {
      const putErr = await putFileResponse.text();
      return NextResponse.json(
        { error: `Error guardando recomendación en GitHub: ${putErr}` },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "¡Recomendación de película añadida con éxito!",
      recommendation: newRecommendation,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}
