import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json().catch(() => ({ email: "" }));

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Por favor, ingresa un correo electrónico válido." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      return NextResponse.json(
        { error: "GITHUB_TOKEN no configurado en el servidor." },
        { status: 500 }
      );
    }

    const repoOwner = "neoeliecer";
    const repoName = "matrixproduccionespagina";
    const filePath = "data/subscribers.json";
    const githubApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    let currentSubscribers: string[] = [];
    let fileSha = "";

    // 1. Obtener la lista actual de suscriptores desde GitHub
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
        currentSubscribers = JSON.parse(decodedContent);
      }
    } catch (e) {
      console.error("Error leyendo subscribers.json de GitHub, inicializando vacío:", e);
    }

    // 2. Verificar duplicados
    if (currentSubscribers.includes(cleanEmail)) {
      return NextResponse.json({
        success: true,
        alreadySubscribed: true,
        message: "Este correo ya está registrado en nuestro boletín.",
      });
    }

    // 3. Añadir el nuevo suscriptor
    currentSubscribers.push(cleanEmail);

    // 4. Guardar la lista actualizada de vuelta en GitHub
    const updatedContentBase64 = Buffer.from(JSON.stringify(currentSubscribers, null, 2)).toString("base64");

    const putFileResponse = await fetch(githubApiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "NextJS-Blog-CMS",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `🤖 AutoNewsletter: Registro de nuevo suscriptor: ${cleanEmail}`,
        content: updatedContentBase64,
        sha: fileSha || undefined,
        branch: "main",
      }),
    });

    if (!putFileResponse.ok) {
      const putErr = await putFileResponse.text();
      return NextResponse.json(
        { error: `Error registrando suscriptor en GitHub: ${putErr}` },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "¡Te has suscrito con éxito al boletín de Matrix Producciones!",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}
