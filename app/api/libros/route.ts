import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const librosDir = path.join(process.cwd(), "public", "libros");
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(librosDir)) {
      fs.mkdirSync(librosDir, { recursive: true });
      return NextResponse.json([]);
    }

    const files = fs.readdirSync(librosDir);
    const books = files
      .filter((file) => {
        const stat = fs.statSync(path.join(librosDir, file));
        return stat.isFile() && file.toLowerCase().endsWith(".pdf");
      })
      .map((file) => {
        const cleanName = file
          .replace(/\+/g, " ")
          .replace(/_/g, " ")
          .replace(/\.pdf$/i, "");
        
        let title = cleanName;
        let author = "Biblioteca Matrix";

        if (cleanName.toLowerCase().includes(" by ")) {
          const parts = cleanName.split(/\s+by\s+/i);
          title = parts[0].trim();
          author = parts[1].trim();
        }

        // Format to match LibraryItem interface
        return {
          id: `book-${file.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`,
          type: "libro",
          title: title,
          excerpt: `Recurso bibliográfico en formato PDF para lectura y descarga: "${title}".`,
          icon: "📚",
          duration: "Libro PDF",
          author: author,
          actionText: "Descargar Libro ➔",
          downloadUrl: `/libros/${file}`,
          isDownload: true
        };
      });

    return NextResponse.json(books);
  } catch (error) {
    console.error("Error loading dynamic books:", error);
    return NextResponse.json([]);
  }
}
