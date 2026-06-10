import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const repoOwner = "neoeliecer";
const repoName = "matrixproduccionespagina";
const filePath = "data/galerias.json";
const githubApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

async function getGalerias(githubToken?: string) {
  let galerias: any[] = [];
  let sha = "";

  if (githubToken) {
    try {
      const response = await fetch(githubApiUrl, {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "NextJS-CMS",
        },
        cache: "no-store",
      });
      if (response.ok) {
        const fileData = await response.json();
        sha = fileData.sha;
        const decodedContent = Buffer.from(fileData.content, "base64").toString("utf-8");
        galerias = JSON.parse(decodedContent);
        return { galerias, sha };
      }
    } catch (e) {
      console.error("Error reading galerias from GitHub:", e);
    }
  }

  // Fallback
  try {
    const localPath = path.join(process.cwd(), "data", "galerias.json");
    if (fs.existsSync(localPath)) {
      galerias = JSON.parse(fs.readFileSync(localPath, "utf-8"));
    }
  } catch (e) {
    console.error("Error reading local galerias:", e);
  }

  return { galerias, sha };
}

async function saveGalerias(galerias: any[], sha?: string, githubToken?: string) {
  try {
    const localPath = path.join(process.cwd(), "data", "galerias.json");
    const dir = path.dirname(localPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(localPath, JSON.stringify(galerias, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing galerias locally (Vercel EROFS is normal):", e);
  }

  if (githubToken) {
    try {
      const updatedContentBase64 = Buffer.from(JSON.stringify(galerias, null, 2)).toString("base64");
      const putFileResponse = await fetch(githubApiUrl, {
        method: "PUT",
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "NextJS-CMS",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `🤖 AutoCMS: Nueva galería publicada`,
          content: updatedContentBase64,
          sha: sha || undefined,
          branch: "main",
        }),
      });
      return putFileResponse.ok;
    } catch (e) {
      console.error("Error writing galerias to GitHub:", e);
    }
  }
  return true;
}

export async function GET() {
  try {
    const githubToken = process.env.GITHUB_TOKEN;
    const { galerias } = await getGalerias(githubToken);
    return NextResponse.json(galerias);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const githubToken = process.env.GITHUB_TOKEN;
    
    const { galerias, sha } = await getGalerias(githubToken);

    const newGaleria = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...body,
    };

    galerias.unshift(newGaleria); // Add to the top

    const saveSuccess = await saveGalerias(galerias, sha, githubToken);

    if (!saveSuccess) {
      return NextResponse.json({ success: false, error: "Error guardando en GitHub" }, { status: 502 });
    }

    return NextResponse.json({ success: true, data: newGaleria });
  } catch (error) {
    console.error("Error en POST galerias:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
