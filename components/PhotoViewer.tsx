"use client";

import { useState, useEffect } from "react";

interface PhotoViewerProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export default function PhotoViewer({ images, initialIndex, onClose }: PhotoViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentImage = images[currentIndex];

  useEffect(() => {
    // Escuchar teclas del teclado para navegar y cerrar
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === " ") {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, images.length]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        handleNext();
      }, 2500); // Cambia de foto cada 2.5 segundos
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentIndex, images.length]);

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Bucle al inicio
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(images.length - 1); // Bucle al final
    }
  };

  // Cloudinary: force download by appending fl_attachment
  const getDownloadUrl = (url: string) => {
    if (url.includes("res.cloudinary.com")) {
      const parts = url.split("/upload/");
      return `${parts[0]}/upload/fl_attachment/${parts[1]}`;
    }
    return url;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Mira esta foto en Matrix Producciones",
          url: window.location.href,
        });
      } catch (err) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
      {/* Botón Cerrar (Arriba Derecha) */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 md:top-10 md:right-10 text-white hover:text-[#00ff87] bg-black/50 border border-white/20 hover:border-[#00ff87] rounded-full w-14 h-14 flex items-center justify-center transition-all z-[10000] shadow-[0_0_20px_rgba(0,0,0,0.8)]"
        title="Cerrar (Esc)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      {/* Flecha Izquierda */}
      {images.length > 1 && (
        <button 
          onClick={handlePrev}
          className="absolute left-2 md:left-10 text-white hover:text-[#00ff87] bg-black/50 border border-white/20 hover:border-[#00ff87] rounded-full w-14 h-14 md:w-20 md:h-20 flex items-center justify-center transition-all z-[10000] shadow-[0_0_20px_rgba(0,0,0,0.8)]"
          title="Anterior (Flecha Izquierda)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
      )}

      {/* Imagen Principal */}
      <div className="relative max-w-[90vw] max-h-[80vh] w-full flex items-center justify-center px-0 md:px-24 mt-8 md:mt-0">
        <img 
          key={currentImage} // Force re-render for animation
          src={currentImage} 
          alt={`Foto ${currentIndex + 1} de ${images.length}`} 
          className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-[0_0_50px_rgba(0,255,135,0.15)] animate-fade-in"
        />
        <div className="absolute -top-10 md:top-4 left-4 md:-left-8 bg-black/80 px-4 py-2 rounded-full text-white/80 text-sm font-black tracking-widest backdrop-blur-md border border-white/20 z-[10000]">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Flecha Derecha */}
      {images.length > 1 && (
        <button 
          onClick={handleNext}
          className="absolute right-2 md:right-10 text-white hover:text-[#00ff87] bg-black/50 border border-white/20 hover:border-[#00ff87] rounded-full w-14 h-14 md:w-20 md:h-20 flex items-center justify-center transition-all z-[10000] shadow-[0_0_20px_rgba(0,0,0,0.8)]"
          title="Siguiente (Flecha Derecha)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      )}

      {/* Botones de Acción */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center relative z-[10000]">
        {images.length > 1 && (
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 border ${isPlaying ? 'border-[#00ff87] text-[#00ff87]' : 'border-white/20 text-white hover:border-[#00ff87]'} font-extrabold text-xs uppercase tracking-[3px] px-8 py-4 rounded backdrop-blur-md transition-all hover:bg-white/5 hover:scale-105 active:scale-95`}
          >
            <span>{isPlaying ? "⏸️ Pausar" : "▶️ Reproducir"}</span>
          </button>
        )}
        
        <a
          href={getDownloadUrl(currentImage)}
          download
          className="flex items-center gap-2 bg-accent hover:bg-[#00cc6a] text-black font-extrabold text-xs uppercase tracking-[3px] px-8 py-4 rounded transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,255,135,0.3)]"
        >
          <span>⬇️ Descargar</span>
        </a>
        
        <button
          onClick={handleShare}
          className="flex items-center gap-2 border border-white/20 hover:border-accent text-white font-extrabold text-xs uppercase tracking-[3px] px-8 py-4 rounded backdrop-blur-md transition-all hover:bg-white/5 hover:scale-105 active:scale-95"
        >
          <span>{copied ? "✅ Copiado" : "🔗 Compartir"}</span>
        </button>
      </div>
    </div>
  );
}
