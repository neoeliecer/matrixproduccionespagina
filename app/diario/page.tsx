"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CinematicOverlay from "@/components/CinematicOverlay";
import { useState, useEffect } from "react";
import initialChangelog from "@/data/changelog.json";

export default function Diario() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [changelog, setChangelog] = useState<any[]>(initialChangelog);
  
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setMessage({ type: "error", text: "Por favor, introduce una contraseña." });
      return;
    }

    setMessage(null);
    try {
      const response = await fetch("/api/diario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          action: "leer"
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsLoggedIn(true);
        setChangelog(data.changelog);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Contraseña inválida.",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "Error de red al autenticar.",
      });
    }
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) {
      setMessage({ type: "error", text: "Por favor, completa el título y la descripción del cambio." });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/diario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          entry: {
            title: newTitle,
            description: newDesc
          }
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          type: "success",
          text: "¡Éxito! Cambio registrado en el diario de forma permanente y subido a GitHub.",
        });
        setChangelog(data.changelog);
        setNewTitle("");
        setNewDesc("");
      } else {
        setMessage({
          type: "error",
          text: data.error || "Ocurrió un error al guardar el cambio.",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "Error de red al conectar con el servidor.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <CinematicOverlay />
      <Navbar />

      <main className="relative min-h-screen bg-[#030303] pt-32 pb-24 px-6 md:px-12 overflow-hidden">
        {/* Glow halo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          {!isLoggedIn ? (
            /* Login Form */
            <div className="max-w-md mx-auto border border-white/5 p-8 md:p-12 rounded-2xl bg-white/[0.01] backdrop-blur-xl space-y-8 shadow-2xl mt-12">
              <div className="text-center space-y-2">
                <span className="text-accent text-[10px] uppercase tracking-[4px] font-bold block">
                  Bitácora de Desarrollo
                </span>
                <h1 className="text-3xl font-black uppercase text-white tracking-wider">
                  Diario de Cambios
                </h1>
                <p className="text-white/40 text-xs tracking-wider">
                  Acceso restringido para el equipo de Matrix Producciones
                </p>
              </div>

              {message && (
                <div
                  className={`p-4 rounded-[2px] text-xs uppercase tracking-wider text-center font-bold border ${
                    message.type === "error"
                      ? "bg-red-500/10 border-red-500/30 text-red-400"
                      : "bg-accent/10 border-accent/30 text-accent"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[3px] font-bold text-white/50">
                    Contraseña del Portal
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent border-b border-white/10 py-4 text-white text-center text-lg focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-accent hover:bg-[#00cc6a] text-black font-extrabold text-xs uppercase tracking-[4px] py-4 transition-all duration-300 shadow-[0_0_20px_var(--accent-glow)] hover:shadow-[0_0_30px_var(--accent)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  Ver Bitácora de Cambios
                </button>
              </form>
            </div>
          ) : (
            /* Logged in Timeline View */
            <div className="space-y-12 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 pb-8">
                <div className="space-y-2 text-center md:text-left">
                  <span className="text-accent text-xs uppercase tracking-[4px] font-bold block">
                    Matrix Producciones
                  </span>
                  <h1 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tight leading-none">
                    Diario de Cambios
                  </h1>
                  <p className="text-white/40 text-xs tracking-wider uppercase mt-1">
                    Bitácora de actualizaciones y mejoras realizadas en el sitio
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    setPassword("");
                    setMessage(null);
                  }}
                  className="text-white/40 hover:text-white text-xs uppercase tracking-[2px] font-bold border border-white/10 hover:border-white/30 px-4 py-2 rounded transition-colors cursor-pointer"
                >
                  Cerrar Bitácora
                </button>
              </div>

              {message && (
                <div
                  className={`p-6 rounded-lg text-sm leading-relaxed border ${
                    message.type === "error"
                      ? "bg-red-500/10 border-red-500/30 text-red-400"
                      : "bg-accent/10 border-accent/30 text-accent shadow-[0_0_25px_rgba(0,255,136,0.05)]"
                  }`}
                >
                  <p className="font-semibold uppercase tracking-wider mb-1">
                    {message.type === "error" ? "❌ Error en el proceso" : "✅ Proceso Exitoso"}
                  </p>
                  {message.text}
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-10">
                {/* Left: Input Form Card */}
                <div className="md:col-span-1 space-y-6">
                  <div className="border border-white/5 p-6 md:p-8 rounded-2xl bg-white/[0.01] backdrop-blur-md space-y-6 shadow-2xl">
                    <div>
                      <span className="text-accent text-[9px] uppercase font-black tracking-widest block mb-1">Nueva Mejora</span>
                      <h3 className="text-lg font-extrabold uppercase text-white tracking-wider">
                        Registrar Cambio
                      </h3>
                      <p className="text-white/40 text-[10px] leading-relaxed">
                        Añade un nuevo registro de cambio al diario con la fecha y hora del sistema actualizadas automáticamente.
                      </p>
                    </div>

                    <form onSubmit={handleAddLog} className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] uppercase tracking-[2px] font-bold text-white/40">Título del Cambio *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej. Integración de nuevo logo"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="bg-white/[0.02] border border-white/10 px-4 py-3 rounded text-white text-xs focus:outline-none focus:border-accent w-full"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] uppercase tracking-[2px] font-bold text-white/40">Descripción Detallada *</label>
                        <textarea
                          required
                          rows={6}
                          placeholder="Describe qué cambios se hicieron, qué se corrigió o qué páginas se actualizaron..."
                          value={newDesc}
                          onChange={(e) => setNewDesc(e.target.value)}
                          className="bg-white/[0.02] border border-white/10 px-4 py-3 rounded text-white text-xs focus:outline-none focus:border-accent w-full resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSaving}
                        className={`w-full text-black font-extrabold text-[10px] uppercase tracking-[3px] py-4 rounded transition-all duration-300 cursor-pointer ${
                          isSaving
                            ? "bg-white/20 text-white/50 cursor-not-allowed border border-white/10"
                            : "bg-accent hover:bg-[#00cc6a] shadow-[0_0_20px_var(--accent-glow)] hover:shadow-[0_0_30px_var(--accent)]"
                        }`}
                      >
                        {isSaving ? "Guardando Registro..." : "Registrar Cambio"}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right: Vertical Timeline */}
                <div className="md:col-span-2 relative pl-8 border-l border-white/10 space-y-8">
                  {/* Neon Glow Timeline Line */}
                  <div className="absolute top-0 left-0 -translate-x-[0.5px] w-[1px] h-full bg-accent/20" />
                  
                  {changelog.length > 0 ? (
                    changelog.map((entry, index) => (
                      <article 
                        key={index} 
                        className="relative group transition-all duration-300"
                      >
                        {/* Circle Indicator on the Timeline */}
                        <div className="absolute top-2.5 -left-8 -translate-x-[5.5px] w-3 h-3 rounded-full bg-black border border-accent flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        </div>

                        {/* Event Card */}
                        <div className="border border-white/5 p-6 rounded-2xl bg-white/[0.01] backdrop-blur-md group-hover:border-accent/20 group-hover:bg-white/[0.02] transition-all duration-500 shadow-xl space-y-3">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold uppercase tracking-wider text-accent">
                            <span>🗓️ {entry.date}</span>
                            <span className="text-white/20">•</span>
                            <span className="text-white/50">⏳ {entry.time}</span>
                          </div>

                          <h4 className="text-base md:text-lg font-black uppercase text-white tracking-wide leading-tight group-hover:text-accent transition-colors">
                            {entry.title}
                          </h4>

                          <p className="text-white/50 text-xs md:text-sm leading-relaxed font-light">
                            {entry.description}
                          </p>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="text-center py-20 text-white/30 uppercase tracking-widest text-xs">
                      No hay registros en el diario de cambios.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
