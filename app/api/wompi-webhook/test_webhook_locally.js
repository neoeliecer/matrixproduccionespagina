const crypto = require("crypto");
const http = require("http");

// Cargar secretos de .env.local de forma manual
const fs = require("fs");
const path = require("path");
const envPath = "c:\\Users\\neo\\Documents\\matrixproducciones\\.env.local";

let WOMPI_EVENTS_SECRET = "";
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  const matches = envContent.match(/WOMPI_EVENTS_SECRET=([^\r\n]+)/);
  if (matches) {
    WOMPI_EVENTS_SECRET = matches[1].trim();
  }
}

console.log("Secreto de Eventos cargado para la prueba:", WOMPI_EVENTS_SECRET);

if (!WOMPI_EVENTS_SECRET) {
  console.error("❌ ERROR: No se encontró WOMPI_EVENTS_SECRET en .env.local.");
  process.exit(1);
}

// 1. Simular datos del evento Wompi
const timestamp = Math.floor(Date.now() / 1000);
const eventData = {
  event: "transaction.updated",
  data: {
    transaction: {
      id: "12345-test",
      status: "APPROVED",
      customer_email: "eliecer.asesor@gmail.com",
      amount_in_cents: 1500000,
      reference: "TEST_LOCAL_PURCHASE_123"
    }
  }
};

// 2. Generar la firma digital en el orden correcto
// Wompi para webhook signature.properties suele ser: ["transaction.id", "transaction.status", "transaction.amount_in_cents"]
const transaction = eventData.data.transaction;
let message = "";
message += transaction.id;
message += transaction.status;
message += transaction.amount_in_cents;

// Concatenar timestamp y el secreto de eventos de Wompi
message += timestamp + WOMPI_EVENTS_SECRET;

// Generar hash SHA256 (Simple, no HMAC)
const checksum = crypto
  .createHash("sha256")
      .update(message)
      .digest("hex");

// Estructurar el payload final que simula lo que envía Wompi
const payload = {
  event: eventData.event,
  data: eventData.data,
  timestamp: timestamp,
  signature: {
    checksum: checksum,
    properties: [
      "transaction.id",
      "transaction.status",
      "transaction.amount_in_cents"
    ]
  }
};

console.log("Enviando webhook de simulación local...");

const bodyString = JSON.stringify(payload);

// Iniciar servidor local Next.js si no está corriendo, o asumir que está en http://localhost:3000
const req = http.request({
  hostname: "localhost",
  port: 3000,
  path: "/api/wompi-webhook",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(bodyString)
  }
}, (res) => {
  console.log("Respuesta del Webhook Local - Status:", res.statusCode);
  let data = "";
  res.on("data", (chunk) => { data += chunk; });
  res.on("end", () => {
    console.log("Respuesta del Webhook Local - Cuerpo:", data);
  });
});

req.on("error", (e) => {
  console.error("❌ ERROR: Asegúrate de que el servidor local de Next.js está corriendo en el puerto 3000.");
  console.error("Detalle:", e.message);
});

req.write(bodyString);
req.end();
