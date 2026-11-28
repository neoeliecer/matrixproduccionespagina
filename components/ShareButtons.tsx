"use client";

import { useEffect, useState } from "react";

interface ShareButtonsProps {
  /** Título del artículo (o contenido) a compartir */
  title: string;
  /** Mensaje de texto que acompaña al enlace */
  message?: string;
  /** Tamaño compacto para la barra superior */
  compact?: boolean;
  /** Callback para mostrar un aviso breve (ej: "Enlace copiado") */
  onNotice?: (msg: string) => void;
}

/**
 * Botones de compartir: WhatsApp, Facebook, Instagram, X/Twitter y copiar enlace.
 * Instagram no tiene URL pública de compartir: se usa el compartir nativo del
 * móvil (si existe) o se copia el enlace y se abre Instagram para pegarlo.
 */
export default function ShareButtons({
  title,
  message,
  compact = false,
  onNotice,
}: ShareButtonsProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.origin + "/blog?post=" + encodeURIComponent(title));
    }
  }, [title]);

  const fullMessage =
    message || `Mira este artículo de Matrix Producciones: "${title}"`;
  const btnSize = compact ? "px-3 py-2 text-[9px]" : "px-4 py-2.5 text-[10px]";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      onNotice?.("📋 Enlace copiado al portapapeles");
      return true;
    } catch {
      onNotice?.("❌ No se pudo copiar el enlace");
      return false;
    }
  };

  const handleInstagram = async () => {
    // En móvil: compartir nativo (incluye Instagram y otras apps)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: fullMessage, url });
        return;
      } catch {
        // El usuario canceló o falló: continuamos con el flujo manual
      }
    }
    // Escritorio: copiar el enlace y abrir Instagram para pegarlo
    const copied = await copyLink();
    if (copied) {
      window.open("https://www.instagram.com/", "_blank", "noopener");
      onNotice?.("📸 Enlace copiado — pégalo en tu historia de Instagram");
    }
  };

  const baseClass = `flex items-center gap-2 border ${btnSize} rounded uppercase font-extrabold tracking-[2px] transition-all duration-300 cursor-pointer`;

  return (
    <div className="flex flex-wrap gap-3">
      {/* WhatsApp */}
      <a
        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
          `${fullMessage} ${url}`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-black border-[#25D366]/30 hover:border-[#25D366] shadow-[0_0_15px_rgba(37,211,102,0.05)] hover:shadow-[0_0_15px_rgba(37,211,102,0.2)]`}
      >
        💬 WhatsApp
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} bg-[#1877F2]/10 hover:bg-[#1877F2] text-[#1877F2] hover:text-white border-[#1877F2]/30 hover:border-[#1877F2] shadow-[0_0_15px_rgba(24,119,242,0.05)] hover:shadow-[0_0_15px_rgba(24,119,242,0.2)]`}
      >
        🔵 Facebook
      </a>

      {/* Instagram */}
      <button
        type="button"
        onClick={handleInstagram}
        className={`${baseClass} bg-[#E1306C]/10 hover:bg-[#E1306C] text-[#E1306C] hover:text-white border-[#E1306C]/30 hover:border-[#E1306C] shadow-[0_0_15px_rgba(225,48,108,0.05)] hover:shadow-[0_0_15px_rgba(225,48,108,0.25)]`}
      >
        📸 Instagram
      </button>

      {/* Twitter / X */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
          fullMessage
        )}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} bg-white/5 hover:bg-white text-white hover:text-black border-white/10 hover:border-white`}
      >
        🐦 Twitter / X
      </a>

      {/* Copiar enlace */}
      <button
        type="button"
        onClick={copyLink}
        className={`${baseClass} bg-accent/10 hover:bg-accent text-accent hover:text-black border-accent/20 hover:border-accent shadow-[0_0_15px_rgba(0,255,136,0.05)] hover:shadow-[0_0_15px_var(--accent-glow)]`}
      >
        🔗 Copiar Enlace
      </button>
    </div>
  );
}
