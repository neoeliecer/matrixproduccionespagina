"use client";

import { useState } from "react";

interface PhotoViewerProps {
  imageSrc: string;
  onClose: () => void;
}

export default function PhotoViewer({ imageSrc, onClose }: PhotoViewerProps) {
  const [copied, setCopied] = useState(false);

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
        // Fallback
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
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full w-12 h-12 flex items-center justify-center text-xl transition-all"
      >
        ✕
      </button>

      <div className="relative max-w-5xl max-h-[75vh] w-full flex items-center justify-center">
        <img 
          src={imageSrc} 
          alt="Galería fotográfica" 
          className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-[0_0_50px_rgba(0,255,135,0.15)]"
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <a
          href={getDownloadUrl(imageSrc)}
          download
          className="flex items-center gap-2 bg-accent hover:bg-[#00cc6a] text-black font-extrabold text-xs uppercase tracking-[3px] px-8 py-4 rounded transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,255,135,0.3)]"
        >
          <span>⬇️ Descargar Original</span>
        </a>
        
        <button
          onClick={handleShare}
          className="flex items-center gap-2 border border-white/20 hover:border-accent text-white font-extrabold text-xs uppercase tracking-[3px] px-8 py-4 rounded backdrop-blur-md transition-all hover:bg-white/5 hover:scale-105 active:scale-95"
        >
          <span>{copied ? "✅ ¡Copiado!" : "🔗 Compartir"}</span>
        </button>
      </div>
    </div>
  );
}
