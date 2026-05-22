"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CinematicOverlay from "@/components/CinematicOverlay";
import { useState } from "react";
import postsData from "@/data/posts.json";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [posts, setPosts] = useState(postsData);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() !== "") {
      setIsLoggedIn(true);
      setMessage(null);
    } else {
      setMessage({ type: "error", text: "Por favor introduce una contraseña" });
    }
  };

  const handleGeneratePost = async () => {
    setIsGenerating(true);
    setMessage(null);
    try {
      const response = await fetch("/api/generar-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          type: "success",
          text: `¡Éxito! Se ha generado el artículo: "${data.post.title}" y se ha subido a GitHub. Netlify actualizará tu web en un minuto.`,
        });
        // Append locally to view instantly
        setPosts([data.post, ...posts]);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Ocurrió un error al generar el artículo.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error de red al conectar con el servidor.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <CinematicOverlay />
      <Navbar />

      <main className="relative min-h-screen bg-[#030303] pt-32 pb-24 px-6 md:px-12 overflow-hidden">
        {/* Glow halo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          {!isLoggedIn ? (
            /* Login panel */
            <div className="max-w-md mx-auto border border-white/5 p-8 md:p-12 rounded-2xl bg-white/[0.01] backdrop-blur-xl space-y-8 shadow-2xl">
              <div className="text-center space-y-2">
                <span className="text-accent text-[10px] uppercase tracking-[4px] font-bold block">
                  Panel de Control
                </span>
                <h1 className="text-3xl font-black uppercase text-white tracking-wider">
                  Admin IA Blog
                </h1>
                <p className="text-white/40 text-xs tracking-wider">
                  Introduce tu clave de administrador para acceder
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
                    Contraseña
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
                  className="w-full bg-accent hover:bg-[#00cc6a] text-black font-extrabold text-xs uppercase tracking-[4px] py-4 transition-all duration-300 shadow-[0_0_20px_var(--accent-glow)] hover:shadow-[0_0_30px_var(--accent)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  Ingresar al Panel
                </button>
              </form>
            </div>
          ) : (
            /* Dashboard Panel */
            <div className="space-y-12 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 pb-8">
                <div className="space-y-2 text-center md:text-left">
                  <span className="text-accent text-xs uppercase tracking-[4px] font-bold block">
                    Matrix Producciones
                  </span>
                  <h1 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tight leading-none">
                    Dashboard Blog IA
                  </h1>
                </div>

                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="text-white/40 hover:text-white text-xs uppercase tracking-[2px] font-bold border border-white/10 hover:border-white/30 px-4 py-2 rounded transition-colors"
                >
                  Salir del Panel
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

              {/* Quick actions box */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* AI post generation card */}
                <div className="md:col-span-2 border border-white/5 p-8 rounded-2xl bg-white/[0.01] backdrop-blur-md flex flex-col justify-between space-y-6">
                  <div>
                    <h3 className="text-xl font-extrabold uppercase text-white tracking-wider mb-2">
                      Generador de Contenido IA
                    </h3>
                    <p className="text-white/50 text-xs leading-relaxed font-light">
                      Haz clic en el botón de abajo para solicitar a **Groq (Llama 3)** que redacte un artículo original de impacto documental o ecológico, el cual se añadirá a tu base de datos y se desplegará automáticamente.
                    </p>
                  </div>

                  <button
                    onClick={handleGeneratePost}
                    disabled={isGenerating}
                    className={`w-full text-black font-extrabold text-xs uppercase tracking-[4px] py-5 rounded transition-all duration-500 ${
                      isGenerating
                        ? "bg-white/20 text-white/50 cursor-not-allowed border border-white/10"
                        : "bg-accent hover:bg-[#00cc6a] shadow-[0_0_25px_var(--accent-glow)] hover:shadow-[0_0_35px_var(--accent)] hover:-translate-y-0.5 active:translate-y-0"
                    }`}
                  >
                    {isGenerating ? "Generando Artículo con Groq..." : "Generar Artículo Ahora"}
                  </button>
                </div>

                {/* Stats box */}
                <div className="border border-white/5 p-8 rounded-2xl bg-white/[0.01] backdrop-blur-md flex flex-col justify-between">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[3px] font-bold text-accent mb-6">
                      Estado del Sistema
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <span className="text-3xl font-black text-white">{posts.length}</span>
                        <p className="text-[9px] uppercase tracking-[2px] text-white/40 mt-1 font-bold">
                          Artículos Publicados
                        </p>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-[2px] text-accent font-bold inline-flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                          Activo
                        </span>
                        <p className="text-[9px] uppercase tracking-[2px] text-white/40 mt-1 font-bold">
                          Automatización Diaria
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Posts listing */}
              <div className="space-y-6">
                <h3 className="text-xl font-extrabold uppercase text-white tracking-wider">
                  Listado de Artículos
                </h3>

                <div className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.01] backdrop-blur-md divide-y divide-white/5">
                  {posts.map((post, idx) => (
                    <div key={idx} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/[0.01] transition-colors">
                      <div>
                        <span className="text-[9px] bg-accent/10 border border-accent/20 px-2 py-0.5 rounded text-accent uppercase font-bold tracking-widest">
                          {post.category}
                        </span>
                        <h4 className="text-base font-extrabold uppercase text-white tracking-wide mt-2">
                          {post.title}
                        </h4>
                        <p className="text-xs text-white/40 mt-1 uppercase tracking-wider font-bold">
                          {post.date} | Por: {post.author || "Eliecer"}
                        </p>
                      </div>

                      <div className="flex gap-4">
                        <a
                          href="/blog"
                          target="_blank"
                          className="text-white/40 hover:text-white text-[10px] uppercase tracking-[2px] font-bold border border-white/10 px-3 py-1.5 rounded transition-colors"
                        >
                          Ver
                        </a>
                      </div>
                    </div>
                  ))}
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
