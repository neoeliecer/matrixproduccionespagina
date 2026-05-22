"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CinematicOverlay from "@/components/CinematicOverlay";
import { useState } from "react";

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");

  const posts = [
    {
      title: "Detrás de Cámaras: El Viaje Emocional de 'La Despedida'",
      excerpt: "Exploramos los desafíos creativos y emocionales de grabar nuestro documental más íntimo sobre el cierre de ciclos y el valor humano.",
      category: "Detrás de Cámaras",
      date: "Mayo 15, 2026",
      readTime: "5 min",
      author: "Eliecer",
      image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "El Cine como Herramienta de Transformación y Conciencia Ambiental",
      excerpt: "Cómo el lenguaje cinematográfico puede mover fibras y generar un cambio social real en el cuidado de nuestra biodiversidad planetaria.",
      category: "Opinión",
      date: "Abril 28, 2026",
      readTime: "7 min",
      author: "Equipo Matrix",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Arte y Sanación: Capturando la Magia de los Mandalas en Cali",
      excerpt: "Un recorrido visual e inspirador por el proceso de filmación en Cali, mostrando el poder sanador del arte y la meditación.",
      category: "Historias",
      date: "Marzo 10, 2026",
      readTime: "4 min",
      author: "Eliecer",
      image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800",
    },
  ];

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <CinematicOverlay />
      <Navbar />

      <main className="relative min-h-screen bg-[#030303] pt-32 pb-24 px-6 md:px-12 overflow-hidden">
        {/* Glow halo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-4 mb-16">
            <span className="text-accent text-xs uppercase tracking-[5px] font-bold block">
              Historias & Reflexiones
            </span>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight text-white leading-none">
              Nuestro Blog
            </h1>
            <p className="text-white/40 text-sm max-w-md mx-auto uppercase tracking-[3px] mt-2">
              Perspectivas detrás del lente cinematográfico
            </p>
          </div>

          {/* Search bar */}
          <div className="max-w-md mx-auto mb-16 relative">
            <input
              type="text"
              placeholder="Buscar artículos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 px-6 py-4 rounded-full text-white text-sm focus:outline-none focus:border-accent transition-colors backdrop-blur-md"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-white/30 text-xs">🔍</span>
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <article
                  key={index}
                  className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md hover:border-accent/30 hover:bg-white/[0.02] transition-all duration-500 flex flex-col justify-between group shadow-2xl"
                >
                  <div className="relative aspect-video overflow-hidden border-b border-white/5">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-black/80 border border-white/10 px-3 py-1 rounded text-[9px] uppercase font-bold tracking-widest text-accent">
                      {post.category}
                    </div>
                  </div>

                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-[10px] text-white/40 font-bold uppercase tracking-wider">
                        <span>{post.date}</span>
                        <span>{post.readTime} lectura</span>
                      </div>
                      <h2 className="text-xl font-extrabold uppercase text-white tracking-wide transition-colors group-hover:text-accent leading-tight">
                        {post.title}
                      </h2>
                      <p className="text-white/50 text-xs leading-relaxed font-light line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[10px] uppercase font-extrabold tracking-[2px]">
                      <span className="text-white/40">Por: {post.author}</span>
                      <button className="text-accent group-hover:text-white transition-colors">
                        Leer Más →
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-3 text-center py-20 text-white/40 uppercase tracking-widest text-sm">
                No se encontraron artículos que coincidan con tu búsqueda.
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
