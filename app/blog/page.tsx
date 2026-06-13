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
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const [emailInput, setEmailInput] = useState("");
  const [locationInput, setLocationInput] = useState("Todas");
  const [interestsInput, setInterestsInput] = useState<string[]>(["Artículos", "Eventos", "Convocatorias"]);
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [subMessage, setSubMessage] = useState("");

  const [unlockedPosts, setUnlockedPosts] = useState<string[]>([]);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

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
        body: JSON.stringify({ 
          email: emailInput,
          location: locationInput,
          interests: interestsInput
        }),
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

  const FALLBACK_IMAGE = "/img/hero-bg.jpg";

  const getOptimizedImageUrl = (url: string) => {
    if (!url) return FALLBACK_IMAGE;
    // Optimize raw Unsplash images if they don't already have formatting query parameters
    if (url.includes("unsplash.com") && !url.includes("?")) {
      return `${url}?auto=format&fit=crop&q=80&w=800`;
    }
    return url;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!e.currentTarget.src.includes("hero-bg.jpg")) {
      e.currentTarget.src = FALLBACK_IMAGE;
    }
  };

  // Load views and likes for all posts
  useEffect(() => {
    const loadViewsAndLikes = async () => {
      const views: Record<string, number> = {};
      const likes: Record<string, number> = {};
      const userLiked: Record<string, boolean> = {};

      for (const post of posts) {
        const key = getPostKey(post.title);
        
        // Load user's personal likes from localStorage
        if (typeof window !== "undefined") {
          userLiked[post.title] = localStorage.getItem(`matrix_liked_${key}`) === "true";
        }

        // Fetch views count
        try {
          const res = await fetch(`https://api.counterapi.dev/v1/matrixproducciones_blog/${key}`);
          if (res.ok) {
            const data = await res.json();
            views[post.title] = data.count || 0;
          } else {
            views[post.title] = Math.max(12, (post.title.length * 3) % 97);
          }
        } catch (e) {
          views[post.title] = Math.max(12, (post.title.length * 3) % 97);
        }

        // Fetch likes count
        try {
          const res = await fetch(`https://api.counterapi.dev/v1/matrixproducciones_blog_likes/${key}`);
          if (res.ok) {
            const data = await res.json();
            likes[post.title] = data.count || 0;
          } else {
            likes[post.title] = Math.max(2, (post.title.length * 2) % 19);
          }
        } catch (e) {
          likes[post.title] = Math.max(2, (post.title.length * 2) % 19);
        }
      }

      setViewCounts(views);
      setLikeCounts(likes);
      setLikedPosts(userLiked);
    };

    if (posts.length > 0) {
      loadViewsAndLikes();
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

  // Register a like on a post
  const handleLikePost = async (postTitle: string) => {
    const key = getPostKey(postTitle);
    
    // Check if already liked by this user
    if (likedPosts[postTitle]) return;

    // Optimistic UI updates
    setLikeCounts((prev) => ({
      ...prev,
      [postTitle]: (prev[postTitle] || 0) + 1,
    }));
    setLikedPosts((prev) => ({
      ...prev,
      [postTitle]: true,
    }));

    if (typeof window !== "undefined") {
      localStorage.setItem(`matrix_liked_${key}`, "true");
    }

    try {
      const res = await fetch(`https://api.counterapi.dev/v1/matrixproducciones_blog_likes/${key}/up`);
      if (res.ok) {
        const data = await res.json();
        setLikeCounts((prev) => ({
          ...prev,
          [postTitle]: data.count || (prev[postTitle] || 0) + 1,
        }));
      }
    } catch (e) {
      console.warn("Error registering like on CounterAPI:", e);
    }
  };

  // Get unique categories dynamically from loaded posts
  const categories = ["Todos", ...Array.from(new Set(posts.map((post) => post.category)))];

  // Filter posts based on search term & selected category
  const filteredPosts = posts.filter((post) => {
    if (post.visible === false) return false;

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
                          src={getOptimizedImageUrl(post.image)}
                          alt=""
                          onError={handleImageError}
                          className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <div className="bg-black/80 border border-white/10 px-3 py-1 rounded text-[9px] uppercase font-bold tracking-widest text-accent">
                            {post.category}
                          </div>
                          {post.password && (
                            <div className="bg-black/80 border border-[#ff4b4b]/30 px-3 py-1 rounded text-[9px] uppercase font-bold tracking-widest text-[#ff4b4b]">
                              🔒 Privado
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-[10px] text-white/40 font-bold uppercase tracking-wider">
                            <span>{post.date}</span>
                            <span className="flex items-center gap-1.5 flex-wrap">
                              <span>👁️ {viewCounts[post.title] !== undefined ? viewCounts[post.title] : "..."}</span>
                              <span>•</span>
                              <span className="text-[#ff4b4b]">❤️ {likeCounts[post.title] !== undefined ? likeCounts[post.title] : "..."}</span>
                              <span>•</span>
                              <span>{post.readTime} lectura</span>
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
          ) : selectedPost.password && !unlockedPosts.includes(selectedPost.title) ? (
            <div className="max-w-xl mx-auto py-20 text-center animate-fade-in">
              <button
                onClick={() => {
                  setSelectedPost(null);
                  if (typeof window !== "undefined") {
                    window.history.pushState({}, "", "/blog");
                  }
                }}
                className="text-accent hover:text-white text-xs uppercase tracking-[3px] font-bold flex items-center justify-center gap-2 mb-10 cursor-pointer w-full"
              >
                ← Volver al blog
              </button>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="text-5xl mb-6">🔒</div>
                <h3 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Artículo Protegido</h3>
                <p className="text-sm text-white/50 mb-8 max-w-sm">
                  Este artículo requiere contraseña para ser leído.
                </p>
                <div className="flex w-full flex-col gap-2">
                  <div className="flex gap-2">
                    <input 
                      type="password" 
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Contraseña..." 
                      className="flex-1 bg-black/50 border border-white/20 focus:border-accent outline-none rounded p-4 text-center tracking-[5px] text-white transition-colors"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                           if (passwordInput === selectedPost.password) {
                              setUnlockedPosts([...unlockedPosts, selectedPost.title]);
                              setPasswordError(false);
                           } else {
                              setPasswordError(true);
                           }
                        }
                      }}
                    />
                    <button 
                      onClick={() => {
                        if (passwordInput === selectedPost.password) {
                          setUnlockedPosts([...unlockedPosts, selectedPost.title]);
                          setPasswordError(false);
                        } else {
                          setPasswordError(true);
                        }
                      }}
                      className="bg-accent hover:bg-[#00cc6a] text-black font-extrabold uppercase px-6 rounded transition-all"
                    >
                      Entrar
                    </button>
                  </div>
                  {passwordError && (
                    <span className="text-red-400 text-xs font-bold uppercase tracking-widest mt-2">
                      ❌ Contraseña incorrecta
                    </span>
                  )}
                </div>
              </div>
            </div>
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
                  src={getOptimizedImageUrl(selectedPost.image)}
                  alt=""
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 left-6 bg-black/80 border border-white/10 px-4 py-1.5 rounded text-xs uppercase font-bold tracking-widest text-accent">
                  {selectedPost.category}
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex gap-6 text-[10px] text-white/40 font-bold uppercase tracking-wider flex-wrap items-center">
                  <span>🗓️ {selectedPost.date}</span>
                  <span>👁️ {viewCounts[selectedPost.title] !== undefined ? viewCounts[selectedPost.title] : "..."} vistas</span>
                  <span>⏱️ {selectedPost.readTime} de lectura</span>
                  <span>✍️ Autor: {selectedPost.author || "Eliecer"}</span>
                  
                  {/* Likes status button */}
                  <button
                    onClick={() => handleLikePost(selectedPost.title)}
                    disabled={likedPosts[selectedPost.title]}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all duration-300 ${
                      likedPosts[selectedPost.title]
                        ? "bg-[#ff4b4b]/10 border-[#ff4b4b]/30 text-[#ff4b4b] cursor-default"
                        : "bg-white/5 border border-white/10 hover:border-[#ff4b4b] hover:bg-[#ff4b4b]/5 text-white hover:text-[#ff4b4b] cursor-pointer"
                    }`}
                  >
                    <span>{likedPosts[selectedPost.title] ? "❤️" : "🤍"}</span>
                    <span>{likeCounts[selectedPost.title] !== undefined ? likeCounts[selectedPost.title] : "..."}</span>
                  </button>
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
                  if (para.startsWith("[gallery]")) {
                    const urls = para.replace("[gallery]", "").trim().split(",").map(u => u.trim());
                    return (
                      <div key={pIdx} className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 my-10">
                        {urls.map((url, uIdx) => (
                          <div 
                            key={uIdx} 
                            className="relative aspect-square md:aspect-[4/3] overflow-hidden rounded-2xl border border-white/5 group hover:border-accent/30 transition-all duration-500 shadow-2xl bg-white/[0.01] cursor-pointer"
                            onClick={() => {
                              if (typeof window !== "undefined") {
                                window.open(url, "_blank");
                              }
                            }}
                          >
                            <img
                              src={getOptimizedImageUrl(url)}
                              alt=""
                              onError={handleImageError}
                              className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                              loading="lazy"
                            />
                            {/* Cinematic Hover Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                              <span className="text-[9px] uppercase font-black tracking-widest text-accent drop-shadow-[0_0_8px_var(--accent-glow)]">
                                🔍 Ver Original
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return <p key={pIdx}>{para}</p>;
                })}
              </div>

              {/* Likes & Share Action Row */}
              <div className="pt-10 border-t border-white/5 space-y-8">
                {/* Big Interactive Like Section */}
                <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white/[0.01] border border-white/5 text-center space-y-4 hover:border-accent/10 transition-all duration-500 max-w-xl mx-auto">
                  <h4 className="text-[10px] uppercase tracking-[3px] font-bold text-white/50">¿Te gustó este artículo?</h4>
                  <button
                    onClick={() => handleLikePost(selectedPost.title)}
                    disabled={likedPosts[selectedPost.title]}
                    className={`flex items-center gap-3 px-8 py-4 rounded-full font-extrabold text-xs uppercase tracking-[3px] transition-all duration-500 ${
                      likedPosts[selectedPost.title]
                        ? "bg-[#ff4b4b]/20 border border-[#ff4b4b]/40 text-[#ff4b4b] cursor-default shadow-[0_0_20px_rgba(255,75,75,0.15)]"
                        : "bg-white/5 border border-white/10 text-white hover:border-[#ff4b4b] hover:bg-[#ff4b4b]/5 hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.02)] hover:shadow-[0_0_25px_rgba(255,75,75,0.1)]"
                    }`}
                  >
                    <span className={`text-base ${likedPosts[selectedPost.title] ? "scale-110" : "animate-pulse"}`}>
                      {likedPosts[selectedPost.title] ? "❤️" : "🤍"}
                    </span>
                    <span>
                      {likedPosts[selectedPost.title] ? "¡Te gusta esta nota!" : "Me Gusta"}
                      {likeCounts[selectedPost.title] !== undefined ? ` (${likeCounts[selectedPost.title]})` : ""}
                    </span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
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

                <form onSubmit={handleSubscribe} className="pt-6 flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <input
                      type="email"
                      required
                      placeholder="Tu correo electrónico..."
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      disabled={subStatus === "loading"}
                      className="flex-1 bg-white/[0.02] border border-white/10 px-6 py-4 rounded-xl text-white text-sm focus:outline-none focus:border-accent disabled:opacity-50 transition-colors backdrop-blur-md"
                    />
                    <select
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      disabled={subStatus === "loading"}
                      className="bg-[#0a0a0a] border border-white/10 px-6 py-4 rounded-xl text-white text-sm focus:outline-none focus:border-accent transition-colors md:w-1/3 appearance-none font-bold"
                    >
                      <option value="Todas">🌍 Todas las ciudades</option>
                      <option value="Cali">🇨🇴 Cali</option>
                      <option value="Bogotá">🇨🇴 Bogotá</option>
                      <option value="Medellín">🇨🇴 Medellín</option>
                      <option value="Manizales">🇨🇴 Manizales</option>
                      <option value="España">🇪🇸 España</option>
                      <option value="Nueva York">🇺🇸 Nueva York</option>
                      <option value="Atlanta">🇺🇸 Atlanta</option>
                    </select>
                  </div>
                  
                  <div className="text-left bg-white/[0.01] border border-white/5 p-4 rounded-xl space-y-3">
                    <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">¿Qué tipo de noticias deseas recibir?</p>
                    <div className="flex flex-wrap gap-4">
                      {["Artículos", "Eventos", "Convocatorias"].map(item => (
                        <label key={item} className="flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={interestsInput.includes(item)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setInterestsInput([...interestsInput, item]);
                              } else {
                                setInterestsInput(interestsInput.filter(i => i !== item));
                              }
                            }}
                            className="accent-accent w-4 h-4 rounded border-white/20 bg-black cursor-pointer"
                          />
                          <span className="text-xs text-white/70 group-hover:text-white transition-colors uppercase tracking-wider font-bold">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={subStatus === "loading" || interestsInput.length === 0}
                    className="bg-accent hover:bg-[#00cc6a] text-black font-extrabold text-[10px] uppercase tracking-[3px] px-8 py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_var(--accent-glow)] hover:shadow-[0_0_30px_var(--accent)] disabled:opacity-50 disabled:shadow-none w-full"
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
