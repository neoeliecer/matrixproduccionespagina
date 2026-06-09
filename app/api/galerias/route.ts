import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "galerias.json");

export async function GET() {
  try {
    const fileContents = fs.readFileSync(dataFilePath, "utf8");
    return NextResponse.json(JSON.parse(fileContents));
  } catch (error) {
    console.error("Error reading galerias.json", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fileContents = fs.readFileSync(dataFilePath, "utf8");
    const galerias = JSON.parse(fileContents);

    // Provide an ID and timestamp
    const newGaleria = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...body,
    };

    galerias.push(newGaleria);
    fs.writeFileSync(dataFilePath, JSON.stringify(galerias, null, 2));

    return NextResponse.json({ success: true, data: newGaleria });
  } catch (error) {
    console.error("Error writing to galerias.json", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
