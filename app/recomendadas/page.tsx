"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CinematicOverlay from "@/components/CinematicOverlay";
import recommendationsData from "@/data/recommendations.json";
import { useState } from "react";

export default function Recomendadas() {
  const [films, setFilms] = useState(recommendationsData);
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const categories = ["Todos", "Documentales", "Espirituales", "Ambientales", "Biográficas", "Historia", "Autoayuda"];

  // Filtrar películas por categoría
  const filteredFilms = films.filter((film) => {
    if (selectedCategory === "Todos") return true;
    return film.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <>
      <CinematicOverlay />
      <Navbar />

      <main className="relative min-h-screen bg-[#030303] pt-32 pb-24 px-6 md:px-12 overflow-hidden">
        {/* Glow halo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header banner */}
          <div className="text-center space-y-4 mb-16">
            <span className="text-accent text-xs uppercase tracking-[5px] font-bold block">
              Cine con Propósito
            </span>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tight text-white leading-none">
              Películas Recomendadas
            </h1>
            <p className="text-white/40 text-sm max-w-lg mx-auto uppercase tracking-[3px] mt-2">
              Historias seleccionadas por sus altos valores humanos, sociales y ambientales
            </p>
          </div>

          {/* Categorías Filter Chips */}
          <div className="flex flex-wrap justify-center gap-3 mb-20 max-w-4xl mx-auto px-4">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-extrabold uppercase tracking-[2px] transition-all duration-300 border cursor-pointer ${
                  selectedCategory.toLowerCase() === category.toLowerCase()
                    ? "bg-accent border-accent text-black shadow-[0_0_20px_var(--accent-glow)]"
                    : "bg-white/[0.02] border-white/5 text-white/40 hover:text-white hover:bg-white/[0.05] hover:border-white/20"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {filteredFilms.length > 0 ? (
              filteredFilms.map((film, index) => (
                <article
                  key={index}
                  className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md hover:border-accent/30 hover:bg-white/[0.02] transition-all duration-500 flex flex-col justify-between group shadow-2xl relative"
                >
                  {/* Visual Cover */}
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-white/5">
                    <img
                      src={film.image || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800"}
                      alt={film.title}
                      className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105 group-hover:brightness-110"
                    />
                    {/* Badges for value and category */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-accent text-black font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded shadow-[0_0_15px_var(--accent-glow)]">
                        ★ {film.value}
                      </span>
                      {film.category && (
                        <span className="bg-black/80 border border-white/10 text-white font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded backdrop-blur-sm">
                          🎬 {film.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details Area */}
                  <div className="p-8 md:p-10 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-[10px] text-white/40 font-bold uppercase tracking-widest">
                        <span>Director: {film.director}</span>
                        <span>Año: {film.year}</span>
                      </div>

                      <h2 className="text-2xl md:text-3xl font-black uppercase text-white tracking-wide transition-colors group-hover:text-accent leading-tight">
                        {film.title}
                      </h2>

                      <p className="text-white/50 text-xs leading-relaxed font-light">
                        {film.excerpt}
                      </p>

                      {/* Veredicto de Matrix (Eliecer's critique) */}
                      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 md:p-6 space-y-2 mt-4 relative">
                        <span className="text-accent text-[9px] uppercase tracking-[2px] font-extrabold block">
                          Veredicto Matrix
                        </span>
                        <p className="text-white/80 text-xs leading-relaxed font-light italic">
                          "{film.desc}"
                        </p>
                      </div>
                    </div>

                    {film.trailerUrl && film.trailerUrl !== "#" ? (
                      <a
                        href={film.trailerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-white/10 hover:border-accent bg-white/5 hover:bg-accent hover:text-black font-extrabold text-[10px] uppercase tracking-[3px] py-4 rounded-[2px] w-full transition-all duration-300 text-center block cursor-pointer"
                      >
                        Ver Tráiler Oficial
                      </a>
                    ) : (
                      <span className="border border-white/5 bg-white/[0.01] text-white/20 font-extrabold text-[10px] uppercase tracking-[3px] py-4 rounded-[2px] w-full text-center block cursor-default">
                        Sin Tráiler Disponible
                      </span>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-2 text-center py-20 text-white/40 uppercase tracking-widest text-sm">
                No se encontraron películas en esta categoría.
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
