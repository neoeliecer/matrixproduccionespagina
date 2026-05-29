import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reference, amountInCents, currency } = body;

    if (!reference || !amountInCents || !currency) {
      return NextResponse.json(
        { error: "Faltan parámetros requeridos (reference, amountInCents, currency)" },
        { status: 400 }
      );
    }

    const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;

    if (!integritySecret) {
      console.warn("⚠️ WOMPI_INTEGRITY_SECRET no está configurada en las variables de entorno.");
      // En modo desarrollo, si no hay secreto, enviamos una firma vacía para alertar
      return NextResponse.json(
        { error: "Secreto de integridad no configurado en el servidor" },
        { status: 500 }
      );
    }

    // Concatenar según la fórmula oficial de Wompi:
    // <Referencia><MontoEnCentavos><Moneda><SecretoIntegridad>
    const stringToHash = `${reference}${amountInCents}${currency}${integritySecret}`;

    // Generar el hash SHA-256
    const signature = crypto
      .createHash("sha256")
      .update(stringToHash)
      .digest("hex");

    return NextResponse.json({ signature });
  } catch (error: any) {
    console.error("Error al generar firma de integridad Wompi:", error);
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}
