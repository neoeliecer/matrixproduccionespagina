import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { type, name, email, message, projectType } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Datos del formulario incompletos." }, { status: 400 });
    }

    // Tu clave de acceso Web3Forms (puedes configurarla en las variables de entorno de Netlify/Vercel)
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY || "f14efd1f-dd72-4f49-a406-932a247f9cc5";
    const isProposal = type === "propuesta";
    const subject = isProposal 
      ? `💡 Nueva Propuesta de Proyecto: ${name}`
      : `✉️ Nuevo Mensaje de Contacto: ${name}`;

    // Construimos la estructura de datos que procesará Web3Forms
    const payload: any = {
      access_key: accessKey,
      subject: subject,
      from_name: "Web Matrix Producciones",
      replyto: email,
      "Nombre del Cliente": name,
      "Correo de Contacto": email,
      "Tipo de Envío": isProposal ? "Propuesta de Proyecto" : "Mensaje de Contacto",
      "Mensaje / Propuesta": message,
    };

    if (isProposal && projectType) {
      payload["Tipo de Proyecto"] = projectType;
    }

    // Enviamos la petición a los servidores rápidos de Web3Forms
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return NextResponse.json(
        { error: data.message || "Error al procesar el envío en Web3Forms." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Mensaje enviado con éxito a través de Web3Forms.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}
