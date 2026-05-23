"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CinematicOverlay from "@/components/CinematicOverlay";

export default function Catalogo() {
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
      image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800",
      videoUrl: "https://www.facebook.com/reel/2918112118361200",
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
          <div className="text-center space-y-4 mb-20">
            <span className="text-accent text-xs uppercase tracking-[5px] font-bold block">
              Nuestro Legado Visual
            </span>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight text-white leading-none">
              Catálogo
            </h1>
            <p className="text-white/40 text-sm max-w-md mx-auto uppercase tracking-[3px] mt-2">
              Historias que transforman y conectan
            </p>
          </div>

          {/* Cards Grid */}
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
        </div>
      </main>

      <Footer />
    </>
  );
}
