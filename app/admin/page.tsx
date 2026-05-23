"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CinematicOverlay from "@/components/CinematicOverlay";
import { useState } from "react";
import Link from "next/link";
import postsData from "@/data/posts.json";
import convocatoriasData from "@/data/convocatorias.json";
import recommendationsData from "@/data/recommendations.json";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
  const [isGeneratingConvocatoria, setIsGeneratingConvocatoria] = useState(false);
  const [activeTab, setActiveTab] = useState<"blog" | "convocatorias" | "recomendadas">("blog");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const [posts, setPosts] = useState(postsData);
  const [convocatorias, setConvocatorias] = useState(convocatoriasData);
  const [recommendations, setRecommendations] = useState(recommendationsData);

  const [movieTitle, setMovieTitle] = useState("");
  const [movieDirector, setMovieDirector] = useState("");
  const [movieYear, setMovieYear] = useState("");
  const [movieValue, setMovieValue] = useState("");
  const [movieExcerpt, setMovieExcerpt] = useState("");
  const [movieDesc, setMovieDesc] = useState("");
  const [movieImage, setMovieImage] = useState("");
  const [movieTrailer, setMovieTrailer] = useState("");
  const [isAddingMovie, setIsAddingMovie] = useState(false);
  const [isAutocompleting, setIsAutocompleting] = useState(false);
  const [movieUserOpinion, setMovieUserOpinion] = useState("");
  const [dashMovieTitle, setDashMovieTitle] = useState("");
  const [dashMovieOpinion, setDashMovieOpinion] = useState("");
  const [isDashGeneratingMovie, setIsDashGeneratingMovie] = useState(false);

  const handleCreateRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieTitle || !movieDesc) {
      setMessage({ type: "error", text: "Por favor, introduce el título y el veredicto de la película." });
      return;
    }

    setIsAddingMovie(true);
    setMessage(null);

    try {
      const response = await fetch("/api/recomendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          recommendation: {
            title: movieTitle,
            director: movieDirector,
            year: movieYear,
            value: movieValue || "Valores Positivos",
            excerpt: movieExcerpt,
            desc: movieDesc,
            image: movieImage,
            trailerUrl: movieTrailer,
          },
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          type: "success",
          text: `¡Éxito! Película recomendada agregada: "${data.recommendation.title}" y guardada en GitHub. La web se actualizará en breve.`,
        });
        setRecommendations([data.recommendation, ...recommendations]);
        
        // Reset form
        setMovieTitle("");
        setMovieDirector("");
        setMovieYear("");
        setMovieValue("");
        setMovieExcerpt("");
        setMovieDesc("");
        setMovieImage("");
        setMovieTrailer("");
        setMovieUserOpinion("");
        
        setActiveTab("recomendadas");
      } else {
        setMessage({
          type: "error",
          text: data.error || "Ocurrió un error al agregar la recomendación.",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "Error de red al conectar con el servidor.",
      });
    } finally {
      setIsAddingMovie(false);
    }
  };

  const handleAutocompleteMovie = async () => {
    if (!movieTitle.trim()) {
      setMessage({ type: "error", text: "Por favor, escribe el título de la película primero para poder autocompletar." });
      return;
    }

    setIsAutocompleting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/recomendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          action: "autocompletar",
          title: movieTitle,
          userOpinion: movieUserOpinion,
        }),
      });

      const resData = await response.json();

      if (response.ok && resData.success && resData.data) {
        const { director, year, value, excerpt, desc, image, trailerUrl } = resData.data;
        if (director) setMovieDirector(director);
        if (year) setMovieYear(year);
        if (value) setMovieValue(value);
        if (excerpt) setMovieExcerpt(excerpt);
        if (desc) setMovieDesc(desc);
        if (image) setMovieImage(image);
        if (trailerUrl) setMovieTrailer(trailerUrl);

        setMessage({
          type: "success",
          text: `¡Éxito! Datos autocompletados para "${movieTitle}". Puedes revisarlos y editarlos antes de publicar.`,
        });
      } else {
        setMessage({
          type: "error",
          text: resData.error || "Ocurrió un error al autocompletar con IA.",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "Error de red al conectar con el servicio de autocompletado.",
      });
    } finally {
      setIsAutocompleting(false);
    }
  };

  const handleDashGenerateMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dashMovieTitle.trim()) {
      setMessage({ type: "error", text: "Por favor, ingresa el título de la película en el generador." });
      return;
    }

    setIsDashGeneratingMovie(true);
    setMessage(null);

    try {
      // Paso 1: Autocompletar y redactar con IA
      const autocompleteResponse = await fetch("/api/recomendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          action: "autocompletar",
          title: dashMovieTitle,
          userOpinion: dashMovieOpinion,
        }),
      });

      const autocompleteData = await autocompleteResponse.json();

      if (!autocompleteResponse.ok || !autocompleteData.success || !autocompleteData.data) {
        setMessage({
          type: "error",
          text: autocompleteData.error || "Ocurrió un error al redactar la película con la IA.",
        });
        setIsDashGeneratingMovie(false);
        return;
      }

      const generatedMovie = autocompleteData.data;

      // Paso 2: Guardar y publicar la película generada de forma automática
      const saveResponse = await fetch("/api/recomendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          recommendation: {
            title: dashMovieTitle.trim(),
            director: generatedMovie.director,
            year: generatedMovie.year,
            value: generatedMovie.value || "Valores Positivos",
            excerpt: generatedMovie.excerpt,
            desc: generatedMovie.desc,
            image: generatedMovie.image,
            trailerUrl: generatedMovie.trailerUrl,
          },
        }),
      });

      const saveData = await saveResponse.json();

      if (saveResponse.ok && saveData.success) {
        setMessage({
          type: "success",
          text: `¡Éxito! Película generada por IA y publicada al instante: "${saveData.recommendation.title}" (Enfoque: "${dashMovieOpinion || 'General'}").`,
        });
        setRecommendations([saveData.recommendation, ...recommendations]);
        setDashMovieTitle("");
        setDashMovieOpinion("");
      } else {
        setMessage({
          type: "error",
          text: saveData.error || "Ocurrió un error al guardar la película redactada.",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "Error de red al conectar con el generador de películas.",
      });
    } finally {
      setIsDashGeneratingMovie(false);
    }
  };

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
    setIsGeneratingPost(true);
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
          text: `¡Éxito! Se ha generado el artículo: "${data.post.title}" y se ha subido a GitHub. La web se actualizará en breve.`,
        });
        setPosts([data.post, ...posts]);
        setActiveTab("blog");
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
      setIsGeneratingPost(false);
    }
  };

  const handleGenerateConvocatoria = async () => {
    setIsGeneratingConvocatoria(true);
    setMessage(null);
    try {
      const response = await fetch("/api/generar-convocatoria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          type: "success",
          text: `¡Éxito! Nueva convocatoria creada por IA: "${data.convocatoria.title}" y confirmada en GitHub. La web se actualizará automáticamente.`,
        });
        setConvocatorias([data.convocatoria, ...convocatorias]);
        setActiveTab("convocatorias");
      } else {
        setMessage({
          type: "error",
          text: data.error || "Ocurrió un error al generar la convocatoria.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error de red al conectar con el servidor para la convocatoria.",
      });
    } finally {
      setIsGeneratingConvocatoria(false);
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
            /* Login panel */
            <div className="max-w-md mx-auto border border-white/5 p-8 md:p-12 rounded-2xl bg-white/[0.01] backdrop-blur-xl space-y-8 shadow-2xl">
              <div className="text-center space-y-2">
                <span className="text-accent text-[10px] uppercase tracking-[4px] font-bold block">
                  Panel de Control
                </span>
                <h1 className="text-3xl font-black uppercase text-white tracking-wider">
                  Admin IA Matrix
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
                  className="w-full bg-accent hover:bg-[#00cc6a] text-black font-extrabold text-xs uppercase tracking-[4px] py-4 transition-all duration-300 shadow-[0_0_20px_var(--accent-glow)] hover:shadow-[0_0_30px_var(--accent)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
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
                    Dashboard IA
                  </h1>
                </div>

                <div className="flex gap-4">
                  <Link
                    href="/diario"
                    className="text-accent hover:text-white text-xs uppercase tracking-[2px] font-bold border border-accent/20 hover:border-accent/40 bg-accent/5 px-4 py-2 rounded transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(0,255,136,0.1)]"
                  >
                    📘 Diario de Cambios
                  </Link>
                  <button
                    onClick={() => setIsLoggedIn(false)}
                    className="text-white/40 hover:text-white text-xs uppercase tracking-[2px] font-bold border border-white/10 hover:border-white/30 px-4 py-2 rounded transition-colors cursor-pointer"
                  >
                    Salir del Panel
                  </button>
                </div>
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

              {/* Quick actions box (4 Columns) */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* AI blog generation card */}
                <div className="border border-white/5 p-8 rounded-2xl bg-white/[0.01] backdrop-blur-md flex flex-col justify-between space-y-6">
                  <div>
                    <span className="text-accent text-[9px] uppercase font-black tracking-widest block mb-2">Módulo Blog</span>
                    <h3 className="text-lg font-extrabold uppercase text-white tracking-wider mb-2">
                      Generador de Artículos
                    </h3>
                    <p className="text-white/50 text-[11px] leading-relaxed font-light">
                      Solicita a la IA (Groq / Llama 3) rastrear noticias del cine e industria cultural y redactar un artículo en español alineado con la visión de Matrix Producciones.
                    </p>
                  </div>

                  <button
                    onClick={handleGeneratePost}
                    disabled={isGeneratingPost || isGeneratingConvocatoria}
                    className={`w-full text-black font-extrabold text-[10px] uppercase tracking-[3px] py-4 rounded transition-all duration-500 cursor-pointer ${
                      isGeneratingPost
                        ? "bg-white/20 text-white/50 cursor-not-allowed border border-white/10"
                        : "bg-accent hover:bg-[#00cc6a] shadow-[0_0_20px_var(--accent-glow)] hover:shadow-[0_0_30px_var(--accent)] hover:-translate-y-0.5 active:translate-y-0"
                    }`}
                  >
                    {isGeneratingPost ? "Generando Artículo..." : "Generar Artículo"}
                  </button>
                </div>

                {/* AI convocatoria generation card */}
                <div className="border border-white/5 p-8 rounded-2xl bg-white/[0.01] backdrop-blur-md flex flex-col justify-between space-y-6">
                  <div>
                    <span className="text-accent text-[9px] uppercase font-black tracking-widest block mb-2">Módulo Fomento</span>
                    <h3 className="text-lg font-extrabold uppercase text-white tracking-wider mb-2">
                      Generador Convocatorias
                    </h3>
                    <p className="text-white/50 text-[11px] leading-relaxed font-light">
                      Ordena a la IA rastrear castings, fondos y estímulos locales y mundiales para publicar oportunidades reales de fomento, filtrando duplicados automáticamente.
                    </p>
                  </div>

                  <button
                    onClick={handleGenerateConvocatoria}
                    disabled={isGeneratingPost || isGeneratingConvocatoria}
                    className={`w-full text-black font-extrabold text-[10px] uppercase tracking-[3px] py-4 rounded transition-all duration-500 cursor-pointer ${
                      isGeneratingConvocatoria
                        ? "bg-white/20 text-white/50 cursor-not-allowed border border-white/10"
                        : "bg-accent hover:bg-[#00cc6a] shadow-[0_0_20px_var(--accent-glow)] hover:shadow-[0_0_30px_var(--accent)] hover:-translate-y-0.5 active:translate-y-0"
                    }`}
                  >
                    {isGeneratingConvocatoria ? "Rastreando Oportunidades..." : "Generar Convocatoria"}
                  </button>
                </div>

                {/* AI movie recommendation generation card */}
                <div className="border border-white/5 p-8 rounded-2xl bg-white/[0.01] backdrop-blur-md flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div>
                      <span className="text-accent text-[9px] uppercase font-black tracking-widest block mb-2">Módulo Cine</span>
                      <h3 className="text-lg font-extrabold uppercase text-white tracking-wider mb-2">
                        Generador Cine con Propósito
                      </h3>
                      <p className="text-white/50 text-[11px] leading-relaxed font-light">
                        Indica la película y tu opinión. La IA redactará una crítica de valores y la publicará al instante.
                      </p>
                    </div>

                    <form onSubmit={handleDashGenerateMovie} className="space-y-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] uppercase tracking-[1px] font-bold text-white/40">Título de la Película *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej. La vida es bella"
                          value={dashMovieTitle}
                          onChange={(e) => setDashMovieTitle(e.target.value)}
                          className="bg-white/[0.02] border border-white/10 px-3 py-2 rounded text-white text-xs focus:outline-none focus:border-accent w-full"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] uppercase tracking-[1px] font-bold text-white/40">Tu Enfoque / Opinión (Opcional)</label>
                        <input
                          type="text"
                          placeholder="Ej. Resaltar amor paterno"
                          value={dashMovieOpinion}
                          onChange={(e) => setDashMovieOpinion(e.target.value)}
                          className="bg-white/[0.02] border border-white/10 px-3 py-2 rounded text-white text-xs focus:outline-none focus:border-accent w-full"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isDashGeneratingMovie || isGeneratingPost || isGeneratingConvocatoria}
                        className={`w-full text-black font-extrabold text-[10px] uppercase tracking-[3px] py-3.5 rounded transition-all duration-500 cursor-pointer mt-2 ${
                          isDashGeneratingMovie
                            ? "bg-white/20 text-white/50 cursor-not-allowed border border-white/10"
                            : "bg-accent hover:bg-[#00cc6a] shadow-[0_0_20px_var(--accent-glow)] hover:shadow-[0_0_30px_var(--accent)] hover:-translate-y-0.5 active:translate-y-0"
                        }`}
                      >
                        {isDashGeneratingMovie ? "Generando..." : "Generar y Publicar"}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Stats box */}
                <div className="border border-white/5 p-8 rounded-2xl bg-white/[0.01] backdrop-blur-md flex flex-col justify-between">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[3px] font-bold text-accent mb-6">
                      Estado del Sistema
                    </h4>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-[10px] uppercase tracking-[1px] text-white/40 font-bold">Artículos</span>
                        <span className="text-2xl font-black text-white">{posts.length}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-[10px] uppercase tracking-[1px] text-white/40 font-bold">Convocatorias</span>
                        <span className="text-2xl font-black text-white">{convocatorias.length}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-[10px] uppercase tracking-[1px] text-white/40 font-bold">Películas Recomendadas</span>
                        <span className="text-2xl font-black text-white">{recommendations.length}</span>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-[2px] text-accent font-bold inline-flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                          Activo
                        </span>
                        <p className="text-[9px] uppercase tracking-[2px] text-white/40 mt-1 font-bold">
                          Automatización Diaria RSS
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inventario con Pestañas */}
              <div className="space-y-6">
                <div className="flex gap-4 border-b border-white/5">
                  <button
                    onClick={() => setActiveTab("blog")}
                    className={`pb-3 text-xs uppercase tracking-[2px] font-extrabold transition-all cursor-pointer ${
                      activeTab === "blog"
                        ? "text-accent border-b-2 border-accent"
                        : "text-white/40 hover:text-white"
                    }`}
                  >
                    Artículos ({posts.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("convocatorias")}
                    className={`pb-3 text-xs uppercase tracking-[2px] font-extrabold transition-all cursor-pointer ${
                      activeTab === "convocatorias"
                        ? "text-accent border-b-2 border-accent"
                        : "text-white/40 hover:text-white"
                    }`}
                  >
                    Convocatorias ({convocatorias.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("recomendadas")}
                    className={`pb-3 text-xs uppercase tracking-[2px] font-extrabold transition-all cursor-pointer ${
                      activeTab === "recomendadas"
                        ? "text-accent border-b-2 border-accent"
                        : "text-white/40 hover:text-white"
                    }`}
                  >
                    Recomendaciones ({recommendations.length})
                  </button>
                </div>

                {/* Listados */}
                <div className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.01] backdrop-blur-md divide-y divide-white/5">
                  {activeTab === "recomendadas" ? (
                    <div className="grid md:grid-cols-2 gap-8 p-8">
                      {/* Left: Form to Add Movie */}
                      <form onSubmit={handleCreateRecommendation} className="space-y-6 md:border-r md:border-white/5 md:pr-8">
                        <h3 className="text-lg font-extrabold uppercase text-white tracking-wider mb-4">
                          Recomendar Nueva Película
                        </h3>

                        <div className="flex flex-col gap-2">
                          <label className="text-[9px] uppercase tracking-[2px] font-bold text-white/40">Título de la Película *</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              required
                              placeholder="Ej. La sociedad de la nieve"
                              value={movieTitle}
                              onChange={(e) => setMovieTitle(e.target.value)}
                              className="flex-1 bg-white/[0.02] border border-white/10 px-4 py-3 rounded text-white text-xs focus:outline-none focus:border-accent"
                            />
                            <button
                              type="button"
                              onClick={handleAutocompleteMovie}
                              disabled={isAutocompleting || !movieTitle.trim()}
                              className={`px-4 py-3 rounded text-[10px] uppercase font-extrabold tracking-widest text-black transition-all ${
                                isAutocompleting || !movieTitle.trim()
                                  ? "bg-white/10 text-white/40 cursor-not-allowed border border-white/5"
                                  : "bg-accent hover:bg-[#00cc6a] hover:shadow-[0_0_15px_var(--accent-glow)] cursor-pointer"
                              }`}
                            >
                              {isAutocompleting ? "Cargando IA..." : "✨ Autocompletar con IA"}
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[9px] uppercase tracking-[2px] font-bold text-white/40">Tu Enfoque / Opinión Personal (Opcional - Para guiar a la IA)</label>
                          <input
                            type="text"
                            placeholder="Ej. Enfocar en la solidaridad grupal y cómo el amor familiar les dio fuerzas"
                            value={movieUserOpinion}
                            onChange={(e) => setMovieUserOpinion(e.target.value)}
                            className="bg-white/[0.02] border border-white/10 px-4 py-3 rounded text-white text-xs focus:outline-none focus:border-accent"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-[9px] uppercase tracking-[2px] font-bold text-white/40">Director</label>
                            <input
                              type="text"
                              placeholder="Ej. J.A. Bayona"
                              value={movieDirector}
                              onChange={(e) => setMovieDirector(e.target.value)}
                              className="bg-white/[0.02] border border-white/10 px-4 py-3 rounded text-white text-xs focus:outline-none focus:border-accent"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-[9px] uppercase tracking-[2px] font-bold text-white/40">Año</label>
                            <input
                              type="text"
                              placeholder="Ej. 2023"
                              value={movieYear}
                              onChange={(e) => setMovieYear(e.target.value)}
                              className="bg-white/[0.02] border border-white/10 px-4 py-3 rounded text-white text-xs focus:outline-none focus:border-accent"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[9px] uppercase tracking-[2px] font-bold text-white/40">Valor Humano Destacado *</label>
                          <input
                            type="text"
                            required
                            placeholder="Ej. Solidaridad & Superación"
                            value={movieValue}
                            onChange={(e) => setMovieValue(e.target.value)}
                            className="bg-white/[0.02] border border-white/10 px-4 py-3 rounded text-white text-xs focus:outline-none focus:border-accent"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[9px] uppercase tracking-[2px] font-bold text-white/40">Resumen Corto *</label>
                          <input
                            type="text"
                            required
                            placeholder="Una breve sinopsis atrapante..."
                            value={movieExcerpt}
                            onChange={(e) => setMovieExcerpt(e.target.value)}
                            className="bg-white/[0.02] border border-white/10 px-4 py-3 rounded text-white text-xs focus:outline-none focus:border-accent"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[9px] uppercase tracking-[2px] font-bold text-white/40">Veredicto Matrix / Tu Crítica *</label>
                          <textarea
                            required
                            rows={4}
                            placeholder="Describe por qué recomiendas esta película y qué valores positivos aporta al espectador..."
                            value={movieDesc}
                            onChange={(e) => setMovieDesc(e.target.value)}
                            className="bg-white/[0.02] border border-white/10 px-4 py-3 rounded text-white text-xs focus:outline-none focus:border-accent resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-[9px] uppercase tracking-[2px] font-bold text-white/40">URL de Imagen (Unsplash/Web)</label>
                            <input
                              type="text"
                              placeholder="https://..."
                              value={movieImage}
                              onChange={(e) => setMovieImage(e.target.value)}
                              className="bg-white/[0.02] border border-white/10 px-4 py-3 rounded text-white text-xs focus:outline-none focus:border-accent"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-[9px] uppercase tracking-[2px] font-bold text-white/40">Tráiler oficial (YouTube)</label>
                            <input
                              type="text"
                              placeholder="https://youtube.com/..."
                              value={movieTrailer}
                              onChange={(e) => setMovieTrailer(e.target.value)}
                              className="bg-white/[0.02] border border-white/10 px-4 py-3 rounded text-white text-xs focus:outline-none focus:border-accent"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isAddingMovie}
                          className={`w-full text-black font-extrabold text-[10px] uppercase tracking-[3px] py-4 rounded transition-all duration-300 cursor-pointer ${
                            isAddingMovie
                              ? "bg-white/20 text-white/50 cursor-not-allowed border border-white/10"
                              : "bg-accent hover:bg-[#00cc6a] shadow-[0_0_20px_var(--accent-glow)] hover:shadow-[0_0_30px_var(--accent)] hover:-translate-y-0.5 active:translate-y-0"
                          }`}
                        >
                          {isAddingMovie ? "Publicando..." : "Publicar Recomendación"}
                        </button>
                      </form>

                      {/* Right: List of Recommended Movies */}
                      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                        <h3 className="text-lg font-extrabold uppercase text-white tracking-wider mb-4">
                          Películas Recomendadas ({recommendations.length})
                        </h3>
                        {recommendations.map((item, idx) => (
                          <div key={idx} className="border border-white/5 p-4 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] transition-colors flex justify-between items-center gap-4">
                            <div>
                              <span className="text-[8px] bg-accent/10 border border-accent/20 px-2 py-0.5 rounded text-accent uppercase font-bold tracking-widest">
                                {item.value}
                              </span>
                              <h4 className="text-sm font-extrabold uppercase text-white tracking-wide mt-2">
                                {item.title} ({item.year})
                              </h4>
                              <p className="text-[10px] text-white/40 mt-1 uppercase font-bold">
                                Director: {item.director}
                              </p>
                            </div>
                            <a
                              href="/recomendadas"
                              target="_blank"
                              className="text-white/40 hover:text-white text-[9px] uppercase tracking-[2px] font-bold border border-white/10 px-3 py-1.5 rounded transition-colors"
                            >
                              Ver
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : activeTab === "blog" ? (
                    posts.map((post, idx) => (
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
                    ))
                  ) : (
                    convocatorias.map((item, idx) => (
                      <div key={idx} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/[0.01] transition-colors">
                        <div>
                          <div className="flex gap-2">
                            <span className="text-[9px] bg-accent/10 border border-accent/20 px-2 py-0.5 rounded text-accent uppercase font-bold tracking-widest">
                              {item.category}
                            </span>
                            <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/60 uppercase font-bold tracking-widest">
                              {item.scope}
                            </span>
                          </div>
                          <h4 className="text-base font-extrabold uppercase text-white tracking-wide mt-2">
                            {item.title}
                          </h4>
                          <p className="text-xs text-white/40 mt-1 uppercase tracking-wider font-bold">
                            Publicado: {item.date} | ⏳ Límite: <span className="text-accent">{item.deadline}</span> | Entidad: {item.entity}
                          </p>
                        </div>

                        <div className="flex gap-4">
                          <a
                            href="/convocatorias"
                            target="_blank"
                            className="text-white/40 hover:text-white text-[10px] uppercase tracking-[2px] font-bold border border-white/10 px-3 py-1.5 rounded transition-colors"
                          >
                            Ver
                          </a>
                        </div>
                      </div>
                    ))
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
