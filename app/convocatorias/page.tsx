"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CinematicOverlay from "@/components/CinematicOverlay";
import { useState } from "react";
import convocatoriasData from "@/data/convocatorias.json";

export default function Convocatorias() {
  const [searchTerm, setSearchTerm] = useState("");
  const [convocatorias, setConvocatorias] = useState(convocatoriasData);
  const [selectedConvocatoria, setSelectedConvocatoria] = useState<typeof convocatoriasData[0] | null>(null);
  const [selectedScope, setSelectedScope] = useState("Todos");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const scopes = ["Todos", "Colombia", "Internacional"];
  const categories = ["Todos", "Casting", "Becas & Estímulos", "Festivales", "Fondos de Fomento"];

  // Filter convocatorias
  const filteredConvocatorias = convocatorias.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.requirements.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesScope =
      selectedScope === "Todos" ||
      item.scope.toLowerCase() === selectedScope.toLowerCase();

    const matchesCategory =
      selectedCategory === "Todos" ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesScope && matchesCategory;
  });

  return (
    <>
      <CinematicOverlay />
      <Navbar />

      <main className="relative min-h-screen bg-[#030303] pt-32 pb-24 px-6 md:px-12 overflow-hidden">
        {/* Halo de luz de fondo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {!selectedConvocatoria ? (
            <>
              {/* Encabezado Principal */}
              <div className="text-center space-y-4 mb-16">
                <span className="text-accent text-xs uppercase tracking-[5px] font-bold block">
                  Oportunidades & Fomento
                </span>
                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight text-white leading-none">
                  Convocatorias
                </h1>
                <p className="text-white/40 text-sm max-w-lg mx-auto uppercase tracking-[3px] mt-2">
                  Encuentra estímulos, castings y fondos en Colombia y el mundo
                </p>
              </div>

              {/* Barra de búsqueda */}
              <div className="max-w-md mx-auto mb-10 relative">
                <input
                  type="text"
                  placeholder="Buscar casting, beca, entidad o requisitos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 px-6 py-4 rounded-full text-white text-sm focus:outline-none focus:border-accent transition-colors backdrop-blur-md"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-white/30 text-xs">🔍</span>
              </div>

              {/* Filtro por Ámbito Geográfico */}
              <div className="flex justify-center gap-2 mb-6 max-w-md mx-auto border-b border-white/5 pb-6">
                {scopes.map((scope, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedScope(scope)}
                    className={`px-5 py-2 text-[10px] font-bold uppercase tracking-[2px] rounded-full transition-all duration-300 ${
                      selectedScope.toLowerCase() === scope.toLowerCase()
                        ? "bg-white/10 text-accent border border-accent/30 shadow-[0_0_15px_rgba(0,255,136,0.1)]"
                        : "text-white/40 hover:text-white"
                    }`}
                  >
                    {scope}
                  </button>
                ))}
              </div>

              {/* Filtro por Categorías */}
              <div className="flex flex-wrap justify-center gap-3 mb-16 max-w-4xl mx-auto px-4">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2.5 rounded-full text-[10px] font-extrabold uppercase tracking-[2px] transition-all duration-300 border ${
                      selectedCategory.toLowerCase() === category.toLowerCase()
                        ? "bg-accent border-accent text-black shadow-[0_0_20px_var(--accent-glow)]"
                        : "bg-white/[0.02] border-white/5 text-white/40 hover:text-white hover:bg-white/[0.05] hover:border-white/20"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Rejilla de Convocatorias */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {filteredConvocatorias.length > 0 ? (
                  filteredConvocatorias.map((item, index) => (
                    <article
                      key={index}
                      className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md hover:border-accent/30 hover:bg-white/[0.02] transition-all duration-500 flex flex-col justify-between group shadow-2xl"
                    >
                      <div className="relative aspect-video overflow-hidden border-b border-white/5">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800"}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="bg-black/80 border border-white/10 px-3 py-1 rounded text-[9px] uppercase font-bold tracking-widest text-accent">
                            {item.category}
                          </span>
                          <span className="bg-white/10 border border-white/15 px-3 py-1 rounded text-[9px] uppercase font-bold tracking-widest text-white/80 backdrop-blur-sm">
                            {item.scope}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-[10px] text-white/40 font-bold uppercase tracking-wider">
                            <span>Publicado: {item.date}</span>
                            <span className="text-accent-dark flex items-center gap-1 font-extrabold">
                              ⏳ Límite: {item.deadline}
                            </span>
                          </div>
                          
                          <h2 className="text-xl font-extrabold uppercase text-white tracking-wide transition-colors group-hover:text-accent leading-tight">
                            {item.title}
                          </h2>
                          
                          <p className="text-white/50 text-xs leading-relaxed font-light line-clamp-3">
                            {item.excerpt}
                          </p>

                          {/* Requisitos resumidos */}
                          <div className="bg-white/[0.02] border border-white/5 p-3 rounded-lg text-[10px] leading-relaxed text-white/60">
                            <span className="text-accent text-[9px] uppercase font-bold block mb-1 tracking-wider">
                              Requisitos clave:
                            </span>
                            {item.requirements}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[10px] uppercase font-extrabold tracking-[2px]">
                          <span className="text-white/40 truncate max-w-[150px]">Org: {item.entity}</span>
                          <button
                            onClick={() => setSelectedConvocatoria(item)}
                            className="text-accent group-hover:text-white transition-colors cursor-pointer"
                          >
                            Ver Detalles →
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-20 text-white/40 uppercase tracking-widest text-sm">
                    No se encontraron convocatorias que coincidan con tu búsqueda.
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Modo Detalle de Convocatoria */
            <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
              <button
                onClick={() => setSelectedConvocatoria(null)}
                className="text-accent hover:text-white text-xs uppercase tracking-[3px] font-bold flex items-center gap-2 mb-6 cursor-pointer"
              >
                ← Volver a convocatorias
              </button>

              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                <img
                  src={selectedConvocatoria.image || "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800"}
                  alt={selectedConvocatoria.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 left-6 flex gap-3">
                  <span className="bg-black/80 border border-white/10 px-4 py-1.5 rounded text-xs uppercase font-bold tracking-widest text-accent">
                    {selectedConvocatoria.category}
                  </span>
                  <span className="bg-white/15 border border-white/10 px-4 py-1.5 rounded text-xs uppercase font-bold tracking-widest text-white backdrop-blur-sm">
                    {selectedConvocatoria.scope}
                  </span>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] text-white/40 font-bold uppercase tracking-wider bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                  <div>
                    <span className="text-white/20 block text-[8px] tracking-widest">Publicado</span>
                    <span className="text-white/80">{selectedConvocatoria.date}</span>
                  </div>
                  <div>
                    <span className="text-white/20 block text-[8px] tracking-widest">Entidad</span>
                    <span className="text-white/80 truncate block">{selectedConvocatoria.entity}</span>
                  </div>
                  <div>
                    <span className="text-white/20 block text-[8px] tracking-widest">Fecha Cierre</span>
                    <span className="text-accent font-extrabold">{selectedConvocatoria.deadline}</span>
                  </div>
                  <div>
                    <span className="text-white/20 block text-[8px] tracking-widest">Ámbito</span>
                    <span className="text-white/80">{selectedConvocatoria.scope}</span>
                  </div>
                </div>

                <h1 className="text-3xl md:text-5xl font-black uppercase text-white leading-tight pt-2">
                  {selectedConvocatoria.title}
                </h1>
              </div>

              {/* Renderizado de Descripción y Requisitos Detallados */}
              <div className="text-white/70 text-base md:text-lg leading-relaxed font-light pt-6 border-t border-white/5 space-y-6">
                {selectedConvocatoria.content.split("\n\n").map((para, pIdx) => {
                  if (para.startsWith("###")) {
                    return (
                      <h3 key={pIdx} className="text-xl md:text-2xl font-bold uppercase text-white tracking-wide pt-4 border-b border-white/5 pb-2">
                        {para.replace("###", "").trim()}
                      </h3>
                    );
                  }
                  return <p key={pIdx} className="text-sm md:text-base leading-relaxed text-white/70">{para}</p>;
                })}
              </div>

              {/* Botón de Aplicación / Enlace de la Convocatoria */}
              <div className="pt-8 border-t border-white/5 text-center">
                <a
                  href={selectedConvocatoria.link}
                  target={selectedConvocatoria.link.startsWith("http") ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="inline-block bg-accent hover:bg-[#00cc6a] text-black font-extrabold text-xs uppercase tracking-[4px] px-10 py-5 rounded transition-all duration-300 shadow-[0_0_20px_var(--accent-glow)] hover:shadow-[0_0_35px_var(--accent)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  Aplicar a la Convocatoria
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
