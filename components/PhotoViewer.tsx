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

  const currentImage = images[currentIndex];

  useEffect(() => {
    // Escuchar teclas del teclado para navegar y cerrar
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, images.length]);

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
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
      {/* Botón Cerrar (Arriba Derecha) */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full w-12 h-12 flex items-center justify-center text-xl transition-all z-50"
      >
        ✕
      </button>

      {/* Flecha Izquierda */}
      {images.length > 1 && (
        <button 
          onClick={handlePrev}
          className="absolute left-4 md:left-10 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-2xl transition-all z-50"
        >
          ←
        </button>
      )}

      {/* Imagen Principal */}
      <div className="relative max-w-5xl max-h-[75vh] w-full flex items-center justify-center px-12 md:px-24">
        <img 
          key={currentImage} // Force re-render for animation
          src={currentImage} 
          alt={`Foto ${currentIndex + 1} de ${images.length}`} 
          className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-[0_0_50px_rgba(0,255,135,0.15)] animate-fade-in"
        />
        <div className="absolute top-4 left-4 md:-left-8 bg-black/80 px-3 py-1 rounded-full text-white/50 text-xs font-bold tracking-widest backdrop-blur-md border border-white/10">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Flecha Derecha */}
      {images.length > 1 && (
        <button 
          onClick={handleNext}
          className="absolute right-4 md:right-10 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-2xl transition-all z-50"
        >
          →
        </button>
      )}

      {/* Botones de Acción */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center relative z-50">
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
