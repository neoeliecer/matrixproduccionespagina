import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password, recommendation } = await request.json().catch(() => ({ password: "", recommendation: null }));

    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const githubToken = process.env.GITHUB_TOKEN;

    // 1. Control de seguridad
    if (!password || password !== adminPassword) {
      return NextResponse.json({ error: "Contraseña de administrador incorrecta." }, { status: 401 });
    }

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
