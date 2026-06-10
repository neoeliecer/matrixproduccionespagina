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
  password?: string;
  images: string[];
}

export default function Galerias() {
  const [galerias, setGalerias] = useState<Galeria[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("Todas");
  const [selectedPhoto, setSelectedPhoto] = useState<{images: string[], index: number} | null>(null);
  const [loading, setLoading] = useState(true);
  const [albumIdParam, setAlbumIdParam] = useState<string | null>(null);
  const [copiedAlbum, setCopiedAlbum] = useState<string | null>(null);

  // States for locked galleries
  const [unlockedGalerias, setUnlockedGalerias] = useState<string[]>([]);
  const [passwordInputs, setPasswordInputs] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/galerias")
      .then((res) => res.json())
      .then((data) => {
        // Sort newest first
        const sorted = data.sort((a: Galeria, b: Galeria) => Number(b.id) - Number(a.id));
        setGalerias(sorted);
        setLoading(false);
        
        // Check for specific album sharing
        const params = new URLSearchParams(window.location.search);
        setAlbumIdParam(params.get("album"));
      })
      .catch((err) => {
        console.error("Error loading galerias", err);
        setLoading(false);
      });
  }, []);

  const uniqueCategories = Array.from(new Set(galerias.map((g) => g.category))).filter(Boolean);
  const categories = ["Todas", ...uniqueCategories];

  const filteredGalerias = galerias.filter((g) => {
    if (albumIdParam) return g.id === albumIdParam;
    return activeCategory === "Todas" ? true : g.category === activeCategory;
  });

  const handleShareAlbum = (galeriaId: string) => {
    const shareUrl = `${window.location.origin}/galerias?album=${galeriaId}`;
    if (navigator.share) {
      navigator.share({
        title: "Mira este álbum fotográfico",
        url: shareUrl,
      }).catch(() => fallbackCopy(shareUrl, galeriaId));
    } else {
      fallbackCopy(shareUrl, galeriaId);
    }
  };

  const fallbackCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedAlbum(id);
    setTimeout(() => setCopiedAlbum(null), 3000);
  };

  const handleUnlock = (galeriaId: string, correctPassword?: string) => {
    const input = passwordInputs[galeriaId] || "";
    if (input === correctPassword) {
      setUnlockedGalerias((prev) => [...prev, galeriaId]);
      setPasswordErrors((prev) => ({ ...prev, [galeriaId]: false }));
    } else {
      setPasswordErrors((prev) => ({ ...prev, [galeriaId]: true }));
    }
  };

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

          {/* Filters (Hide if sharing specific album) */}
          {!albumIdParam && (
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
          )}

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
                    
                    <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
                      <p className="text-xs text-white/40 uppercase tracking-widest">
                        {galeria.password ? "🔒 Álbum Privado" : `${galeria.images.length} Fotografías`}
                      </p>
                      <button
                        onClick={() => handleShareAlbum(galeria.id)}
                        className="flex items-center gap-2 border border-white/20 hover:border-accent text-white font-extrabold text-[10px] uppercase tracking-[2px] px-4 py-2 rounded transition-all hover:bg-white/5 active:scale-95"
                      >
                        {copiedAlbum === galeria.id ? "✅ Copiado" : "🔗 Compartir Álbum"}
                      </button>
                    </div>
                  </div>

                  {galeria.password && !unlockedGalerias.includes(galeria.id) ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-center max-w-2xl mx-auto backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                      <div className="text-5xl mb-6">🔒</div>
                      <h3 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Álbum Protegido</h3>
                      <p className="text-sm text-white/50 mb-8 max-w-sm">
                        Este evento es privado. Introduce la contraseña proporcionada por el organizador para ver y descargar las fotos.
                      </p>
                      <div className="flex w-full max-w-sm flex-col gap-2">
                        <div className="flex gap-2">
                          <input 
                            type="password" 
                            value={passwordInputs[galeria.id] || ""}
                            onChange={(e) => setPasswordInputs({ ...passwordInputs, [galeria.id]: e.target.value })}
                            placeholder="Contraseña del álbum..." 
                            className="flex-1 bg-black/50 border border-white/20 focus:border-accent outline-none rounded p-4 text-center tracking-[5px] text-white transition-colors"
                            onKeyDown={(e) => e.key === "Enter" && handleUnlock(galeria.id, galeria.password)}
                          />
                          <button 
                            onClick={() => handleUnlock(galeria.id, galeria.password)}
                            className="bg-accent hover:bg-[#00cc6a] text-black font-extrabold uppercase px-6 rounded transition-all"
                          >
                            Entrar
                          </button>
                        </div>
                        {passwordErrors[galeria.id] && (
                          <span className="text-red-400 text-xs font-bold uppercase tracking-widest mt-2">
                            ❌ Contraseña incorrecta
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Masonry-like Grid for Images */
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
                            onClick={() => setSelectedPhoto({ images: galeria.images, index: idx })}
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
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />

      {selectedPhoto && (
        <PhotoViewer 
          images={selectedPhoto.images} 
          initialIndex={selectedPhoto.index}
          onClose={() => setSelectedPhoto(null)} 
        />
      )}
    </>
  );
}
