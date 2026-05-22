"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CinematicOverlay from "@/components/CinematicOverlay";
import { useState } from "react";

export default function Propuesta() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [projectType, setProjectType] = useState("documental");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
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
              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[3px] font-bold text-white/50">
                    Nombre o Nombre de Organización
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Fundación Planeta Verde"
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
                  className="bg-transparent border-b border-white/10 py-4 text-white text-base focus:outline-none focus:border-accent transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-accent hover:bg-[#00cc6a] text-black font-extrabold text-xs uppercase tracking-[4px] py-5 transition-all duration-300 shadow-[0_0_20px_var(--accent-glow)] hover:shadow-[0_0_30px_var(--accent)] hover:-translate-y-0.5 active:translate-y-0"
              >
                Enviar Propuesta
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
