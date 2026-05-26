"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CinematicOverlay from "@/components/CinematicOverlay";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("all");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const heroBgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroBgRef.current) {
        const scrolled = window.scrollY;
        heroBgRef.current.style.transform = `scale(${1.1 + scrolled * 0.0005}) translateY(${scrolled * 0.08}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stats = [
    { number: "3", label: "Años De Trayectoria" },
    { number: "2", label: "Historias Filmadas" },
    { number: "100%", label: "Impacto Positivo" },
  ];

  const team = [
    {
      name: "Eliecer Rojas",
      role: "Productor & Creativo Audiovisual",
      image: "/img/equipo/eliecer.jpg",
      bio: "Apasionado por el cine y la narrativa audiovisual de transformación social y ambiental.",
    },
    {
      name: "Mileidy Ruiz",
      role: "Directora de Arte",
      image: "/img/equipo/mama.jpg",
      bio: "Directora de arte, egresada de la Escuela de Arte Arturo Michelena en Valencia, Venezuela. Aporta una visión conceptual y estética única en cada producción.",
    },
    {
      name: "Kathleen Álvarez",
      role: "Productora Audiovisual",
      image: "/img/equipo/kath.png",
      bio: "Productora audiovisual, estudiante de último semestre de la Escuela Cree. Aporta sensibilidad artística, dinamismo y rigurosidad en cada etapa del desarrollo de producción.",
    },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  return (
    <>
      <CinematicOverlay />
      <Navbar />

      <main className="relative min-h-screen bg-[#030303]">
        {/* ================= HERO SECTION ================= */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              ref={heroBgRef}
              src="/img/hero-matrix-tree.jpg"
              alt="Matrix Producciones Hero"
              className="w-full h-full object-cover brightness-[0.35] contrast-[1.15] transition-transform duration-100 ease-out"
              onError={(e) => {
                e.currentTarget.src = "/img/hero-bg.jpg";
              }}
            />
            {/* Dark vignette gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/60" />
          </div>

          <div className="relative z-10 text-center max-w-5xl px-6 flex flex-col items-center">
            {/* Pulsing visual tag */}
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-md px-6 py-2 rounded-full mb-8">
              <span className="flex h-2.5 w-2.5 rounded-full bg-accent animate-pulse shadow-[0_0_10px_var(--accent)]" />
              <span className="text-[10px] md:text-xs uppercase tracking-[3px] font-bold text-white/80">
                Cine Documental & Narrativa de Impacto
              </span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight leading-[0.9] text-white">
              Bienvenidos A <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#00cc6a] filter drop-shadow-[0_0_20px_rgba(0,255,136,0.2)]">
                Matrix Producciones
              </span>
            </h1>

            <p className="mt-8 text-sm md:text-lg uppercase tracking-[6px] text-white/50 max-w-xl font-light">
              Cine Documental de Impacto Positivo y Medioambiental
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-6">
              <Link
                href="/catalogo"
                className="bg-accent hover:bg-[#00cc6a] text-black font-extrabold text-xs uppercase tracking-[3px] px-8 py-5 rounded-[2px] transition-all duration-300 shadow-[0_0_25px_var(--accent-glow)] hover:shadow-[0_0_35px_var(--accent)] hover:-translate-y-1 active:translate-y-0"
              >
                Ver Catálogo
              </Link>
              <a
                href="#quienes-somos"
                className="border border-white/20 hover:border-white text-white font-extrabold text-xs uppercase tracking-[3px] px-8 py-5 rounded-[2px] backdrop-blur-sm transition-all duration-300 hover:bg-white/5 hover:-translate-y-1 active:translate-y-0"
              >
                Conócenos
              </a>
            </div>
          </div>

          {/* Scroll Down mouse indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
            <span className="text-[8px] tracking-[4px] uppercase text-white/40">Explorar</span>
            <div className="w-[18px] h-[30px] border-2 border-white/20 rounded-full flex justify-center p-1">
              <div className="w-[4px] h-[6px] bg-accent rounded-full animate-bounce" />
            </div>
          </div>
        </section>

        {/* ================= QUIÉNES SOMOS ================= */}
        <section id="quienes-somos" className="relative py-32 px-6 md:px-12 bg-[#080808] overflow-hidden">
          {/* Subtle neon glowing light background */}
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 max-w-xl">
              <div className="space-y-4">
                <span className="text-accent text-xs uppercase tracking-[5px] font-bold block">
                  Pasión Por El Cine
                </span>
                <h2 className="text-4xl md:text-7xl font-extrabold uppercase tracking-tight leading-[1] text-white">
                  ¿Quiénes Somos?
                </h2>
              </div>

              <p className="text-white/60 text-lg leading-relaxed font-light">
                En <strong>Matrix Producciones</strong>, no solo hacemos películas; capturamos la esencia de la vida y el pulso del planeta. Somos un equipo apasionado de narradores visuales dedicados a dar voz a historias que merecen ser contadas.
              </p>
              
              <p className="text-white/40 leading-relaxed">
                Nuestra misión es utilizar el lenguaje cinematográfico como una herramienta de transformación social y ambiental, promoviendo mensajes de esperanza y conexión con la naturaleza.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5">
                {stats.map((stat, i) => (
                  <div key={i} className="text-left group">
                    <div className="text-3xl md:text-5xl font-black text-accent drop-shadow-[0_0_15px_var(--accent-glow)] transition-all duration-300 group-hover:scale-105">
                      {stat.number}
                    </div>
                    <div className="text-[10px] md:text-xs uppercase tracking-[2px] text-white/40 mt-1 font-bold">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Glowing Interactive Image and Team Showcase */}
            <div className="flex flex-col gap-10">
              <div className="border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative group bg-gradient-to-b from-white/5 to-transparent p-1">
                <img
                  src="/img/about-team.jpg"
                  alt="Equipo Matrix Producciones"
                  className="w-full h-auto object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Dynamic customized Team Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                {team.map((member) => (
                  <div
                    key={member.name}
                    className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl backdrop-blur-md hover:border-accent/20 hover:bg-white/[0.03] transition-all duration-500 group flex gap-4"
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 shrink-0">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150";
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-white text-base tracking-wider uppercase">
                        {member.name}
                      </h4>
                      <p className="text-[10px] text-accent uppercase font-bold tracking-widest">
                        {member.role}
                      </p>
                      <p className="text-xs text-white/50 mt-2 leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= VIDEO SHOWREEL ================= */}
        <section className="relative py-32 px-6 md:px-12 bg-[#030303] overflow-hidden border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            <div className="text-center space-y-4 mb-16">
              <span className="text-accent text-xs uppercase tracking-[5px] font-bold block">
                Conoce Nuestra Visión
              </span>
              <h2 className="text-4xl md:text-7xl font-extrabold uppercase tracking-tight text-white">
                Showreel
              </h2>
            </div>

            <div className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02] shadow-2xl relative group">
              <video
                controls
                poster="/img/hero-bg.jpg"
                className="w-full h-full object-cover transition-transform duration-500"
              >
                <source src="/video/presentacion.mp4" type="video/mp4" />
                Tu navegador no soporta el tag de video.
              </video>
              {/* Decorative overlay glow on hover */}
              <div className="absolute inset-0 rounded-2xl border border-accent/0 pointer-events-none group-hover:border-accent/20 transition-all duration-500" />
            </div>
          </div>
        </section>

        {/* ================= DYNAMIC CONTACT FORM ================= */}
        <section id="contacto" className="relative py-32 px-6 md:px-12 bg-[#080808] border-t border-white/5 overflow-hidden">
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <span className="text-accent text-xs uppercase tracking-[5px] font-bold block">
                Comencemos Tu Historia
              </span>
              <h2 className="text-4xl md:text-7xl font-extrabold uppercase tracking-tight text-white">
                Contacto
              </h2>
              <p className="text-white/40 text-sm max-w-md mx-auto uppercase tracking-[3px] mt-2">
                Hablemos sobre tu próximo proyecto
              </p>
            </div>

            {formSubmitted ? (
              <div className="border border-accent/20 bg-accent/5 p-12 text-center rounded-2xl backdrop-blur-md animate-fade-in">
                <span className="text-5xl block mb-6">✉️</span>
                <h3 className="text-2xl font-bold uppercase tracking-widest text-accent mb-4">
                  ¡Mensaje Enviado con Éxito!
                </h3>
                <p className="text-white/60 max-w-sm mx-auto leading-relaxed">
                  Gracias por comunicarte con Matrix Producciones. Eliecer o un miembro del equipo te responderá muy pronto.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleContactSubmit}
                className="border border-white/5 p-8 md:p-16 rounded-2xl bg-white/[0.01] backdrop-blur-xl space-y-8 shadow-2xl relative"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[3px] font-bold text-white/50">
                      Tu Nombre
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Juan Pérez"
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
                    className="bg-transparent border-b border-white/10 py-4 text-white text-base focus:outline-none focus:border-accent transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-accent hover:bg-[#00cc6a] text-black font-extrabold text-xs uppercase tracking-[4px] py-6 transition-all duration-300 shadow-[0_0_20px_var(--accent-glow)] hover:shadow-[0_0_30px_var(--accent)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  Enviar Mensaje
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
