import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const repoOwner = "neoeliecer";
const repoName = "matrixproduccionespagina";
const filePath = "data/posts.json";
const githubApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

async function getPosts(githubToken?: string) {
  let posts: any[] = [];
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
        posts = JSON.parse(decodedContent);
        return { posts, sha };
      }
    } catch (e) {
      console.error("Error reading posts from GitHub:", e);
    }
  }

  // Fallback
  try {
    const localPath = path.join(process.cwd(), "data", "posts.json");
    if (fs.existsSync(localPath)) {
      posts = JSON.parse(fs.readFileSync(localPath, "utf-8"));
    }
  } catch (e) {
    console.error("Error reading local posts:", e);
  }

  return { posts, sha };
}

async function savePosts(posts: any[], sha?: string, githubToken?: string) {
  try {
    const localPath = path.join(process.cwd(), "data", "posts.json");
    const dir = path.dirname(localPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(localPath, JSON.stringify(posts, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing posts locally:", e);
  }

  if (githubToken) {
    try {
      const updatedContentBase64 = Buffer.from(JSON.stringify(posts, null, 2)).toString("base64");
      const putFileResponse = await fetch(githubApiUrl, {
        method: "PUT",
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "NextJS-CMS",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `🤖 AutoCMS: Posts actualizados manualmente`,
          content: updatedContentBase64,
          sha: sha || undefined,
          branch: "main",
        }),
      });
      return putFileResponse.ok;
    } catch (e) {
      console.error("Error writing posts to GitHub:", e);
    }
  }
  return true;
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const githubToken = process.env.GITHUB_TOKEN;
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    
    if (!body.password || body.password !== adminPassword) {
      return NextResponse.json({ success: false, error: "Contraseña de administrador incorrecta." }, { status: 401 });
    }
    
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Post ID is required" }, { status: 400 });
    }

    const { posts, sha } = await getPosts(githubToken);

    const index = posts.findIndex((p: any) => p.id === body.id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    // Update post fields
    posts[index] = { ...posts[index], ...body };

    const saveSuccess = await savePosts(posts, sha, githubToken);

    if (!saveSuccess) {
      return NextResponse.json({ success: false, error: "Error guardando en GitHub" }, { status: 502 });
    }

    return NextResponse.json({ success: true, data: posts[index] });
  } catch (error) {
    console.error("Error en PUT posts:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
