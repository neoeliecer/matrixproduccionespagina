"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CinematicOverlay from "@/components/CinematicOverlay";
import { useState } from "react";
import eventsData from "@/data/events.json";

export default function Eventos() {
  const [events, setEvents] = useState(eventsData);
  const [selectedEvent, setSelectedEvent] = useState<typeof eventsData[0] | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar eventos por término de búsqueda
  const filteredEvents = events.filter((event) => {
    return (
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getFullGallery = (event: typeof eventsData[0]) => {
    const mainImg = event.image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800";
    const extraImages = Array.isArray(event.gallery) ? event.gallery : [];
    return [mainImg, ...extraImages];
  };

  const nextSlide = (galleryLen: number) => {
    setActiveSlide((prev) => (prev === galleryLen - 1 ? 0 : prev + 1));
  };

  const prevSlide = (galleryLen: number) => {
    setActiveSlide((prev) => (prev === 0 ? galleryLen - 1 : prev - 1));
  };

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
              Agenda Social & Cultural
            </span>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight text-white leading-none">
              Eventos Culturales
            </h1>
            <p className="text-white/40 text-sm max-w-lg mx-auto uppercase tracking-[3px] mt-2">
              Registros y crónicas de festivales, teatro, encuentros y expresiones de Cali y el mundo
            </p>
          </div>

          {/* Search bar */}
          <div className="max-w-md mx-auto mb-16 relative">
            <input
              type="text"
              placeholder="Buscar festival, teatro, fecha o lugar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 px-6 py-4 rounded-full text-white text-sm focus:outline-none focus:border-accent transition-colors backdrop-blur-md"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-white/30 text-xs">🔍</span>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <article
                  key={index}
                  className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md hover:border-accent/30 hover:bg-white/[0.02] transition-all duration-500 flex flex-col justify-between group shadow-2xl"
                >
                  <div className="relative aspect-video overflow-hidden border-b border-white/5">
                    <img
                      src={event.image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800"}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-accent text-black font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded shadow-[0_0_15px_var(--accent-glow)]">
                        🎬 {event.tag}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-[10px] text-white/40 font-bold uppercase tracking-wider">
                        <span>🗓️ {event.date}</span>
                        <span>📍 {event.location.split(",")[1] || "Cali"}</span>
                      </div>

                      <h2 className="text-xl font-extrabold uppercase text-white tracking-wide transition-colors group-hover:text-accent leading-tight">
                        {event.title}
                      </h2>

                      <p className="text-white/50 text-xs leading-relaxed font-light line-clamp-3">
                        {event.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[10px] uppercase font-extrabold tracking-[2px]">
                      <span className="text-white/40 truncate max-w-[150px]">Lugar: {event.location.split(",")[0]}</span>
                      <button
                        onClick={() => {
                          setSelectedEvent(event);
                          setActiveSlide(0);
                        }}
                        className="text-accent group-hover:text-white transition-colors cursor-pointer"
                      >
                        Fotos & Detalles →
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-3 text-center py-20 text-white/40 uppercase tracking-widest text-sm">
                No se encontraron eventos culturales registrados.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FULL DETAILED MODAL WITH PHOTO CAROUSEL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-[#030303] border border-white/10 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 z-50 bg-black/80 hover:bg-accent border border-white/10 hover:border-accent text-white hover:text-black p-2.5 rounded-full transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              ✕
            </button>

            {/* Event Gallery Slider Component */}
            {(() => {
              const gallery = getFullGallery(selectedEvent);
              return (
                <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-white/5 bg-black">
                  <img
                    src={gallery[activeSlide]}
                    alt={`Foto ${activeSlide + 1} de ${selectedEvent.title}`}
                    className="w-full h-full object-cover transition-all duration-500"
                  />

                  {/* Navigation Arrows (Only if gallery has more than 1 image) */}
                  {gallery.length > 1 && (
                    <>
                      <button
                        onClick={() => prevSlide(gallery.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-accent border border-white/10 text-white hover:text-black p-3 rounded-full transition-colors cursor-pointer z-10"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => nextSlide(gallery.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-accent border border-white/10 text-white hover:text-black p-3 rounded-full transition-colors cursor-pointer z-10"
                      >
                        →
                      </button>
                    </>
                  )}

                  {/* Slide Indicators Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/80 border border-white/10 px-3 py-1 rounded text-[9px] uppercase font-bold tracking-widest text-accent z-10">
                    📷 {activeSlide + 1} / {gallery.length} Fotos
                  </div>
                </div>
              );
            })()}

            {/* Event Description Content */}
            <div className="p-8 md:p-10 space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-[10px] text-white/40 font-bold uppercase tracking-widest">
                  <span className="text-accent">🎬 {selectedEvent.tag}</span>
                  <span>•</span>
                  <span>🗓️ {selectedEvent.date}</span>
                  <span>•</span>
                  <span>📍 {selectedEvent.location}</span>
                </div>

                <h1 className="text-2xl md:text-4xl font-black uppercase text-white tracking-wide leading-tight">
                  {selectedEvent.title}
                </h1>
              </div>

              {/* Renderized detailed markdown text */}
              <div className="text-white/70 text-sm md:text-base leading-relaxed font-light pt-6 border-t border-white/5 space-y-6">
                {selectedEvent.description.split("\n\n").map((para, pIdx) => {
                  if (para.startsWith("###")) {
                    return (
                      <h3 key={pIdx} className="text-lg md:text-xl font-bold uppercase text-white tracking-wide pt-4 border-b border-white/5 pb-2">
                        {para.replace("###", "").trim()}
                      </h3>
                    );
                  }
                  if (para.startsWith("*")) {
                    return (
                      <ul key={pIdx} className="list-disc pl-5 space-y-1 text-white/70">
                        {para.split("\n").map((li, liIdx) => (
                          <li key={liIdx}>{li.replace("*", "").trim()}</li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={pIdx}>{para}</p>;
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
