"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CinematicOverlay from "@/components/CinematicOverlay";
import { useState, useEffect } from "react";
import PhotoViewer from "@/components/PhotoViewer";

interface Galeria {
  id: string;
  title: string;
  category: string;
  date: string;
  images: string[];
}

export default function Galerias() {
  const [galerias, setGalerias] = useState<Galeria[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("Todas");
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/galerias")
      .then((res) => res.json())
      .then((data) => {
        // Sort newest first
        const sorted = data.sort((a: Galeria, b: Galeria) => Number(b.id) - Number(a.id));
        setGalerias(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading galerias", err);
        setLoading(false);
      });
  }, []);

  const uniqueCategories = Array.from(new Set(galerias.map((g) => g.category))).filter(Boolean);
  const categories = ["Todas", ...uniqueCategories];

  const filteredGalerias = activeCategory === "Todas"
    ? galerias
    : galerias.filter((g) => g.category === activeCategory);

  return (
    <>
      <CinematicOverlay />
      <Navbar />

      <main className="relative min-h-screen pt-32 pb-24 px-6 z-10 bg-[#030303]">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-4">
              Galerías <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#00cc6a]">Fotográficas</span>
            </h1>
            <p className="text-sm md:text-base text-white/50 uppercase tracking-[4px] max-w-2xl mx-auto">
              Revive los mejores momentos de nuestros eventos y descarga tus fotos en alta resolución.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-[2px] transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-accent text-black shadow-[0_0_15px_rgba(0,255,135,0.4)]"
                    : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Galleries Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="flex h-3 w-3 rounded-full bg-accent animate-ping" />
            </div>
          ) : filteredGalerias.length === 0 ? (
            <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-2xl">
              <p className="text-white/40 uppercase tracking-[2px] text-sm">
                No hay galerías publicadas en esta categoría aún.
              </p>
            </div>
          ) : (
            <div className="space-y-24">
              {filteredGalerias.map((galeria) => (
                <div key={galeria.id}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-white/10">
                    <div>
                      <h2 className="text-2xl font-extrabold text-white uppercase tracking-wider mb-2">
                        {galeria.title}
                      </h2>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] bg-accent/10 border border-accent/20 px-2 py-0.5 rounded text-accent uppercase font-bold tracking-widest">
                          {galeria.category}
                        </span>
                        <span className="text-xs text-white/40 uppercase tracking-widest">
                          {galeria.date}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-white/40 uppercase tracking-widest mt-4 md:mt-0">
                      {galeria.images.length} Fotografías
                    </p>
                  </div>

                  {/* Masonry-like Grid for Images */}
                  <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                    {galeria.images.map((imgUrl, idx) => {
                      // Usar cloudinary parameters para optimizar el thumbnail
                      const thumbUrl = imgUrl.includes("res.cloudinary.com") 
                        ? imgUrl.replace("/upload/", "/upload/w_400,c_scale,q_auto,f_auto/")
                        : imgUrl;

                      return (
                        <div 
                          key={idx} 
                          className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-lg bg-white/5 border border-white/10"
                          onClick={() => setSelectedPhoto(imgUrl)}
                        >
                          <img 
                            src={thumbUrl} 
                            alt={`${galeria.title} - Foto ${idx + 1}`}
                            className="w-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-60"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                            <span className="text-accent text-[10px] uppercase tracking-[2px] font-bold">Ver & Descargar</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />

      {/* Fullscreen Viewer */}
      {selectedPhoto && (
        <PhotoViewer 
          imageSrc={selectedPhoto} 
          onClose={() => setSelectedPhoto(null)} 
        />
      )}
    </>
  );
}
