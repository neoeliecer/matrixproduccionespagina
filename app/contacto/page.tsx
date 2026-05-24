"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CinematicOverlay from "@/components/CinematicOverlay";
import { useState } from "react";

export default function Contacto() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setErrorMessage("Por favor, rellena todos los campos.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: "f14efd1f-dd72-4f49-a406-932a247f9cc5",
          subject: `✉️ Nuevo Mensaje de Contacto: ${name}`,
          from_name: "Web Matrix Producciones",
          replyto: email,
          name: name,
          email: email,
          message: message,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Guardar automáticamente en Google Sheets en segundo plano (100% gratuito)
        fetch("https://script.google.com/macros/s/AKfycbyq2-nMUEfBWHQY264hmrWVPxw2PqbwB4anBtkgUYmmA7eCGOr8BVnHmT0SgaKTqet6nQ/exec", {
          method: "POST",
          mode: "no-cors", // Evita problemas de CORS cruzados con Google
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: email,
            message: message,
          }),
        }).catch((err) => console.log("Error al guardar en Google Sheets:", err));

        setFormSubmitted(true);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setErrorMessage(data.error || "Ocurrió un error al enviar tu mensaje.");
      }
    } catch (err) {
      setErrorMessage("Error de red. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <CinematicOverlay />
      <Navbar />

      <main className="relative min-h-screen bg-[#030303] pt-32 pb-24 px-6 md:px-12 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/3 left-1/3 w-[700px] h-[350px] bg-accent/5 rounded-full blur-[110px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-4 mb-20">
            <span className="text-accent text-xs uppercase tracking-[5px] font-bold block">
              Comencemos Tu Historia
            </span>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight text-white leading-none">
              Contacto
            </h1>
            <p className="text-white/40 text-sm max-w-md mx-auto uppercase tracking-[3px] mt-2">
              Hablemos sobre tu próximo proyecto
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-12 items-start max-w-6xl mx-auto">
            {/* Info panel */}
            <div className="lg:col-span-2 bg-white/[0.01] border border-white/5 p-8 md:p-12 rounded-2xl backdrop-blur-md space-y-8">
              <h2 className="text-2xl font-extrabold uppercase tracking-wider text-white">
                Datos de Contacto
              </h2>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] uppercase tracking-[3px] font-bold text-accent">Correo Electrónico</h4>
                  <p className="text-white/70 text-sm mt-1">eliecer.asesor@gmail.com</p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-[3px] font-bold text-accent">Ubicación</h4>
                  <p className="text-white/70 text-sm mt-1">Cali, Colombia</p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-[3px] font-bold text-accent">WhatsApp</h4>
                  <a
                    href="https://wa.me/573174734070"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-accent text-sm mt-1 inline-block transition-colors"
                  >
                    +57 317 473 4070
                  </a>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <a
                  href="https://wa.me/573174734070"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-black font-extrabold text-xs uppercase tracking-[3px] py-4 rounded-[2px] transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <span>Chatea por WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Form panel */}
            <div className="lg:col-span-3">
              {formSubmitted ? (
                <div className="border border-accent/20 bg-accent/5 p-12 text-center rounded-2xl backdrop-blur-md h-full flex flex-col justify-center items-center">
                  <span className="text-5xl block mb-6">✉️</span>
                  <h3 className="text-2xl font-bold uppercase tracking-widest text-accent mb-4">
                    ¡Mensaje Enviado con Éxito!
                  </h3>
                  <p className="text-white/60 max-w-sm mx-auto leading-relaxed text-sm">
                    Gracias por comunicarte con Matrix Producciones. Responderemos a tu correo o número de contacto lo antes posible.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="border border-white/5 p-8 md:p-12 rounded-2xl bg-white/[0.01] backdrop-blur-xl space-y-8 shadow-2xl"
                >
                  {errorMessage && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs uppercase tracking-wider text-center font-bold">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-[3px] font-bold text-white/50">
                        Tu Nombre
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Juan Pérez"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-transparent border-b border-white/10 py-4 text-white text-base focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-[3px] font-bold text-white/50">
                        Tu Correo
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="Ej. juan@correo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-transparent border-b border-white/10 py-4 text-white text-base focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[3px] font-bold text-white/50">
                      Mensaje
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Cuéntanos un poco sobre tu idea..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-transparent border-b border-white/10 py-4 text-white text-base focus:outline-none focus:border-accent transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full text-black font-extrabold text-xs uppercase tracking-[4px] py-5 transition-all duration-300 shadow-[0_0_20px_var(--accent-glow)] ${
                      isSubmitting
                        ? "bg-white/10 text-white/40 cursor-not-allowed border border-white/5"
                        : "bg-accent hover:bg-[#00cc6a] hover:shadow-[0_0_30px_var(--accent)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    }`}
                  >
                    {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
