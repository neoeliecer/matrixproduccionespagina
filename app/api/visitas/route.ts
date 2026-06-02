import { NextResponse } from "next/server";

const NAMESPACE = "matrixproducciones";
const KEY = "visitas";
const COUNTER_API_URL = `https://api.counterapi.dev/v1/${NAMESPACE}/${KEY}`;

// Fallback count in case the external API is offline
const FALLBACK_BASE = 1520;

// Helper to fetch with timeout to prevent hanging the serverless function
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 4000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function GET() {
  try {
    const response = await fetchWithTimeout(COUNTER_API_URL, { cache: "no-store" }, 3000);
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({ count: data.value });
    }
  } catch (error) {
    console.error("⚠️ Error leyendo visitas de CounterAPI, usando fallback:", error);
  }
  
  return NextResponse.json({ count: FALLBACK_BASE });
}

export async function POST(request: Request) {
  let count = FALLBACK_BASE + 1;

  try {
    const response = await fetchWithTimeout(`${COUNTER_API_URL}/increment`, { method: "GET", cache: "no-store" }, 3000);
    if (response.ok) {
      const data = await response.json();
      count = data.value;
    }
  } catch (error) {
    console.error("⚠️ Error incrementando visitas en CounterAPI, usando fallback:", error);
  }

  // Capturar cabeceras de red para armar el informe de visita
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "Desconocida";
  const userAgent = request.headers.get("user-agent") || "Desconocido";
  const referer = request.headers.get("referer") || "Directo";
  const language = request.headers.get("accept-language")?.split(",")[0] || "Desconocido";

  // Enviar el informe por correo mediante Brevo (sin bloquear la respuesta de la API)
  enviarNotificacionVisita(count, { ip, userAgent, referer, language }).catch(err => {
    console.error("❌ Error enviando informe de visita:", err);
  });

  return NextResponse.json({ count });
}

// Auxiliar para parsear de forma amigable el User-Agent
function parseUserAgent(ua: string) {
  if (ua.includes("Mobile") || ua.includes("Android") || ua.includes("iPhone")) {
    let device = "Móvil";
    if (ua.includes("iPhone")) device = "iPhone";
    else if (ua.includes("Android")) device = "Android";
    
    if (ua.includes("Chrome")) return `${device} (Chrome)`;
    if (ua.includes("Safari")) return `${device} (Safari)`;
    if (ua.includes("Firefox")) return `${device} (Firefox)`;
    return `${device} (Navegador Móvil)`;
  }
  
  let os = "Escritorio (PC)";
  if (ua.includes("Windows")) os = "Windows PC";
  else if (ua.includes("Macintosh")) os = "Mac PC";
  else if (ua.includes("Linux")) os = "Linux PC";

  if (ua.includes("Chrome")) return `${os} (Chrome)`;
  if (ua.includes("Safari") && !ua.includes("Chrome")) return `${os} (Safari)`;
  if (ua.includes("Firefox")) return `${os} (Firefox)`;
  if (ua.includes("Edg")) return `${os} (Edge)`;
  
  return `${os} (Otro/Desconocido)`;
}

// Función auxiliar para enviar notificación de visita mediante Brevo
async function enviarNotificacionVisita(count: number, info: { ip: string; userAgent: string; referer: string; language: string }) {
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (!brevoApiKey) {
    console.warn("⚠️ Advertencia: BREVO_API_KEY no configurada.");
    return;
  }

  const cleanUA = parseUserAgent(info.userAgent);
  const now = new Date();
  const formattedDate = now.toLocaleString("es-CO", { timeZone: "America/Bogota" }) + " (Hora Colombia)";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nueva Visita - Matrix Producciones</title>
    </head>
    <body style="background-color: #030303; color: #ffffff; font-family: sans-serif; padding: 30px 15px; margin: 0;">
      <div style="max-w: 600px; margin: 0 auto; background-color: #090909; border: 1px solid #1a1a1a; border-radius: 16px; padding: 40px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
        
        <!-- Header -->
        <div style="margin-bottom: 25px;">
          <h1 style="color: #ffffff; font-size: 20px; font-weight: 900; letter-spacing: 3px; margin: 0; text-transform: uppercase;">
            MATRIX <span style="color: #00FF88;">PRODUCCIONES</span>
          </h1>
          <p style="color: #666; font-size: 9px; letter-spacing: 2px; margin: 5px 0 0 0; text-transform: uppercase;">
            Detector de Espectadores
          </p>
        </div>

        <hr style="border: 0; border-top: 1px solid #1a1a1a; margin-bottom: 25px;">

        <span style="color: #00FF88; font-size: 9px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 10px;">
          Tráfico Web
        </span>
        <h2 style="color: #ffffff; font-size: 24px; font-weight: 900; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 1px;">
          🎬 Nuevo Espectador en Línea
        </h2>
        
        <p style="color: #a0a0a0; font-size: 14px; line-height: 1.6; font-weight: 300; margin-bottom: 25px;">
          Un visitante acaba de ingresar a la página de inicio de tu productora de cine.
        </p>

        <!-- Contador Premium -->
        <div style="background-color: #030303; border: 1px solid #00FF88; padding: 20px; border-radius: 12px; display: inline-block; margin-bottom: 25px; min-width: 250px; box-shadow: 0 0 15px rgba(0, 255, 136, 0.1);">
          <span style="color: #666; font-size: 8px; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 5px; letter-spacing: 1px;">Espectadores Totales</span>
          <span style="color: #00FF88; font-size: 24px; font-weight: 900; font-family: monospace; letter-spacing: 2px;">
            ${String(count).padStart(6, "0")}
          </span>
        </div>

        <!-- Ficha de Datos del Visitante -->
        <div style="background-color: #030303; border: 1px solid #141414; padding: 25px; border-radius: 12px; text-align: left; margin-bottom: 25px;">
          <span style="color: #666; font-size: 8px; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 15px; letter-spacing: 1px; border-bottom: 1px solid #141414; padding-bottom: 5px;">Detalles del Dispositivo & Red</span>
          
          <table style="width: 100%; font-size: 13px; color: #a0a0a0; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #666; width: 120px;">IP:</td>
              <td style="padding: 6px 0; color: #ffffff; font-family: monospace;">${info.ip}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #666;">Dispositivo:</td>
              <td style="padding: 6px 0; color: #ffffff;">${cleanUA}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #666;">Procedencia:</td>
              <td style="padding: 6px 0; color: #ffffff; overflow-wrap: anywhere;">${info.referer}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #666;">Idioma:</td>
              <td style="padding: 6px 0; color: #ffffff; text-transform: uppercase;">${info.language}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #666;">Fecha / Hora:</td>
              <td style="padding: 6px 0; color: #ffffff;">${formattedDate}</td>
            </tr>
          </table>
        </div>

        <hr style="border: 0; border-top: 1px solid #1a1a1a; margin-bottom: 25px;">

        <p style="color: #444; font-size: 10px; font-weight: 300; margin: 0;">
          Este correo fue enviado de forma automática desde el servidor de matrixproducciones.com
        </p>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": brevoApiKey,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        sender: { name: "Matrix Producciones", email: "info@matrixproducciones.com" },
        to: [{ email: "info@matrixproducciones.com", name: "Eliecer Rojas" }],
        subject: `🔔 Nueva Visita Web (#${count}) desde ${cleanUA}`,
        htmlContent: htmlContent
      })
    });

    if (response.ok) {
      console.log(`✅ Notificación de visita enviada con éxito para visitas = ${count}.`);
    } else {
      const errText = await response.text();
      console.error("❌ Error al enviar notificación de visita:", errText);
    }
  } catch (error) {
    console.error("❌ Excepción al enviar notificación de visita:", error);
  }
}
