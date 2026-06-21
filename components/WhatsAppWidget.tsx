"use client";

import { useState } from "react";

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappUrl = "https://wa.me/573174734070?text=Hola%20Matrix%20Producciones%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n.";

  return (
    <div className="fixed bottom-6 left-6 z-[998] font-sans">
      {/* 1. Floating WhatsApp Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-[#030303] border-2 border-[#25D366] text-[#25D366] flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_35px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-105 cursor-pointer relative group"
          aria-label="Contactar por WhatsApp"
        >
          {/* WhatsApp Logo */}
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12.012 2c-5.506 0-9.972 4.466-9.972 9.974 0 1.758.459 3.474 1.33 4.988L2 22l5.19-1.361c1.472.802 3.128 1.223 4.819 1.225h.004c5.505 0 9.97-4.466 9.97-9.974 0-2.67-1.038-5.18-2.92-7.062C17.182 3.002 14.675 2 12.012 2zm5.727 14.167c-.314.88-1.548 1.602-2.15 1.666-.566.06-1.127.276-3.626-.757-3.197-1.32-5.234-4.577-5.394-4.792-.16-.215-1.286-1.713-1.286-3.268 0-1.556.812-2.32 1.1-2.625.289-.304.63-.38.84-.38.16 0 .324.002.464.009.15.007.35-.027.549.452.203.49.697 1.696.757 1.82.06.124.1.267.018.432-.082.166-.124.267-.247.41-.124.143-.262.318-.374.428-.124.12-.255.251-.11.501.144.25.641 1.057 1.378 1.714.95.847 1.75 1.11 2.001 1.235.25.125.396.104.544-.067.149-.172.637-.743.806-.995.17-.253.339-.21.572-.124.232.086 1.477.697 1.732.825.255.127.425.19.488.298.063.108.063.627-.251 1.507z" />
          </svg>

          {/* Glowing Pulse Halo */}
          <div className="absolute -inset-1 rounded-full border border-[#25D366]/30 animate-ping pointer-events-none" />
          
          {/* Tooltip */}
          <div className="absolute left-20 bg-[#0a0a0a]/90 border border-white/10 px-4 py-2 text-xs uppercase tracking-wider font-extrabold text-[#25D366] whitespace-nowrap rounded-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none backdrop-blur-md">
            Escríbenos
          </div>
        </button>
      )}

      {/* 2. Expanded WhatsApp Card */}
      {isOpen && (
        <div className="w-[320px] md:w-[360px] bg-[#0c0c0c]/95 border border-white/10 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(37,211,102,0.15)] flex flex-col overflow-hidden backdrop-blur-xl transition-all duration-300">
          
          {/* Header */}
          <div className="bg-white/[0.02] border-b border-white/5 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Profile Avatar / Styled circle */}
              <div className="w-10 h-10 rounded-full border border-[#25D366] flex items-center justify-center bg-[#25D366]/5 relative">
                <span className="text-lg">🎬</span>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#25D366] border border-[#0c0c0c] rounded-full animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-[2px] font-black text-white">
                  Matrix Producciones
                </h4>
                <span className="text-[9px] uppercase tracking-widest text-[#25D366] font-bold">
                  En línea por WhatsApp
                </span>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/40 hover:text-white text-lg p-1 transition-colors cursor-pointer"
              aria-label="Cerrar ventana"
            >
              ✕
            </button>
          </div>

          {/* Card Body */}
          <div className="p-5 space-y-4">
            <div className="bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-xs leading-relaxed text-white/90">
              <p className="font-light">
                ¡Hola! 🎬 ¿Cómo te podemos ayudar hoy con tu proyecto cinematográfico, documental o publicitario?
              </p>
              <p className="mt-2 text-white/50 text-[10px]">
                Presiona el botón de abajo para iniciar la conversación en WhatsApp de forma directa.
              </p>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-black font-extrabold text-xs uppercase tracking-[3px] py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 shadow-[0_0_15px_rgba(37,211,102,0.2)] hover:shadow-[0_0_25px_rgba(37,211,102,0.4)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              {/* WhatsApp Icon Inside Button */}
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.012 2c-5.506 0-9.972 4.466-9.972 9.974 0 1.758.459 3.474 1.33 4.988L2 22l5.19-1.361c1.472.802 3.128 1.223 4.819 1.225h.004c5.505 0 9.97-4.466 9.97-9.974 0-2.67-1.038-5.18-2.92-7.062C17.182 3.002 14.675 2 12.012 2zm5.727 14.167c-.314.88-1.548 1.602-2.15 1.666-.566.06-1.127.276-3.626-.757-3.197-1.32-5.234-4.577-5.394-4.792-.16-.215-1.286-1.713-1.286-3.268 0-1.556.812-2.32 1.1-2.625.289-.304.63-.38.84-.38.16 0 .324.002.464.009.15.007.35-.027.549.452.203.49.697 1.696.757 1.82.06.124.1.267.018.432-.082.166-.124.267-.247.41-.124.143-.262.318-.374.428-.124.12-.255.251-.11.501.144.25.641 1.057 1.378 1.714.95.847 1.75 1.11 2.001 1.235.25.125.396.104.544-.067.149-.172.637-.743.806-.995.17-.253.339-.21.572-.124.232.086 1.477.697 1.732.825.255.127.425.19.488.298.063.108.063.627-.251 1.507z" />
              </svg>
              <span>Chatear Ahora</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
