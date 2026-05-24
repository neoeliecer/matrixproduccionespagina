"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CinematicOverlay from "@/components/CinematicOverlay";
import { useState, useEffect } from "react";
import initialEventsData from "@/data/events.json";

export default function Eventos() {
  const [events, setEvents] = useState<any[]>(initialEventsData);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Todos");
  const [selectedTag, setSelectedTag] = useState("Todos");
  
  // UI states
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newLocationDetail, setNewLocationDetail] = useState("");
  const [newLocationCategory, setNewLocationCategory] = useState("Cali");
  const [newDate, setNewDate] = useState("");
  const [newTag, setNewTag] = useState("Cultural");
  const [newExcerpt, setNewExcerpt] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newGallery, setNewGallery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Unsplash image presets
  const presets = {
    Cine: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800",
    Teatro: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
    Cultural: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&q=80&w=800",
  };

  // Fetch events from dynamic API on mount
  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/eventos");
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.events) {
          setEvents(data.events);
        }
      }
    } catch (e) {
      console.error("Error fetching dynamic events:", e);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events based on search, location, and tag
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.excerpt.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      selectedLocation === "Todos" ||
      (event.categoryLocation &&
        event.categoryLocation.toLowerCase().trim() === selectedLocation.toLowerCase().trim());

    const matchesTag =
      selectedTag === "Todos" ||
      event.tag.toLowerCase().trim() === selectedTag.toLowerCase().trim();

    return matchesSearch && matchesLocation && matchesTag;
  });

  const getFullGallery = (event: any) => {
    const mainImg = event.image || presets.Cultural;
    const extraImages = Array.isArray(event.gallery) ? event.gallery : [];
    return [mainImg, ...extraImages];
  };

  const nextSlide = (galleryLen: number) => {
    setActiveSlide((prev) => (prev === galleryLen - 1 ? 0 : prev + 1));
  };

  const prevSlide = (galleryLen: number) => {
    setActiveSlide((prev) => (prev === 0 ? galleryLen - 1 : prev - 1));
  };

  // Toast Helper
  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  // Preset Selection in form
  const applyPresetImage = (type: keyof typeof presets) => {
    setNewImage(presets[type]);
  };

  // Manual Event Submission Handler
  const handlePublishEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim() || !newLocationDetail.trim() || !newDate.trim()) {
      showToast("error", "Por favor completa todos los campos marcados con (*)");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/eventos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: {
            title: newTitle,
            location: newLocationDetail,
            date: newDate,
            tag: newTag,
            image: newImage || presets[newTag as keyof typeof presets],
            gallery: newGallery,
            excerpt: newExcerpt || newDescription.substring(0, 100) + "...",
            description: newDescription,
            categoryLocation: newLocationCategory
          }
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast("success", `¡Éxito! El evento "${newTitle}" se ha publicado correctamente.`);
        
        // Reset form states
        setNewTitle("");
        setNewLocationDetail("");
        setNewLocationCategory("Cali");
        setNewDate("");
        setNewTag("Cultural");
        setNewExcerpt("");
        setNewDescription("");
        setNewImage("");
        setNewGallery("");
        setIsSubmitModalOpen(false);

        // Refresh list
        fetchEvents();
      } else {
        showToast("error", data.error || "Ocurrió un error al guardar el evento.");
      }
    } catch (err) {
      showToast("error", "Error de conexión al servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // AI Crawler Trigger Handler
  const handleTriggerAICrawler = async () => {
    setIsScanning(true);
    
    // Animation stages simulator
    const steps = [
      "Estableciendo conexión encriptada...",
      `Iniciando escaneo satelital de noticias culturales...`,
      `Rastreando espectáculos en ${selectedLocation === "Todos" ? "Cali, España, Nueva York, Atlanta..." : selectedLocation}...`,
      "Analizando agendas, carteleras teatrales y notas de prensa...",
      "Ejecutando algoritmo de no-duplicación Matrix...",
      "¡Información curada! IA redactando crónica cultural y seleccionando fotografía..."
    ];

    let stepIndex = 0;
    setScanStep(steps[0]);

    const interval = setInterval(() => {
      if (stepIndex < steps.length - 1) {
        stepIndex++;
        setScanStep(steps[stepIndex]);
      }
    }, 1200);

    try {
      const payload: any = {};
      if (selectedLocation !== "Todos") {
        payload.location = selectedLocation;
      }

      const response = await fetch("/api/eventos/auto-generar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      clearInterval(interval);

      if (response.ok && data.success && data.event) {
        showToast(
          "success",
          `🤖 ¡IA Matrix descubrió un evento en ${data.event.categoryLocation}! "${data.event.title}"`
        );
        fetchEvents();
      } else {
        showToast("error", data.error || "La IA no encontró noticias culturales no repetidas hoy.");
      }
    } catch (err) {
      clearInterval(interval);
      showToast("error", "Error de red al invocar el robot de rastreo de eventos.");
    } finally {
      setIsScanning(false);
      setScanStep("");
    }
  };

  const locations = ["Todos", "Cali", "Colombia", "Estados Unidos", "Nueva York", "Atlanta", "España"];
  const tags = ["Todos", "Cine", "Teatro", "Cultural"];

  return (
    <>
      <CinematicOverlay />
      <Navbar />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-[2000] max-w-sm w-full bg-[#080808]/95 border border-white/10 rounded-xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-md animate-fade-in flex items-start gap-3">
          <div className="text-xl">{toast.type === "success" ? "✅" : "❌"}</div>
          <div className="flex-1 space-y-1">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-white">
              {toast.type === "success" ? "Acción Completada" : "Atención"}
            </h4>
            <p className="text-white/60 text-xs leading-relaxed font-light">{toast.message}</p>
          </div>
        </div>
      )}

      <main className="relative min-h-screen bg-[#030303] pt-32 pb-24 px-6 md:px-12 overflow-hidden">
        {/* Glow halo backgrounds */}
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[300px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[250px] bg-accent/3 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-accent text-xs uppercase tracking-[5px] font-bold block animate-pulse">
              Cartelera Cultural Matrix
            </span>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white leading-none">
              Espectáculos
            </h1>
            <p className="text-white/40 text-xs uppercase tracking-[3px] leading-relaxed">
              Reseñas, festivales, teatro, cine y crónicas artísticas locales y globales actualizadas a diario
            </p>
          </div>

          {/* Interactive Toolbar Banner */}
          <div className="max-w-4xl mx-auto bg-white/[0.01] border border-white/5 p-6 rounded-2xl backdrop-blur-md flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-accent/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="space-y-2 text-center md:text-left relative z-10">
              <span className="text-accent text-[9px] uppercase tracking-widest font-black block">Centro de Operaciones</span>
              <h3 className="text-white font-extrabold uppercase text-base tracking-wider">
                Cartelera Automatizada & Libre
              </h3>
              <p className="text-white/40 text-[10px] uppercase tracking-wider font-light">
                Puedes proponer tu evento o encargar a la IA Matrix que rastree las redes culturales
              </p>
            </div>

            <div className="flex gap-4 relative z-10 w-full md:w-auto">
              <button
                onClick={handleTriggerAICrawler}
                disabled={isScanning}
                className="flex-1 md:flex-none bg-accent hover:bg-[#00cc6a] text-black font-extrabold text-[10px] uppercase tracking-[3px] py-4 px-6 rounded transition-all duration-300 shadow-[0_0_15px_var(--accent-glow)] hover:shadow-[0_0_25px_var(--accent)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🤖</span> Rastrear con IA
              </button>
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="flex-1 md:flex-none border border-white/10 hover:border-white/30 hover:bg-white/5 text-white font-extrabold text-[10px] uppercase tracking-[3px] py-4 px-6 rounded transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>✍️</span> Publicar Evento
              </button>
            </div>
          </div>

          {/* FILTER SYSTEM & SEARCH */}
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <input
                type="text"
                placeholder="Buscar festival, cine, teatro, fecha, sala..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 px-6 py-4 rounded-full text-white text-sm focus:outline-none focus:border-accent transition-colors backdrop-blur-md text-center uppercase tracking-wider placeholder:text-white/20"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-white/30 text-xs">🔍</span>
            </div>

            {/* Glowing Locations Horizontal Tabs */}
            <div className="space-y-2">
              <span className="text-white/30 text-[8px] uppercase tracking-widest font-black block text-center">Filtro por Ubicación</span>
              <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 max-w-full no-scrollbar">
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setSelectedLocation(loc)}
                    className={`px-5 py-2.5 rounded-full text-[10px] uppercase font-black tracking-widest transition-all cursor-pointer whitespace-nowrap border shrink-0 ${
                      selectedLocation === loc
                        ? "bg-accent text-black border-accent shadow-[0_0_15px_var(--accent-glow)]"
                        : "bg-white/[0.01] text-white/50 border-white/5 hover:text-white hover:border-white/20"
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags Pills */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="text-white/30 text-[8px] uppercase tracking-widest font-black mr-2">Espectáculo:</span>
              {tags.map((tg) => (
                <button
                  key={tg}
                  onClick={() => setSelectedTag(tg)}
                  className={`px-4 py-1.5 rounded text-[9px] uppercase font-extrabold tracking-widest transition-colors cursor-pointer border ${
                    selectedTag === tg
                      ? "bg-white/10 text-accent border-accent/30"
                      : "bg-transparent text-white/30 border-transparent hover:text-white"
                  }`}
                >
                  {tg}
                </button>
              ))}
            </div>
          </div>

          {/* EVENTS CARDS GRID */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto pt-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <article
                  key={index}
                  className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md hover:border-accent/30 hover:bg-white/[0.02] transition-all duration-500 flex flex-col justify-between group shadow-2xl relative"
                >
                  <div className="relative aspect-video overflow-hidden border-b border-white/5">
                    <img
                      src={event.image || presets.Cultural}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-accent text-black font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded shadow-[0_0_15px_var(--accent-glow)]">
                        🎬 {event.tag}
                      </span>
                      {event.categoryLocation && (
                        <span className="bg-black/90 text-white font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded border border-white/10">
                          📍 {event.categoryLocation}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-[9px] text-white/40 font-bold uppercase tracking-wider">
                        <span>🗓️ {event.date}</span>
                        <span>{event.location.split(",")[1] || event.categoryLocation || "Cali"}</span>
                      </div>

                      <h2 className="text-lg font-black uppercase text-white tracking-wide transition-colors group-hover:text-accent leading-tight min-h-[44px] line-clamp-2">
                        {event.title}
                      </h2>

                      <p className="text-white/50 text-[11px] leading-relaxed font-light line-clamp-3">
                        {event.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[9px] uppercase font-extrabold tracking-[2px] w-full">
                      <span className="text-white/40 truncate max-w-[150px]">Lugar: {event.location.split(",")[0]}</span>
                      <button
                        onClick={() => {
                          setSelectedEvent(event);
                          setActiveSlide(0);
                        }}
                        className="text-accent hover:text-white transition-colors cursor-pointer"
                      >
                        Fotos & Detalles →
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-3 text-center py-24 border border-white/5 rounded-2xl bg-white/[0.005] max-w-4xl mx-auto w-full">
                <span className="text-4xl block mb-4">🎭</span>
                <div className="text-white/30 uppercase tracking-widest text-xs font-bold space-y-2">
                  <p>No se encontraron eventos culturales en esta categoría.</p>
                  <p className="text-[10px] text-white/20">Prueba con otro filtro o dile al robot inteligente que busque nuevos eventos.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FULL DETAILED MODAL WITH PHOTO CAROUSEL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
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

                  {/* Navigation Arrows */}
                  {gallery.length > 1 && (
                    <>
                      <button
                        onClick={() => prevSlide(gallery.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-accent border border-white/10 text-white hover:text-black p-3 rounded-full transition-colors cursor-pointer z-10"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => nextSlide(gallery.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-accent border border-white/10 text-white hover:text-black p-3 rounded-full transition-colors cursor-pointer z-10"
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
                <div className="flex flex-wrap items-center gap-3 text-[9px] text-white/40 font-bold uppercase tracking-widest">
                  <span className="text-accent">🎬 {selectedEvent.tag}</span>
                  <span>•</span>
                  <span>🗓️ {selectedEvent.date}</span>
                  <span>•</span>
                  <span>📍 {selectedEvent.location}</span>
                  {selectedEvent.categoryLocation && (
                    <>
                      <span>•</span>
                      <span className="text-white/60">Categoría: {selectedEvent.categoryLocation}</span>
                    </>
                  )}
                </div>

                <h1 className="text-2xl md:text-4xl font-black uppercase text-white tracking-wide leading-tight">
                  {selectedEvent.title}
                </h1>
              </div>

              {/* Renderized detailed markdown text */}
              <div className="text-white/70 text-sm leading-relaxed font-light pt-6 border-t border-white/5 space-y-6">
                {selectedEvent.description.split("\n\n").map((para: string, pIdx: number) => {
                  if (para.startsWith("###")) {
                    return (
                      <h3 key={pIdx} className="text-lg md:text-xl font-extrabold uppercase text-white tracking-wide pt-4 border-b border-white/5 pb-2">
                        {para.replace("###", "").trim()}
                      </h3>
                    );
                  }
                  if (para.startsWith("*")) {
                    return (
                      <ul key={pIdx} className="list-disc pl-5 space-y-2 text-white/70">
                        {para.split("\n").map((li, liIdx) => (
                          <li key={liIdx} className="font-light">{li.replace("*", "").trim()}</li>
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

      {/* DIALOG/MODAL: MANUAL EVENT SUBMISSION FORM */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-[#080808] border border-white/10 rounded-2xl max-w-2xl w-full p-8 md:p-10 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-4 right-4 bg-black/80 hover:bg-accent border border-white/10 hover:border-accent text-white hover:text-black p-2 rounded-full transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-6">
              <div className="text-center space-y-2">
                <span className="text-accent text-[9px] uppercase tracking-widest font-black block">Cartelera Social</span>
                <h2 className="text-2xl font-black uppercase text-white tracking-wide">
                  Publicar Evento Cultural
                </h2>
                <p className="text-white/40 text-[10px] tracking-wider uppercase font-light">
                  Añade tu propia función de teatro, proyección cinematográfica o feria artística
                </p>
              </div>

              <form onSubmit={handlePublishEvent} className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-[2px] font-bold text-white/50">Título del Evento *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Estreno Cortometrajes Caliwood 2026"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="bg-white/[0.02] border border-white/10 px-4 py-3 rounded text-white text-xs focus:outline-none focus:border-accent w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] uppercase tracking-[2px] font-bold text-white/50">Fecha *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. 18 de Junio, 2026"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="bg-white/[0.02] border border-white/10 px-4 py-3 rounded text-white text-xs focus:outline-none focus:border-accent w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] uppercase tracking-[2px] font-bold text-white/50">Lugar Físico *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Cinemateca La Tertulia, Cali"
                      value={newLocationDetail}
                      onChange={(e) => setNewLocationDetail(e.target.value)}
                      className="bg-white/[0.02] border border-white/10 px-4 py-3 rounded text-white text-xs focus:outline-none focus:border-accent w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] uppercase tracking-[2px] font-bold text-white/50">Categoría Geográfica (Filtro)</label>
                    <select
                      value={newLocationCategory}
                      onChange={(e) => setNewLocationCategory(e.target.value)}
                      className="bg-[#0a0a0a] border border-white/10 px-4 py-3 rounded text-white text-xs focus:outline-none focus:border-accent w-full uppercase tracking-wider font-bold"
                    >
                      <option value="Cali">Cali</option>
                      <option value="Colombia">Colombia (General)</option>
                      <option value="Estados Unidos">Estados Unidos</option>
                      <option value="Nueva York">Nueva York</option>
                      <option value="Atlanta">Atlanta</option>
                      <option value="España">España</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] uppercase tracking-[2px] font-bold text-white/50">Tipo de Espectáculo *</label>
                    <select
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="bg-[#0a0a0a] border border-white/10 px-4 py-3 rounded text-white text-xs focus:outline-none focus:border-accent w-full uppercase tracking-wider font-bold"
                    >
                      <option value="Cine">Cine</option>
                      <option value="Teatro">Teatro</option>
                      <option value="Cultural">Cultural / General</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-[2px] font-bold text-white/50">Imagen de Portada (Enlace URL)</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="bg-white/[0.02] border border-white/10 px-4 py-3 rounded text-white text-xs focus:outline-none focus:border-accent w-full"
                  />
                  {/* Preset Quick Selectors */}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-white/30 text-[8px] uppercase tracking-wider">Presets Rápidos:</span>
                    <button
                      type="button"
                      onClick={() => applyPresetImage("Cine")}
                      className="px-2.5 py-1 bg-white/5 border border-white/10 text-[8px] rounded uppercase font-bold text-white/60 hover:text-accent hover:border-accent transition-all cursor-pointer"
                    >
                      🎞️ Cine
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetImage("Teatro")}
                      className="px-2.5 py-1 bg-white/5 border border-white/10 text-[8px] rounded uppercase font-bold text-white/60 hover:text-accent hover:border-accent transition-all cursor-pointer"
                    >
                      🎭 Teatro
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetImage("Cultural")}
                      className="px-2.5 py-1 bg-white/5 border border-white/10 text-[8px] rounded uppercase font-bold text-white/60 hover:text-accent hover:border-accent transition-all cursor-pointer"
                    >
                      🏛️ Cultura
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-[2px] font-bold text-white/50">Resumen Breve (Para el catálogo)</label>
                  <input
                    type="text"
                    placeholder="Una frase de 2 líneas sobre la función..."
                    value={newExcerpt}
                    onChange={(e) => setNewExcerpt(e.target.value)}
                    className="bg-white/[0.02] border border-white/10 px-4 py-3 rounded text-white text-xs focus:outline-none focus:border-accent w-full"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-[2px] font-bold text-white/50">Descripción Detallada * (Soporta salto de línea y Markdown)</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Escribe los detalles del evento, sinopsis, agenda, horarios..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="bg-white/[0.02] border border-white/10 px-4 py-3 rounded text-white text-xs focus:outline-none focus:border-accent resize-none w-full"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-[2px] font-bold text-white/50">Galería de Fotos Adicionales (Enlaces URL separados por comas)</label>
                  <input
                    type="text"
                    placeholder="https://image1.jpg, https://image2.jpg..."
                    value={newGallery}
                    onChange={(e) => setNewGallery(e.target.value)}
                    className="bg-white/[0.02] border border-white/10 px-4 py-3 rounded text-white text-xs focus:outline-none focus:border-accent w-full"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent hover:bg-[#00cc6a] text-black font-extrabold text-[10px] uppercase tracking-[3px] py-4 rounded transition-all duration-300 shadow-[0_0_20px_var(--accent-glow)] hover:shadow-[0_0_30px_var(--accent)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  {isSubmitting ? "Publicando evento..." : "Publicar Evento Cultural"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* FULL-SCREEN DIGITAL AI SCANNER RADAR SCREEN */}
      {isScanning && (
        <div className="fixed inset-0 z-[3000] bg-black/98 flex items-center justify-center p-6 backdrop-blur-xl animate-fade-in overflow-hidden">
          {/* Cybernetic elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-accent/10 animate-pulse-slow pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full border border-accent/20 border-dashed animate-spin pointer-events-none" style={{ animationDuration: "30s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border-2 border-accent/30 pointer-events-none" />
          
          {/* Glowing Green Radar Sweeper */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full pointer-events-none bg-gradient-to-tr from-accent/0 via-accent/0 to-accent/25 animate-spin" style={{ animationDuration: "4s" }} />

          <div className="max-w-md w-full text-center space-y-8 relative z-10">
            {/* Hologram Box */}
            <div className="relative inline-block">
              <span className="text-6xl animate-float block">🤖</span>
              <div className="absolute -inset-4 bg-accent/20 rounded-full blur-xl animate-pulse" />
            </div>

            <div className="space-y-4">
              <span className="text-accent text-[9px] uppercase tracking-[6px] font-black block animate-pulse">
                Rastreador Inteligente Matrix
              </span>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest text-white">
                Escaneando la Red Cultural
              </h2>
              <div className="h-[2px] bg-white/10 w-32 mx-auto relative overflow-hidden">
                <div className="absolute inset-y-0 bg-accent w-12 animate-ping" style={{ animationDuration: "1.5s" }} />
              </div>
            </div>

            {/* Terminal Live logs */}
            <div className="bg-[#050505] border border-white/5 rounded-xl p-6 font-mono text-[10px] text-accent/80 text-left min-h-[96px] shadow-inner relative space-y-2 select-none overflow-hidden">
              <div className="absolute top-2 right-4 flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                <span className="text-white/20 text-[8px] uppercase tracking-wider">LIVE DATA</span>
              </div>
              <p className="text-white/30">&gt; matrix-bot --action crawl-events --loc {selectedLocation}</p>
              <p className="text-accent animate-pulse leading-relaxed">&gt; {scanStep}</p>
            </div>

            <p className="text-white/30 text-[9px] uppercase tracking-widest font-bold">
              Buscando en Cali, Colombia, España, Estados Unidos y más...
            </p>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
