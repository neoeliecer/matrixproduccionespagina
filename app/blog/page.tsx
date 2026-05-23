"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CinematicOverlay from "@/components/CinematicOverlay";
import { useState, useEffect } from "react";
import postsData from "@/data/posts.json";

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState(postsData);
  const [selectedPost, setSelectedPost] = useState<typeof postsData[0] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});

  const [emailInput, setEmailInput] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [subMessage, setSubMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) {
      setSubStatus("error");
      setSubMessage("Por favor, ingresa un correo electrónico válido.");
      return;
    }
    setSubStatus("loading");
    try {
      const res = await fetch("/api/suscribir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubStatus("success");
        setSubMessage(data.message || "¡Gracias por suscribirte al boletín!");
        setEmailInput("");
      } else {
        setSubStatus("error");
        setSubMessage(data.error || "Ocurrió un error. Inténtalo de nuevo.");
      }
    } catch (err) {
      setSubStatus("error");
      setSubMessage("Error de conexión con el servidor.");
    }
  };

  // Load post from query parameter on load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const postTitle = params.get("post");
      if (postTitle) {
        const foundPost = postsData.find(
          (p) => p.title.toLowerCase().trim() === postTitle.toLowerCase().trim()
        );
        if (foundPost) {
          setSelectedPost(foundPost);
        }
      }
    }
  }, []);

  // Helper to sanitize post title for CounterAPI
  const getPostKey = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9]/g, "_")      // Replace non-alphanumeric with _
      .substring(0, 30);               // Keep it short
  };

  // Load view counts for all posts
  useEffect(() => {
    const loadViews = async () => {
      const counts: Record<string, number> = {};
      for (const post of posts) {
        const key = getPostKey(post.title);
        try {
          const res = await fetch(`https://api.counterapi.dev/v1/matrixproducciones_blog/${key}`);
          if (res.ok) {
            const data = await res.json();
            counts[post.title] = data.count || 0;
          } else {
            counts[post.title] = Math.max(12, (post.title.length * 3) % 97);
          }
        } catch (e) {
          counts[post.title] = Math.max(12, (post.title.length * 3) % 97);
        }
      }
      setViewCounts(counts);
    };

    if (posts.length > 0) {
      loadViews();
    }
  }, [posts]);

  // Increment views when reading
  const incrementViews = async (postTitle: string) => {
    const key = getPostKey(postTitle);
    try {
      const res = await fetch(`https://api.counterapi.dev/v1/matrixproducciones_blog/${key}/up`);
      if (res.ok) {
        const data = await res.json();
        setViewCounts((prev) => ({
          ...prev,
          [postTitle]: data.count || (prev[postTitle] || 0) + 1,
        }));
      }
    } catch (e) {
      console.warn("Error incrementing view count:", e);
    }
  };

  // Get unique categories dynamically from loaded posts
  const categories = ["Todos", ...Array.from(new Set(posts.map((post) => post.category)))];

  // Filter posts based on search term & selected category
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "Todos" ||
      post.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <CinematicOverlay />
      <Navbar />

      <main className="relative min-h-screen bg-[#030303] pt-32 pb-24 px-6 md:px-12 overflow-hidden">
        {/* Glow halo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {!selectedPost ? (
            <>
              {/* Blog Listing Mode */}
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
              <div className="max-w-md mx-auto mb-8 relative">
                <input
                  type="text"
                  placeholder="Buscar artículos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 px-6 py-4 rounded-full text-white text-sm focus:outline-none focus:border-accent transition-colors backdrop-blur-md"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-white/30 text-xs">🔍</span>
              </div>

              {/* Category Filter Chips */}
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
                          src={post.image || "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800"}
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
                            <span className="flex items-center gap-1">
                              👁️ {viewCounts[post.title] !== undefined ? viewCounts[post.title] : "..."} • {post.readTime} lectura
                            </span>
                          </div>
                          <h2 className="text-xl font-extrabold uppercase text-white tracking-wide transition-colors group-hover:text-accent leading-tight">
                            {post.title}
                          </h2>
                          <p className="text-white/50 text-xs leading-relaxed font-light line-clamp-3">
                            {post.excerpt}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[10px] uppercase font-extrabold tracking-[2px]">
                          <span className="text-white/40">Por: {post.author || "Eliecer"}</span>
                          <button
                            onClick={() => {
                              setSelectedPost(post);
                              incrementViews(post.title);
                              if (typeof window !== "undefined") {
                                window.history.pushState({}, "", `/blog?post=${encodeURIComponent(post.title)}`);
                              }
                            }}
                            className="text-accent group-hover:text-white transition-colors cursor-pointer"
                          >
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
            </>
          ) : (
            /* Single Post Detail Mode */
            <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
              <button
                onClick={() => {
                  setSelectedPost(null);
                  if (typeof window !== "undefined") {
                    window.history.pushState({}, "", "/blog");
                  }
                }}
                className="text-accent hover:text-white text-xs uppercase tracking-[3px] font-bold flex items-center gap-2 mb-6 cursor-pointer"
              >
                ← Volver al blog
              </button>

              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                <img
                  src={selectedPost.image || "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800"}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 left-6 bg-black/80 border border-white/10 px-4 py-1.5 rounded text-xs uppercase font-bold tracking-widest text-accent">
                  {selectedPost.category}
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex gap-6 text-[10px] text-white/40 font-bold uppercase tracking-wider flex-wrap">
                  <span>🗓️ {selectedPost.date}</span>
                  <span>👁️ {viewCounts[selectedPost.title] !== undefined ? viewCounts[selectedPost.title] : "..."} vistas</span>
                  <span>⏱️ {selectedPost.readTime} de lectura</span>
                  <span>✍️ Autor: {selectedPost.author || "Eliecer"}</span>
                </div>

                <h1 className="text-3xl md:text-5xl font-black uppercase text-white leading-tight">
                  {selectedPost.title}
                </h1>
              </div>

              {/* Render dynamic text with line breaks */}
              <div className="text-white/70 text-base md:text-lg leading-relaxed font-light pt-6 border-t border-white/5 space-y-6">
                {selectedPost.content.split("\n\n").map((para, pIdx) => {
                  if (para.startsWith("###")) {
                    return (
                      <h3 key={pIdx} className="text-xl md:text-2xl font-bold uppercase text-white tracking-wide pt-4">
                        {para.replace("###", "").trim()}
                      </h3>
                    );
                  }
                  return <p key={pIdx}>{para}</p>;
                })}
              </div>

              {/* Share widget */}
              <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <span className="text-[10px] uppercase tracking-[3px] font-bold text-white/40">
                  Compartir esta historia:
                </span>
                <div className="flex flex-wrap gap-3">
                  {/* WhatsApp */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `Mira este artículo de Matrix Producciones: "${selectedPost.title}" en ${
                        typeof window !== "undefined"
                          ? window.location.origin + "/blog?post=" + encodeURIComponent(selectedPost.title)
                          : ""
                      }`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-black border border-[#25D366]/30 hover:border-[#25D366] px-4 py-2.5 rounded text-[10px] uppercase font-extrabold tracking-[2px] transition-all duration-300 shadow-[0_0_15px_rgba(37,211,102,0.05)] hover:shadow-[0_0_15px_rgba(37,211,102,0.2)] cursor-pointer"
                  >
                    💬 WhatsApp
                  </a>

                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      typeof window !== "undefined"
                        ? window.location.origin + "/blog?post=" + encodeURIComponent(selectedPost.title)
                        : ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#1877F2]/10 hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-[#1877F2]/30 hover:border-[#1877F2] px-4 py-2.5 rounded text-[10px] uppercase font-extrabold tracking-[2px] transition-all duration-300 shadow-[0_0_15px_rgba(24,119,242,0.05)] hover:shadow-[0_0_15px_rgba(24,119,242,0.2)] cursor-pointer"
                  >
                    🔵 Facebook
                  </a>

                  {/* Twitter / X */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      `Mira este artículo de Matrix Producciones: "${selectedPost.title}"`
                    )}&url=${encodeURIComponent(
                      typeof window !== "undefined"
                        ? window.location.origin + "/blog?post=" + encodeURIComponent(selectedPost.title)
                        : ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white/5 hover:bg-white text-white hover:text-black border border-white/10 hover:border-white px-4 py-2.5 rounded text-[10px] uppercase font-extrabold tracking-[2px] transition-all duration-300 cursor-pointer"
                  >
                    🐦 Twitter / X
                  </a>

                  {/* Copy Link button */}
                  <button
                    onClick={() => {
                      if (typeof navigator !== "undefined" && typeof window !== "undefined") {
                        const copyUrl = window.location.origin + "/blog?post=" + encodeURIComponent(selectedPost.title);
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
            </div>
          )}

          {/* ================= NEWSLETTER SUBSCRIPTION SECTION ================= */}
          <div className="mt-32 max-w-4xl mx-auto border-t border-white/5 pt-20">
            <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-8 md:p-16 backdrop-blur-xl relative overflow-hidden shadow-2xl group hover:border-accent/20 transition-all duration-500">
              {/* Decorative internal radial glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] pointer-events-none" />

              <div className="relative z-10 text-center space-y-6 max-w-xl mx-auto">
                <span className="text-accent text-[10px] uppercase tracking-[4px] font-extrabold block">
                  Boletín Cinematográfico
                </span>
                <h3 className="text-2xl md:text-4xl font-extrabold uppercase tracking-wide text-white leading-tight">
                  Suscríbete Al Lente de Matrix
                </h3>
                <p className="text-white/40 text-xs md:text-sm font-light leading-relaxed">
                  Recibe en tu correo electrónico análisis profundos, historias exclusivas detrás de cámaras y actualizaciones automáticas cada vez que la IA publique un nuevo artículo.
                </p>

                <form onSubmit={handleSubscribe} className="pt-6 flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    required
                    placeholder="Tu correo electrónico..."
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    disabled={subStatus === "loading"}
                    className="flex-1 bg-white/[0.02] border border-white/10 px-6 py-4 rounded-full text-white text-sm focus:outline-none focus:border-accent disabled:opacity-50 transition-colors backdrop-blur-md"
                  />
                  <button
                    type="submit"
                    disabled={subStatus === "loading"}
                    className="bg-accent hover:bg-[#00cc6a] text-black font-extrabold text-[10px] uppercase tracking-[3px] px-8 py-4 sm:py-0 rounded-full transition-all duration-300 shadow-[0_0_20px_var(--accent-glow)] hover:shadow-[0_0_30px_var(--accent)] disabled:opacity-50 disabled:shadow-none shrink-0"
                  >
                    {subStatus === "loading" ? "Procesando..." : "Suscribirse"}
                  </button>
                </form>

                {subStatus !== "idle" && (
                  <p
                    className={`text-xs font-bold uppercase tracking-widest pt-4 animate-fade-in ${
                      subStatus === "success"
                        ? "text-accent drop-shadow-[0_0_10px_var(--accent-glow)]"
                        : subStatus === "error"
                        ? "text-red-500"
                        : "text-white/40"
                    }`}
                  >
                    {subMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
