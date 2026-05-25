"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CinematicOverlay from "@/components/CinematicOverlay";
import initialBts from "@/data/bts.json";

export default function Catalogo() {
  const [activeTab, setActiveTab] = useState<"films" | "apps" | "bts">("films");
  const [btsProjects] = useState<any[]>(initialBts);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

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

  // Open Lightbox
  const openLightbox = (url: string, index: number) => {
    setLightboxImage(url);
    setLightboxIndex(index);
  };

  // Close Lightbox
  const closeLightbox = () => {
    setLightboxImage(null);
    setLightboxIndex(-1);
  };

  // Navigate Lightbox
  const navigateLightbox = (direction: "prev" | "next") => {
    if (!selectedProject || lightboxIndex === -1) return;
    const images = selectedProject.images;
    let newIndex = lightboxIndex;
    
    if (direction === "prev") {
      newIndex = (lightboxIndex - 1 + images.length) % images.length;
    } else {
      newIndex = (lightboxIndex + 1) % images.length;
    }
    
    setLightboxImage(images[newIndex]);
    setLightboxIndex(newIndex);
  };

  // Escuchador de teclado global para el Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === -1) return;
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        navigateLightbox("prev");
      } else if (e.key === "ArrowRight") {
        navigateLightbox("next");
      }
    };

    if (lightboxIndex !== -1) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex]);

  // Cargar proyecto desde los parámetros de la URL al cargar la página
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const projectParam = params.get("proyecto");
      if (projectParam) {
        const found = btsProjects.find(
          (p) => p.id.toLowerCase().trim() === projectParam.toLowerCase().trim()
        );
        if (found) {
          setActiveTab("bts");
          setSelectedProject(found);
        }
      }
    }
  }, [btsProjects]);

  return (
    <>
      <CinematicOverlay />
      <Navbar />

      <main className="relative min-h-screen bg-[#030303] pt-32 pb-24 px-6 md:px-12 overflow-hidden">
        {/* Glowing background halo */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header Title (ocultar si hay un proyecto expandido en Detrás de Cámaras) */}
          {!selectedProject && (
            <div className="text-center space-y-4 mb-16">
              <span className="text-accent text-xs uppercase tracking-[5px] font-bold block">
                Nuestro Legado Multidisciplinar
              </span>
              <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight text-white leading-none">
                Catálogo
              </h1>
              <p className="text-white/40 text-sm max-w-md mx-auto uppercase tracking-[3px] mt-2">
                Historias, detrás de cámaras y soluciones tecnológicas
              </p>
            </div>
          )}

          {/* Category Tabs (ocultar si hay un proyecto expandido) */}
          {!selectedProject && (
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-16">
              <button
                onClick={() => setActiveTab("films")}
                className={`flex items-center gap-3 font-extrabold text-[10px] md:text-xs uppercase tracking-[3px] px-6 py-4 border rounded-[2px] transition-all duration-300 cursor-pointer ${
                  activeTab === "films"
                    ? "border-accent bg-accent/10 text-accent shadow-[0_0_20px_var(--accent-glow)]"
                    : "border-white/10 bg-white/[0.01] text-white/50 hover:border-white/30 hover:text-white"
                }`}
              >
                🎥 Cine & Documentales ({films.length})
              </button>
              <button
                onClick={() => setActiveTab("apps")}
                className={`flex items-center gap-3 font-extrabold text-[10px] md:text-xs uppercase tracking-[3px] px-6 py-4 border rounded-[2px] transition-all duration-300 cursor-pointer ${
                  activeTab === "apps"
                    ? "border-accent bg-accent/10 text-accent shadow-[0_0_20px_var(--accent-glow)]"
                    : "border-white/10 bg-white/[0.01] text-white/50 hover:border-white/30 hover:text-white"
                }`}
              >
                📱 Aplicaciones ({apps.length})
              </button>
              <button
                onClick={() => setActiveTab("bts")}
                className={`flex items-center gap-3 font-extrabold text-[10px] md:text-xs uppercase tracking-[3px] px-6 py-4 border rounded-[2px] transition-all duration-300 cursor-pointer ${
                  activeTab === "bts"
                    ? "border-accent bg-accent/10 text-accent shadow-[0_0_20px_var(--accent-glow)]"
                    : "border-white/10 bg-white/[0.01] text-white/50 hover:border-white/30 hover:text-white"
                }`}
              >
                📸 Detrás de Cámaras ({btsProjects.length})
              </button>
            </div>
          )}

          {/* ================= FILMS TAB ================= */}
          {activeTab === "films" && !selectedProject && (
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
          )}

          {/* ================= APPS TAB ================= */}
          {activeTab === "apps" && !selectedProject && (
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

          {/* ================= BTS (BEHIND THE SCENES) TAB ================= */}
          {activeTab === "bts" && (
            <div className="w-full">
              {!selectedProject ? (
                /* BTS Grid View */
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {btsProjects.map((project, index) => (
                    <article
                      key={project.id || index}
                      onClick={() => {
                        setSelectedProject(project);
                        if (typeof window !== "undefined") {
                          window.history.pushState({}, "", `/catalogo?proyecto=${encodeURIComponent(project.id)}`);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      className="bg-white/[0.01] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md hover:border-accent/30 hover:bg-white/[0.02] transition-all duration-500 cursor-pointer flex flex-col justify-between group shadow-2xl"
                    >
                      <div className="relative aspect-video overflow-hidden border-b border-white/5">
                        <img
                          src={project.coverImage}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-4 left-4 bg-black/80 border border-white/10 px-3 py-1 rounded text-[9px] uppercase font-bold tracking-widest text-accent">
                          🎬 {project.school || "Proyecto"}
                        </div>
                      </div>

                      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-[10px] text-white/40 font-bold uppercase tracking-wider">
                            <span>{project.date}</span>
                            <span>📸 {project.images.length} fotos</span>
                          </div>
                          <h2 className="text-xl font-extrabold uppercase text-white tracking-wide transition-colors group-hover:text-accent leading-tight">
                            {project.title}
                          </h2>
                          <p className="text-white/50 text-xs leading-relaxed font-light line-clamp-3">
                            {project.excerpt}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[10px] uppercase font-extrabold tracking-[2px]">
                          <span className="text-white/40">Dir: {project.director}</span>
                          <span className="text-accent group-hover:text-white transition-colors">
                            Explorar Galería →
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                /* BTS Project Detailed View */
                <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
                  
                  {/* Back Button */}
                  <button
                    onClick={() => {
                      setSelectedProject(null);
                      if (typeof window !== "undefined") {
                        window.history.pushState({}, "", "/catalogo");
                      }
                    }}
                    className="text-accent hover:text-white text-xs uppercase tracking-[3px] font-black flex items-center gap-2 mb-6 cursor-pointer transition-colors"
                  >
                    ← Volver al Catálogo
                  </button>

                  {/* Cover Banner */}
                  <div className="relative aspect-[21/9] w-full rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                    <img
                      src={selectedProject.coverImage}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 md:left-10 space-y-2">
                      <span className="bg-accent/15 border border-accent/20 px-3 py-1 rounded text-[10px] uppercase font-bold tracking-widest text-accent">
                        {selectedProject.school}
                      </span>
                      <h1 className="text-2xl md:text-4xl font-black uppercase text-white tracking-wide leading-tight">
                        {selectedProject.title}
                      </h1>
                    </div>
                  </div>

                  {/* Project Credits Card */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border border-white/5 p-6 rounded-2xl bg-white/[0.01] backdrop-blur-md shadow-xl text-center">
                    <div className="space-y-1 border-r border-white/5 last:border-0">
                      <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold block">Director</span>
                      <p className="text-white text-sm font-extrabold uppercase tracking-wider">{selectedProject.director}</p>
                    </div>
                    <div className="space-y-1 md:border-r border-white/5 last:border-0">
                      <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold block">Dirección de Foto</span>
                      <p className="text-white text-sm font-extrabold uppercase tracking-wider">{selectedProject.photographer}</p>
                    </div>
                    <div className="space-y-1 border-r border-white/5 last:border-0 pt-2 md:pt-0">
                      <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold block">Escuela / Org</span>
                      <p className="text-white text-sm font-extrabold uppercase tracking-wider">{selectedProject.school}</p>
                    </div>
                    <div className="space-y-1 last:border-0 pt-2 md:pt-0">
                      <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold block">Registro BTS</span>
                      <p className="text-accent text-sm font-extrabold uppercase tracking-wider drop-shadow-[0_0_6px_var(--accent-glow)]">{selectedProject.btsAuthor}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2">
                      Sobre el Rodaje
                    </h3>
                    <p className="text-white/70 text-sm md:text-base leading-relaxed font-light">
                      {selectedProject.description}
                    </p>
                  </div>

                  {/* Sharing Widget */}
                  <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <span className="text-[10px] uppercase tracking-[3px] font-bold text-white/40">
                      Compartir este detrás de cámaras:
                    </span>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                          `Mira este detrás de cámaras de Matrix Producciones: "${selectedProject.title}" en ${
                            typeof window !== "undefined"
                              ? window.location.origin + "/catalogo?proyecto=" + encodeURIComponent(selectedProject.id)
                              : ""
                          }`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-black border border-[#25D366]/30 hover:border-[#25D366] px-4 py-2.5 rounded text-[10px] uppercase font-extrabold tracking-[2px] transition-all duration-300 shadow-[0_0_15px_rgba(37,211,102,0.05)] hover:shadow-[0_0_15px_rgba(37,211,102,0.2)] cursor-pointer"
                      >
                        💬 WhatsApp
                      </a>

                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          typeof window !== "undefined"
                            ? window.location.origin + "/catalogo?proyecto=" + encodeURIComponent(selectedProject.id)
                            : ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-[#1877F2]/10 hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-[#1877F2]/30 hover:border-[#1877F2] px-4 py-2.5 rounded text-[10px] uppercase font-extrabold tracking-[2px] transition-all duration-300 shadow-[0_0_15px_rgba(24,119,242,0.05)] hover:shadow-[0_0_15px_rgba(24,119,242,0.2)] cursor-pointer"
                      >
                        🔵 Facebook
                      </a>

                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                          `Mira este detrás de cámaras de Matrix Producciones: "${selectedProject.title}"`
                        )}&url=${encodeURIComponent(
                          typeof window !== "undefined"
                            ? window.location.origin + "/catalogo?proyecto=" + encodeURIComponent(selectedProject.id)
                            : ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-white/5 hover:bg-white text-white hover:text-black border border-white/10 hover:border-white px-4 py-2.5 rounded text-[10px] uppercase font-extrabold tracking-[2px] transition-all duration-300 cursor-pointer"
                      >
                        🐦 Twitter / X
                      </a>

                      <button
                        onClick={() => {
                          if (typeof navigator !== "undefined" && typeof window !== "undefined") {
                            const copyUrl = window.location.origin + "/catalogo?proyecto=" + encodeURIComponent(selectedProject.id);
                            navigator.clipboard.writeText(copyUrl);
                            alert("¡Enlace copiado al portapapeles con éxito!");
                          }
                        }}
                        className="flex items-center gap-2 bg-accent/10 hover:bg-accent text-accent hover:text-black border border-accent/20 hover:border-accent px-4 py-2.5 rounded text-[10px] uppercase font-extrabold tracking-[2px] transition-all duration-300 shadow-[0_0_15px_rgba(0,255,136,0.05)] hover:shadow-[0_0_15px_var(--accent-glow)] cursor-pointer"
                      >
                        🔗 Copiar Enlace
                      </button>
                    </div>
                  </div>

                  {/* Photo Gallery Grid */}
                  <div className="space-y-6 pt-4">
                    <h3 className="text-xl font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2">
                      Galería de Fotos
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedProject.images.map((url: string, imgIdx: number) => (
                        <div
                          key={imgIdx}
                          onClick={() => openLightbox(url, imgIdx)}
                          className="relative aspect-square md:aspect-[4/3] overflow-hidden rounded-2xl border border-white/5 group hover:border-accent/30 transition-all duration-500 shadow-2xl bg-white/[0.01] cursor-pointer"
                        >
                          <img
                            src={url}
                            alt={`Set photo ${imgIdx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                            <span className="text-[9px] uppercase font-black tracking-widest text-accent drop-shadow-[0_0_8px_var(--accent-glow)]">
                              🔍 Ver en Grande
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* ================= FULLSCREEN LIGHTBOX ================= */}
      {lightboxImage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in">
          <div className="absolute inset-0 cursor-zoom-out" onClick={closeLightbox} />

          <div className="absolute top-0 left-0 w-full p-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-white/50 z-10 pointer-events-none">
            <div className="flex flex-wrap items-center justify-center gap-4 pointer-events-auto">
              <span className="text-xs uppercase font-extrabold tracking-[2px] text-white/45">
                Foto {lightboxIndex + 1} de {selectedProject?.images.length}
              </span>
              <span className="text-white/10 hidden sm:inline">|</span>
              {/* WhatsApp Share for Specific Photo */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `Mira esta foto detrás de cámaras del rodaje "${selectedProject?.title}": ${lightboxImage}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-black border border-[#25D366]/20 px-3.5 py-1.5 rounded-full text-[9px] uppercase font-black tracking-widest transition-all duration-300 shadow-md cursor-pointer"
              >
                💬 Compartir Foto
              </a>
              {/* Copy Photo Link */}
              <button
                onClick={() => {
                  if (typeof navigator !== "undefined" && lightboxImage) {
                    navigator.clipboard.writeText(lightboxImage);
                    alert("¡Enlace directo de la foto copiado!");
                  }
                }}
                className="bg-accent/10 hover:bg-accent text-accent hover:text-black border border-accent/20 px-3.5 py-1.5 rounded-full text-[9px] uppercase font-black tracking-widest transition-all duration-300 shadow-md cursor-pointer"
              >
                🔗 Copiar Foto
              </button>
            </div>
            <button
              onClick={closeLightbox}
              className="text-white hover:text-accent font-black text-xs uppercase tracking-[3px] border border-white/10 hover:border-accent/30 px-6 py-2.5 rounded bg-black/50 pointer-events-auto transition-colors cursor-pointer self-center sm:self-auto"
            >
              Cerrar (ESC)
            </button>
          </div>

          <button
            onClick={() => navigateLightbox("prev")}
            className="absolute left-6 text-white hover:text-accent p-4 rounded-full border border-white/10 hover:border-accent/30 bg-black/30 hover:bg-black/60 transition-all z-10 cursor-pointer hidden md:block"
            aria-label="Anterior"
          >
            ←
          </button>

          <div className="relative max-w-[90vw] max-h-[80vh] flex items-center justify-center select-none">
            <img
              src={lightboxImage}
              alt="Detalle de detrás de cámaras"
              className="max-w-full max-h-[85vh] object-contain rounded-xl border border-white/10 shadow-2xl animate-scale-up"
            />
          </div>

          <button
            onClick={() => navigateLightbox("next")}
            className="absolute right-6 text-white hover:text-accent p-4 rounded-full border border-white/10 hover:border-accent/30 bg-black/30 hover:bg-black/60 transition-all z-10 cursor-pointer hidden md:block"
            aria-label="Siguiente"
          >
            →
          </button>

          <div className="absolute bottom-6 flex gap-4 md:hidden z-10">
            <button
              onClick={() => navigateLightbox("prev")}
              className="text-white hover:text-accent px-6 py-3 rounded-full border border-white/10 bg-black/60 text-xs font-bold uppercase tracking-wider"
            >
              ← Anterior
            </button>
            <button
              onClick={() => navigateLightbox("next")}
              className="text-white hover:text-accent px-6 py-3 rounded-full border border-white/10 bg-black/60 text-xs font-bold uppercase tracking-wider"
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
