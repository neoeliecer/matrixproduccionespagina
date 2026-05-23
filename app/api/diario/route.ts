import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { password, action, entry } = await request.json().catch(() => ({ password: "", action: "", entry: null }));

    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const githubToken = process.env.GITHUB_TOKEN;

    // 1. Control de seguridad
    if (!password || password !== adminPassword) {
      return NextResponse.json({ error: "Contraseña de administrador incorrecta." }, { status: 401 });
    }

    if (!githubToken) {
      return NextResponse.json(
        { error: "GITHUB_TOKEN no está configurada en el servidor." },
        { status: 500 }
      );
    }

    const repoOwner = "neoeliecer";
    const repoName = "matrixproduccionespagina";
    const filePath = "data/changelog.json";
    const githubApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    let currentChangelog: any[] = [];
    let fileSha = "";

    // 2. Obtener los cambios actuales desde GitHub
    try {
      const getFileResponse = await fetch(githubApiUrl, {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "NextJS-Changelog-CMS",
        },
        cache: "no-store",
      });

      if (getFileResponse.ok) {
        const fileData = await getFileResponse.json();
        fileSha = fileData.sha;
        const decodedContent = Buffer.from(fileData.content, "base64").toString("utf-8");
        currentChangelog = JSON.parse(decodedContent);
      }
    } catch (e) {
      console.error("Error leyendo changelog.json de GitHub:", e);
    }

    // Si solo queremos leer los cambios (iniciar sesión con éxito)
    if (action === "leer") {
      return NextResponse.json({
        success: true,
        changelog: currentChangelog
      });
    }

    // --- ACCIÓN: GUARDAR NUEVO REGISTRO EN EL DIARIO ---
    if (!entry || !entry.title || !entry.description) {
      return NextResponse.json({ error: "Datos del registro incompletos." }, { status: 400 });
    }

    // Obtener fecha y hora actual en español
    const now = new Date();
    
    // Ajustar a huso horario de Colombia (UTC-5)
    const optionsDate: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'America/Bogota'
    };
    
    const optionsTime: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true,
      timeZone: 'America/Bogota'
    };

    const localDate = now.toLocaleDateString("es-ES", optionsDate);
    const localTime = now.toLocaleTimeString("es-ES", optionsTime).toUpperCase();

    const newEntry = {
      date: localDate,
      time: localTime,
      title: entry.title.trim(),
      description: entry.description.trim()
    };

    currentChangelog.unshift(newEntry);

    // Limitar registros para no sobrecargar
    if (currentChangelog.length > 100) {
      currentChangelog = currentChangelog.slice(0, 100);
    }

    // Guardar de vuelta en GitHub
    const updatedContentBase64 = Buffer.from(JSON.stringify(currentChangelog, null, 2)).toString("base64");

    const putFileResponse = await fetch(githubApiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "NextJS-Changelog-CMS",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `🤖 AutoDiario: Nuevo registro de cambios: "${newEntry.title}"`,
        content: updatedContentBase64,
        sha: fileSha || undefined,
        branch: "main",
      }),
    });

    if (!putFileResponse.ok) {
      const putErr = await putFileResponse.text();
      return NextResponse.json(
        { error: `Error guardando en GitHub: ${putErr}` },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "¡Registro añadido al diario de cambios con éxito!",
      entry: newEntry,
      changelog: currentChangelog
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}
