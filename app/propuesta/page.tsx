"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CinematicOverlay from "@/components/CinematicOverlay";
import { useState } from "react";

export default function Propuesta() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [projectType, setProjectType] = useState("documental");
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
          subject: `💡 Nueva Propuesta de Proyecto: ${name}`,
          from_name: "Web Matrix Producciones",
          replyto: email,
          name: name,
          email: email,
          message: message,
          projectType: projectType === "documental" ? "Cine Documental" :
                       projectType === "campana" ? "Campaña Social" :
                       projectType === "corto" ? "Cortometraje" : "Otro Formato",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const projectTypeText = projectType === "documental" ? "Cine Documental" :
                                projectType === "campana" ? "Campaña Social" :
                                projectType === "corto" ? "Cortometraje" : "Otro Formato";

        // Guardar automáticamente en Google Sheets en segundo plano (100% gratuito)
        fetch("https://script.google.com/macros/s/AKfycbydxHe87aqsnyTqPwYMozpQlNkgYSSyPlyss9cZgwmK-LivIExFslaJXvTSinnMmM3OqQ/exec", {
          method: "POST",
          mode: "no-cors", // Evita problemas de CORS cruzados con Google
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: email,
            message: `[Proyecto: ${projectTypeText}] ${message}`,
          }),
        }).catch((err) => console.log("Error al guardar en Google Sheets:", err));

        setFormSubmitted(true);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setErrorMessage(data.error || "Ocurrió un error al enviar tu propuesta.");
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
        {/* Glow halo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center space-y-4 mb-16">
            <span className="text-accent text-xs uppercase tracking-[5px] font-bold block">
              Queremos Escuchar Tu Idea
            </span>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight text-white leading-none">
              Propuesta
            </h1>
            <p className="text-white/40 text-sm max-w-md mx-auto uppercase tracking-[3px] mt-2">
              Envíanos los detalles para co-crear tu historia
            </p>
          </div>

          {formSubmitted ? (
            <div className="border border-accent/20 bg-accent/5 p-12 text-center rounded-2xl backdrop-blur-md">
              <span className="text-5xl block mb-6">💡</span>
              <h3 className="text-2xl font-bold uppercase tracking-widest text-accent mb-4">
                ¡Propuesta Recibida!
              </h3>
              <p className="text-white/60 max-w-sm mx-auto leading-relaxed text-sm">
                Hemos recibido los detalles de tu propuesta. Nuestro equipo de creativos la analizará y se pondrá en contacto contigo pronto.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="border border-white/5 p-8 md:p-16 rounded-2xl bg-white/[0.01] backdrop-blur-xl space-y-8 shadow-2xl"
            >
              {errorMessage && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs uppercase tracking-wider text-center font-bold">
                  {errorMessage}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[3px] font-bold text-white/50">
                    Nombre o Nombre de Organización
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Fundación Planeta Verde"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-transparent border-b border-white/10 py-4 text-white text-base focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[3px] font-bold text-white/50">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Ej. contacto@organizacion.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent border-b border-white/10 py-4 text-white text-base focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <label className="text-[10px] uppercase tracking-[3px] font-bold text-white/50">
                  Tipo de Proyecto
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { id: "documental", label: "Cine Documental" },
                    { id: "campana", label: "Campaña Social" },
                    { id: "corto", label: "Cortometraje" },
                    { id: "otro", label: "Otro Formato" },
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setProjectType(type.id)}
                      className={`py-3 px-4 rounded-[2px] text-xs font-bold uppercase tracking-wider border transition-all duration-300 ${
                        projectType === type.id
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-white/10 bg-transparent text-white/50 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-[3px] font-bold text-white/50">
                  Describe tu propuesta cinematográfica o idea
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Compártenos de qué trata la historia, los personajes o el mensaje principal..."
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
                {isSubmitting ? "Enviando..." : "Enviar Propuesta"}
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
