import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const repoOwner = "neoeliecer";
const repoName = "matrixproduccionespagina";

// Mapeo del tipo de contenido a su archivo JSON correspondiente
const TYPE_TO_FILE: Record<string, string> = {
  movies: "data/movies.json",
  events: "data/events.json",
  galleries: "data/galerias.json",
  posts: "data/posts.json",
  convocatorias: "data/convocatorias.json"
};

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { password, type, title } = body;

    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const githubToken = process.env.GITHUB_TOKEN;

    // 1. Verificación de Seguridad
    if (!password || password !== adminPassword) {
      return NextResponse.json({ error: "Contraseña de administrador incorrecta." }, { status: 401 });
    }

    if (!type || !TYPE_TO_FILE[type]) {
      return NextResponse.json({ error: "Tipo de contenido inválido." }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json({ error: "No se proporcionó el título a borrar." }, { status: 400 });
    }

    const filePath = TYPE_TO_FILE[type];
    const githubApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    let currentData: any[] = [];
    let fileSha = "";

    // 2. Obtener los datos actuales de GitHub
    if (githubToken) {
      try {
        const response = await fetch(githubApiUrl, {
          headers: {
            Authorization: `token ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "NextJS-Admin-Delete",
          },
          cache: "no-store",
        });
        
        if (response.ok) {
          const fileData = await response.json();
          fileSha = fileData.sha;
          const decodedContent = Buffer.from(fileData.content, "base64").toString("utf-8");
          currentData = JSON.parse(decodedContent);
        } else if (response.status !== 404) {
          console.warn("⚠️ Advertencia: No se pudo leer el archivo de GitHub, intentando lectura local.");
        }
      } catch (e) {
        console.error("Error reading data from GitHub:", e);
      }
    }

    // 3. Fallback a lectura local si falla GitHub
    if (currentData.length === 0) {
      try {
        const localPath = path.join(process.cwd(), filePath);
        if (fs.existsSync(localPath)) {
          const localContent = fs.readFileSync(localPath, "utf-8");
          currentData = JSON.parse(localContent);
        }
      } catch (e) {
        console.error("Error reading data from local filesystem:", e);
        return NextResponse.json({ error: "No se pudieron obtener los datos para borrar." }, { status: 500 });
      }
    }

    // 4. Filtrar / Borrar el elemento por su título
    const initialLength = currentData.length;
    // Eliminamos el ítem donde el título coincida exactamente (sin importar mayúsculas/minúsculas)
    currentData = currentData.filter((item: any) => {
      const itemTitle = item.title || item.titulo || item.name || "";
      return itemTitle.trim().toLowerCase() !== title.trim().toLowerCase();
    });

    if (currentData.length === initialLength) {
      return NextResponse.json({ error: "No se encontró ningún elemento con ese título." }, { status: 404 });
    }

    // 5. Guardar los cambios (Local y GitHub)
    
    // Intento local (En Vercel fallará con EROFS, lo ignoramos)
    try {
      const localPath = path.join(process.cwd(), filePath);
      const dir = path.dirname(localPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(localPath, JSON.stringify(currentData, null, 2), "utf-8");
    } catch (e) {
      console.warn("No se pudo guardar localmente (esperado en Vercel EROFS):", e);
    }
    
    // Guardar en GitHub
    try {
      if (githubToken) {
        const updatedContentBase64 = Buffer.from(JSON.stringify(currentData, null, 2)).toString("base64");
        const putFileResponse = await fetch(githubApiUrl, {
          method: "PUT",
          headers: {
            Authorization: `token ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "NextJS-Admin-Delete",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `🗑️ AutoCMS: Eliminado ${type} -> "${title}" por el administrador`,
            content: updatedContentBase64,
            sha: fileSha || undefined,
            branch: "main",
          }),
        });
        
        if (!putFileResponse.ok) {
          console.error("Error guardando en GitHub:", await putFileResponse.text());
          return NextResponse.json({ error: "Elemento borrado localmente, pero falló en GitHub." }, { status: 502 });
        }
      }
      
      return NextResponse.json({ success: true, message: `Elemento "${title}" borrado con éxito.` });
    } catch (e) {
      console.error("Error saving deleted changes to GitHub:", e);
      return NextResponse.json({ error: "Error al guardar los cambios en GitHub tras borrar." }, { status: 500 });
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}
