"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CinematicOverlay from "@/components/CinematicOverlay";

export default function Catalogo() {
  const [activeTab, setActiveTab] = useState<"films" | "apps">("films");

  const films = [
    {
      title: "La Despedida",
      tag: "Documental Íntimo",
      desc: "Un documental íntimo que refleja el valor de las despedidas en la vida humana, explorando las emociones profundas detrás de cada cierre y nuevo ciclo.",
      duration: "45 min",
      year: "2025",
      image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800",
      videoUrl: "#",
    },
    {
      title: "Mandalas",
      tag: "Sanación & Arte",
      desc: "Una mirada profunda al arte de los mandalas en Cali como herramienta de sanación espiritual, paz interior y transformación personal.",
      duration: "30 min",
      year: "2024",
      image: "/img/mandalas-cover.jpg",
      videoUrl: "https://www.facebook.com/reel/2918112118361200",
    },
  ];

  const apps = [
    {
      title: "BioRed Cali Orgánica",
      tag: "Eco & Consumo Local",
      desc: "Conecta y promueve la red de mercados orgánicos y ecológicos locales en Cali, fomentando una alimentación saludable.",
      packageName: "app.prog.bioredcaliorganica",
      icon: "🌱",
    },
    {
      title: "Bosques Urbanos Cali",
      tag: "Medio Ambiente",
      desc: "Explora los bosques urbanos de Cali, localiza áreas verdes protegidas y conéctate con proyectos ecológicos locales.",
      packageName: "app.prog.bosquesurbanoscali",
      icon: "🌳",
    },
    {
      title: "Teatros Cali",
      tag: "Arte & Cultura",
      desc: "Guía interactiva completa sobre los teatros emblemáticos de Cali, ubicaciones geográficas y acceso a eventos culturales.",
      packageName: "app.prog.teatroscali",
      icon: "🎭",
    },
    {
      title: "Mi Bolso",
      tag: "Finanzas Personales",
      desc: "Herramienta intuitiva para el control de gastos cotidianos, presupuestos por categorías y bolsillos digitales de ahorro.",
      packageName: "app.prog.mibolso",
      icon: "👛",
    },
    {
      title: "Nametrix",
      tag: "Productividad",
      desc: "Generador inteligente de nombres artísticos, marcas y conceptos de proyectos creativos y producciones cinematográficas.",
      packageName: "app.prog.nametrix",
      icon: "✨",
    },
    {
      title: "Numerología de Vida",
      tag: "Espiritualidad & Guía",
      desc: "Calcula tus números personales clave, tu misión espiritual y descubre las energías que rigen tu camino existencial.",
      packageName: "app.ejemp.numerologiadevida",
      icon: "🔢",
    },
    {
      title: "Pensamientos Napoleon Hill",
      tag: "Crecimiento Personal",
      desc: "Colección diaria de lecciones de éxito, superación, mentalidad ganadora y liderazgo basadas en Napoleon Hill.",
      packageName: "app.prog.pensamientosnapoleonhill",
      icon: "🧠",
    },
    {
      title: "María Barbarán App",
      tag: "Liderazgo Social",
      desc: "Aplicación oficial personalizada enfocada en el desarrollo de liderazgo femenino, resiliencia y empoderamiento.",
      packageName: "com.mariabarbaran.maria_barbaran_app",
      icon: "👩",
    },
  ];

  return (
    <>
      <CinematicOverlay />
      <Navbar />

      <main className="relative min-h-screen bg-[#030303] pt-32 pb-24 px-6 md:px-12 overflow-hidden">
        {/* Glowing background halo */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-4 mb-16">
            <span className="text-accent text-xs uppercase tracking-[5px] font-bold block">
              Nuestro Legado Multidisciplinar
            </span>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight text-white leading-none">
              Catálogo
            </h1>
            <p className="text-white/40 text-sm max-w-md mx-auto uppercase tracking-[3px] mt-2">
              Historias y soluciones tecnológicas de vanguardia
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center gap-6 mb-16">
            <button
              onClick={() => setActiveTab("films")}
              className={`flex items-center gap-3 font-extrabold text-xs uppercase tracking-[3px] px-6 py-4 border rounded-[2px] transition-all duration-300 cursor-pointer ${
                activeTab === "films"
                  ? "border-accent bg-accent/10 text-accent shadow-[0_0_20px_var(--accent-glow)]"
                  : "border-white/10 bg-white/[0.01] text-white/50 hover:border-white/30 hover:text-white"
              }`}
            >
              🎥 Cine & Documentales ({films.length})
            </button>
            <button
              onClick={() => setActiveTab("apps")}
              className={`flex items-center gap-3 font-extrabold text-xs uppercase tracking-[3px] px-6 py-4 border rounded-[2px] transition-all duration-300 cursor-pointer ${
                activeTab === "apps"
                  ? "border-accent bg-accent/10 text-accent shadow-[0_0_20px_var(--accent-glow)]"
                  : "border-white/10 bg-white/[0.01] text-white/50 hover:border-white/30 hover:text-white"
              }`}
            >
              📱 Aplicaciones Android ({apps.length})
            </button>
          </div>

          {activeTab === "films" ? (
            /* Films Grid */
            <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
              {films.map((film, index) => (
                <article
                  key={index}
                  className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md hover:border-accent/30 hover:bg-white/[0.03] transition-all duration-500 flex flex-col justify-between group shadow-2xl"
                >
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-white/5">
                    <img
                      src={film.image}
                      alt={film.title}
                      className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105 group-hover:brightness-110"
                    />
                    {/* Decorative film details overlay */}
                    <div className="absolute top-4 left-4 bg-black/80 border border-white/10 px-3 py-1 rounded text-[9px] uppercase font-bold tracking-widest text-accent">
                      {film.tag}
                    </div>
                  </div>

                  <div className="p-8 md:p-10 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-xs text-white/40 font-bold uppercase tracking-widest">
                        <span>Año: {film.year}</span>
                        <span>Duración: {film.duration}</span>
                      </div>
                      <h2 className="text-3xl font-extrabold uppercase text-white tracking-wide transition-colors group-hover:text-accent">
                        {film.title}
                      </h2>
                      <p className="text-white/60 text-sm leading-relaxed font-light">
                        {film.desc}
                      </p>
                    </div>

                    <a
                      href={film.videoUrl}
                      target={film.videoUrl !== "#" ? "_blank" : undefined}
                      rel={film.videoUrl !== "#" ? "noopener noreferrer" : undefined}
                      className="border border-white/10 hover:border-accent bg-white/5 hover:bg-accent hover:text-black font-extrabold text-[10px] uppercase tracking-[3px] py-4 rounded-[2px] w-full transition-all duration-300 text-center block"
                    >
                      Ver Trailer
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* Apps Grid */
            <div className="space-y-12">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {apps.map((app, index) => (
                  <article
                    key={index}
                    className="bg-white/[0.01] border border-white/5 p-8 rounded-2xl backdrop-blur-md hover:border-accent/30 hover:bg-white/[0.02] transition-all duration-500 flex flex-col justify-between group shadow-2xl relative"
                  >
                    <div className="space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="w-14 h-14 rounded-2xl bg-accent/5 border border-accent/10 flex items-center justify-center text-2xl transition-transform duration-500 group-hover:scale-110 group-hover:bg-accent/10 group-hover:border-accent/20 group-hover:shadow-[0_0_15px_var(--accent-glow)]">
                          {app.icon}
                        </div>
                        <span className="bg-white/5 border border-white/5 px-3 py-1 rounded text-[8px] uppercase font-bold tracking-widest text-white/50 group-hover:text-accent group-hover:border-accent/10 transition-colors">
                          {app.tag}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-extrabold uppercase text-white tracking-wide transition-colors group-hover:text-accent">
                          {app.title}
                        </h2>
                        <p className="text-[9px] font-mono text-white/30 group-hover:text-white/40 transition-colors">
                          {app.packageName}
                        </p>
                      </div>

                      <p className="text-white/50 text-sm leading-relaxed font-light">
                        {app.desc}
                      </p>
                    </div>

                    <div className="pt-8">
                      <a
                        href={`https://play.google.com/store/apps/details?id=${app.packageName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-white/10 hover:border-accent bg-white/5 hover:bg-accent hover:text-black font-extrabold text-[9px] uppercase tracking-[3px] py-4 rounded-[2px] w-full transition-all duration-300 text-center block cursor-pointer"
                      >
                        Descargar en Google Play
                      </a>
                    </div>
                  </article>
                ))}
              </div>

              {/* General Developer Google Play Button */}
              <div className="flex justify-center pt-8">
                <a
                  href="https://play.google.com/store/apps/developer?id=Matrix+producciones"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-accent hover:bg-[#00cc6a] text-black font-extrabold text-xs uppercase tracking-[3px] px-8 py-5 rounded-[2px] transition-all duration-300 shadow-[0_0_20px_var(--accent-glow)] hover:shadow-[0_0_30px_var(--accent)] hover:-translate-y-1 active:translate-y-0 cursor-pointer"
                >
                  Ver Todo en Google Play Store
                </a>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
