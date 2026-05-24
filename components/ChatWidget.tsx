"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "¡Hola! 🎬 Soy el **Asistente Matrix**. Estoy aquí para asesorarte en tiempo real sobre nuestros servicios cinematográficos, de fotografía o video, guiarte sobre cómo enviarnos una propuesta o contarte sobre el Blog y Newsletter. ¿Cuál es tu nombre?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Añadir mensaje del usuario al chat
    const updatedMessages = [...messages, { role: "user", content: userMessage } as Message];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Filtrar el sistema de mensajes para enviarle a la API solo lo que necesita (historial)
      const chatHistory = updatedMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });

      const data = await response.json();

      if (response.ok && data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "🎬 Lo siento mucho, experimenté una pequeña interferencia técnica en mis carretes. ¿Podrías volver a preguntarme?",
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "🎬 Ocurrió un error de red. Por favor, revisa tu conexión e inténtalo de nuevo.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Convertir negritas básicas de markdown (**texto**) a negritas HTML
  const formatMessage = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="text-[#00ff87] font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* 1. Burbuja Flotante de Chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-[#030303] border-2 border-[#00ff87] text-white flex items-center justify-center shadow-[0_0_20px_rgba(0,255,135,0.4)] hover:shadow-[0_0_35px_rgba(0,255,135,0.6)] transition-all duration-300 hover:scale-105 cursor-pointer relative group"
          aria-label="Abrir chat con IA"
        >
          <span className="text-2xl animate-pulse">🎬</span>
          {/* Glowing Pulse Halo */}
          <div className="absolute -inset-1 rounded-full border border-[#00ff87]/30 animate-ping pointer-events-none" />
          {/* Tooltip */}
          <div className="absolute right-20 bg-[#0a0a0a]/90 border border-white/10 px-4 py-2 text-xs uppercase tracking-wider font-extrabold text-[#00ff87] whitespace-nowrap rounded-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none backdrop-blur-md">
            Asistente Matrix
          </div>
        </button>
      )}

      {/* 2. Ventana de Chat Expandida */}
      {isOpen && (
        <div className="w-[360px] md:w-[400px] h-[520px] bg-[#0c0c0c]/90 border border-white/10 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(0,255,135,0.1)] flex flex-col overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
          
          {/* Cabecera del Chat */}
          <div className="bg-white/[0.02] border-b border-white/5 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-[#00ff87] flex items-center justify-center bg-[#00ff87]/5">
                <span className="text-sm">🤖</span>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-[2px] font-black text-white">
                  Asistente Matrix
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00ff87] animate-pulse" />
                  <span className="text-[9px] uppercase tracking-widest text-[#00ff87] font-bold">
                    IA Activa
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/40 hover:text-white text-lg p-1 transition-colors cursor-pointer"
              aria-label="Cerrar chat"
            >
              ✕
            </button>
          </div>

          {/* Área de Mensajes */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-3 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#00ff87] text-black font-semibold rounded-br-none shadow-[0_0_15px_rgba(0,255,135,0.2)]"
                      : "bg-white/[0.03] border border-white/5 text-white/90 rounded-bl-none"
                  }`}
                  style={{ whiteSpace: "pre-line" }}
                >
                  {formatMessage(msg.content)}
                </div>
              </div>
            ))}

            {/* Animación "Escribiendo..." */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/[0.03] border border-white/5 text-white/50 rounded-xl rounded-bl-none px-4 py-3 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00ff87] animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00ff87] animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00ff87] animate-bounce" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Formulario de Entrada */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-white/5 bg-white/[0.01] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregúntame algo sobre Matrix..."
              className="flex-1 bg-transparent border border-white/10 focus:border-[#00ff87]/50 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none transition-colors"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`w-9 h-9 rounded-lg border border-[#00ff87] text-[#00ff87] flex items-center justify-center transition-all duration-300 ${
                isLoading || !input.trim()
                  ? "border-white/10 text-white/20 cursor-not-allowed"
                  : "bg-[#00ff87]/5 hover:bg-[#00ff87] hover:text-black cursor-pointer shadow-[0_0_10px_rgba(0,255,135,0.2)]"
              }`}
            >
              ➔
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
