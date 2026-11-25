// Cliente de IA compartido para todas las rutas del admin.
// Estrategia: intenta Gemini primero (cadena de modelos por si uno está saturado)
// y usa Groq como respaldo final. Si todo falla, lanza un error con el detalle
// de cada intento para poder diagnosticar qué falló exactamente.

// Cadena de modelos Gemini en orden de preferencia:
// - gemini-3.6-flash: modelo estable principal (puede devolver 503 por demanda)
// - gemini-3.5-flash-lite: respaldo rápido y confiable con salida JSON
const GEMINI_MODELS = ["gemini-3.6-flash", "gemini-3.5-flash-lite"];
const GROQ_DEFAULT_MODEL = "llama-3.1-8b-instant";
const REQUEST_TIMEOUT_MS = 45000;

export type AiProvider = "gemini" | "groq";

export interface AiResult {
  data: any;
  provider: AiProvider;
}

// Limpia respuestas que lleguen envueltas en bloques markdown antes de parsear
function parseJsonSafe(text: string): any {
  let clean = text.trim();
  const fenceMatch = clean.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) clean = fenceMatch[1].trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) clean = clean.substring(start, end + 1);
  return JSON.parse(clean);
}

async function callGemini(prompt: string, apiKey: string, model: string): Promise<any> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini (${model}) respondió ${res.status}: ${body.slice(0, 300)}`);
  }

  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error(`Gemini (${model}) no devolvió texto. Respuesta: ${JSON.stringify(json).slice(0, 300)}`);
  }
  return parseJsonSafe(text);
}

async function callGroq(prompt: string, apiKey: string, model: string): Promise<any> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "system", content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" },
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Groq (${model}) respondió ${res.status}: ${body.slice(0, 300)}`);
  }

  const json = await res.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error(`Groq no devolvió contenido. Respuesta: ${JSON.stringify(json).slice(0, 300)}`);
  }
  return parseJsonSafe(content);
}

/**
 * Genera un objeto JSON usando la IA. Intenta Gemini (varios modelos) y cae a Groq.
 * @param prompt Instrucciones completas (el modelo debe responder solo con JSON).
 * @param groqModel Modelo Groq de respaldo (por defecto llama-3.1-8b-instant).
 */
export async function generateJson(prompt: string, groqModel?: string): Promise<AiResult> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const failures: string[] = [];

  if (!geminiKey && !groqKey) {
    throw new Error("No hay clave de IA configurada (falta GEMINI_API_KEY y GROQ_API_KEY).");
  }

  if (geminiKey) {
    for (const model of GEMINI_MODELS) {
      try {
        const data = await callGemini(prompt, geminiKey, model);
        return { data, provider: "gemini" };
      } catch (e: any) {
        failures.push(e.message || String(e));
        console.error(`⚠️ Gemini (${model}) falló:`, e.message || e);
      }
    }
  } else {
    failures.push("GEMINI_API_KEY no está configurada.");
  }

  if (groqKey) {
    try {
      const data = await callGroq(prompt, groqKey, groqModel || GROQ_DEFAULT_MODEL);
      return { data, provider: "groq" };
    } catch (e: any) {
      failures.push(e.message || String(e));
      console.error("⚠️ Groq también falló:", e.message || e);
    }
  } else {
    failures.push("GROQ_API_KEY no está configurada.");
  }

  throw new Error(`No se pudo generar con IA. Detalles: ${failures.join(" | ")}`);
}
