"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CinematicOverlay from "@/components/CinematicOverlay";

export default function Tienda() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("success") === "true") {
        setShowSuccessModal(true);
        // Limpiar los parámetros de la URL para que no vuelva a abrirse al recargar
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleWompiPayment = async () => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 9);
    // Generar una referencia única que Wompi reportará al webhook
    const reference = `LIBRO_${timestamp}_${randomString}`;
    const amountInCents = 3000000; // $30,000 COP en centavos
    const currency = "COP";
    const publicKey = "pub_test_zpbUNvVzeFdnAdoK0StdhL3Qs4uEX3v5"; // Corrected sandbox key
    const redirectUrl = "https://matrixproducciones.com/tienda?success=true";
    
    try {
      // 1. Obtener la firma de integridad de forma segura desde el servidor
      const response = await fetch("/api/wompi-signature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reference,
          amountInCents,
          currency,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener la firma de integridad del servidor");
      }

      const { signature } = await response.json();

      // 2. Construir la URL completa del checkout con el parámetro obligatorio 'signature:integrity'
      const wompiUrl = `https://checkout.wompi.co/p/?public-key=${publicKey}&currency=${currency}&amount-in-cents=${amountInCents}&reference=${reference}&signature:integrity=${signature}&redirect-url=${encodeURIComponent(redirectUrl)}`;
      
      // 3. Abrir la pasarela de pagos segura en una nueva pestaña
      window.open(wompiUrl, "_blank");
    } catch (error: any) {
      console.error("Error al iniciar el pago con Wompi:", error);
      alert(`No se pudo iniciar el pago: ${error.message || "Por favor, verifica la configuración de tu Secreto de Integridad."}`);
    }
  };

  const faqs = [
    {
      question: "¿Para quién son estos productos?",
      answer: "Están diseñados para buscadores, estudiantes de arte y personas interesadas en el bienestar, la sanación energética y las grandes preguntas existenciales de la conciencia y la trascendencia sutil.",
    },
    {
      question: "¿Cómo funciona el 'Plazo de Garantía'?",
      answer: "El videolibro de Hotmart cuenta con una Garantía Incondicional de 7 días. Tendrás tu dinero de vuelta al 100% si decides que el contenido no cumple con tus expectativas dentro de ese período.",
    },
    {
      question: "¿Qué es y cómo funciona el Certificado de Conclusión digital?",
      answer: "Al finalizar todas las videolecciones del Videolibro en Hotmart, la plataforma emitirá automáticamente un Certificado Digital de Conclusión a tu nombre.",
    },
    {
      question: "¿Cómo recibiré el Ebook '¿Cómo es el más allá?'?",
      answer: "Inmediatamente después de realizar tu pago seguro con Wompi, nuestro sistema te enviará un correo automatizado de Matrix Producciones con el enlace seguro de descarga directa en formato PDF en menos de un minuto.",
    },
    {
      question: "¿Cómo realizo mi compra de forma segura?",
      answer: "Solo debes hacer clic en el botón del producto que desees. Serás redirigido a las pasarelas oficiales correspondientes (Hotmart para videolecciones, y Wompi para el ebook PDF) donde podrás pagar de forma 100% encriptada y segura.",
    },
  ];

  const modules = [
    {
      num: "01",
      title: "Introducción y Anatomía Sutil",
      desc: "Estudio de las capas invisibles que componen el campo bioenergético humano y su relación directa con la salud física.",
    },
    {
      num: "02",
      title: "Dinámicas Energéticas de Sanación",
      desc: "Cómo fluye la energía vital y métodos prácticos para desbloquear canales obstruidos en ti y en los demás.",
    },
    {
      num: "03",
      title: "Expansión de la Conciencia",
      desc: "Meditaciones y técnicas guiadas orientadas al autoconocimiento, equilibrio espiritual y reconexión interior.",
    },
    {
      num: "04",
      title: "Aplicación Práctica Diaria",
      desc: "Herramientas sencillas de implementar en tu rutina para mantener una vibración elevada, salud integral y bienestar.",
    },
  ];

  return (
    <>
      <CinematicOverlay />
      <Navbar />

      {/* MODAL DE COMPRA EXITOSA (WOMPI WEBHOOK REDIRECT) */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-md w-full bg-[#090909] border border-accent/20 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(0,255,136,0.15)]">
            <div className="w-16 h-16 bg-accent/10 border border-accent/30 rounded-full flex items-center justify-center text-3xl text-accent mx-auto mb-6 shadow-[0_0_20px_var(--accent-glow)] animate-pulse">
              ✅
            </div>
            <h3 className="text-2xl font-black uppercase tracking-wider text-white mb-4">
              ¡Pago Exitoso!
            </h3>
            <p className="text-white/60 text-sm leading-relaxed mb-6 font-light">
              Tu pago ha sido procesado de forma 100% segura a través de **Wompi**.<br/><br/>
              En los próximos 60 segundos recibirás un correo electrónico de **Matrix Producciones** con el enlace de descarga seguro para tu **Ebook PDF: ¿Cómo es el más allá?**.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-accent hover:bg-[#00cc6a] text-black font-extrabold text-xs uppercase tracking-[3px] py-4 rounded-[2px] transition-all duration-300 shadow-[0_0_15px_var(--accent-glow)] cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      <main className="relative min-h-screen bg-[#030303] pt-32 pb-24 px-6 md:px-12 overflow-hidden">
        {/* Neon glowing auras */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* ================= HEADER SECTION ================= */}
          <div className="text-center space-y-4 mb-20">
            <span className="text-accent text-xs uppercase tracking-[5px] font-bold block">
              Tienda Oficial Matrix
            </span>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tight text-white leading-none">
              Catálogo de Obras
            </h1>
            <p className="text-white/40 text-sm max-w-xl mx-auto uppercase tracking-[3px] mt-2">
              Explora formatos interactivos y lecturas profundas de crecimiento personal
            </p>
          </div>

          {/* ================= PRODUCTO 1: VIDEOLIBRO PREMIUM ================= */}
          <div className="grid lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto mb-32">
            
            {/* Product Mockup Representation (Left) */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative group w-full max-w-md aspect-[4/5] bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl p-8 backdrop-blur-md flex flex-col justify-between shadow-2xl hover:border-accent/30 transition-all duration-700">
                {/* Glowing neon halo */}
                <div className="absolute inset-0 rounded-3xl bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl pointer-events-none" />
                
                {/* Badge */}
                <div className="flex justify-between items-center z-10">
                  <span className="text-[9px] uppercase tracking-[3px] font-extrabold text-accent bg-accent/10 border border-accent/20 px-3 py-1.5 rounded-full">
                    Formato Video
                  </span>
                  <span className="text-[10px] text-white/40 font-mono">
                    Videolibro Premium
                  </span>
                </div>

                {/* Mockup Center Design */}
                <div className="my-8 flex flex-col items-center justify-center space-y-6 relative z-10">
                  {/* Glowing play icon representing course */}
                  <div className="w-24 h-24 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-4xl text-accent shadow-[0_0_30px_var(--accent-glow)] group-hover:scale-105 transition-transform duration-500">
                    🎬
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-black uppercase tracking-wider text-white leading-none">
                      Hágase La Luz
                    </h3>
                    <p className="text-white/40 text-[10px] uppercase tracking-[4px]">
                      Expansión de Conciencia
                    </p>
                  </div>
                </div>

                {/* Secure checkout footer */}
                <div className="pt-6 border-t border-white/5 flex justify-between items-center z-10">
                  <div className="text-left">
                    <span className="text-[9px] uppercase tracking-wider text-white/30 block">Garantía total</span>
                    <span className="text-[11px] font-bold text-white/80">🔒 7 Días de Prueba</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase tracking-wider text-white/30 block">Valor único</span>
                    <span className="text-base font-black text-accent drop-shadow-[0_0_10px_var(--accent)]">$30.000 COP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Copy & Buy Card (Right) */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-4">
                <span className="text-accent text-[10px] uppercase tracking-[4px] font-extrabold block">
                  ✨ ESTRENO EXCLUSIVO EN VIDEO
                </span>
                <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-wide leading-none">
                  Hágase La Luz
                </h2>
                <p className="text-white/40 text-sm font-semibold uppercase tracking-[3px]">
                  Innovación en el Autoconocimiento
                </p>
              </div>

              <p className="text-white/60 text-base leading-relaxed font-light">
                Descubre una nueva forma de conectar con la sabiduría de **Barbara Brennan** a través de este exclusivo conjunto de videos interactivos del aclamado libro de **&apos;Hágase la Luz&apos;**. Sumérgete en cada capítulo y experimenta la profundidad de sus enseñanzas de una manera visualmente atractiva, moderna y accesible.
              </p>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-white/70 text-sm font-light">Acceso inmediato desde cualquier dispositivo digital.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-white/70 text-sm font-light">Certificado oficial de conclusión digital emitido por Hotmart.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-white/70 text-sm font-light">Estructura interactiva de videolecciones enfocadas en sanación.</span>
                </div>
              </div>

              {/* Glowing CTA Button Container */}
              <div className="pt-6 flex flex-col sm:flex-row gap-4 items-center">
                <a
                  href="https://pay.hotmart.com/N105742542J?off=bf6t08ug&hotfeature=51"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-accent hover:bg-[#00cc6a] text-black font-extrabold text-xs uppercase tracking-[3px] px-8 py-5 rounded-[2px] transition-all duration-300 text-center shadow-[0_0_20px_var(--accent-glow)] hover:shadow-[0_0_30px_var(--accent)] hover:-translate-y-1 active:translate-y-0 cursor-pointer"
                >
                  Adquirir Ahora en Hotmart
                </a>
                <a
                  href="https://mensajespositivos.hotmart.host/transformacion-personal-hagase-la-luz-ahora-en-formato-video-a7a7abde-ead1-4c11-950c-64520a92841f"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto border border-white/10 hover:border-white text-white font-extrabold text-xs uppercase tracking-[3px] px-8 py-5 rounded-[2px] backdrop-blur-sm transition-all duration-300 hover:bg-white/5 text-center cursor-pointer"
                >
                  Ver Ficha Oficial
                </a>
              </div>
            </div>

          </div>

          {/* ================= PRODUCTO 2: EBOOK PDF - ¿CÓMO ES EL MÁS ALLÁ? ================= */}
          <div className="grid lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto mb-32 border-t border-white/5 pt-32">
            
            {/* Product Copy & Buy Card (Left - Alternating Order) */}
            <div className="lg:col-span-6 space-y-8 order-2 lg:order-1">
              <div className="space-y-4">
                <span className="text-accent text-[10px] uppercase tracking-[4px] font-extrabold block">
                  📖 EBOOK DIGITAL COMPLETO
                </span>
                <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-wide leading-none">
                  ¿Cómo es el más allá?
                </h2>
                <p className="text-white/40 text-sm font-semibold uppercase tracking-[3px]">
                  Un viaje reflexivo sobre la existencia y la trascendencia sutil
                </p>
              </div>

              <p className="text-white/60 text-base leading-relaxed font-light">
                Una obra literaria orientada a explorar una de las interrogantes más profundas y universales del ser humano. Este libro digital recopila perspectivas filosóficas, espirituales y reflexiones reconfortantes que buscan aportar luz, tranquilidad y un entendimiento sereno sobre el plano sutil de la conciencia y la existencia.
              </p>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-white/70 text-sm font-light">Libro en formato PDF de alta resolución optimizado para lectura digital.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-white/70 text-sm font-light">Despliegue y entrega automatizada en tu correo electrónico en segundos.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-white/70 text-sm font-light">Pago seguro certificado nacional a través del ecosistema Wompi.</span>
                </div>
              </div>

              {/* Glowing CTA Button Container for Wompi */}
              <div className="pt-6 flex flex-col sm:flex-row gap-4 items-center">
                <button
                  onClick={handleWompiPayment}
                  className="w-full sm:w-auto bg-accent hover:bg-[#00cc6a] text-black font-extrabold text-xs uppercase tracking-[3px] px-8 py-5 rounded-[2px] transition-all duration-300 text-center shadow-[0_0_20px_var(--accent-glow)] hover:shadow-[0_0_30px_var(--accent)] hover:-translate-y-1 active:translate-y-0 cursor-pointer"
                >
                  Comprar Ebook ($30.000 COP)
                </button>
              </div>
            </div>

            {/* Product Mockup Representation (Right - Alternating Order) */}
            <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
              <div className="relative group w-full max-w-md aspect-[4/5] bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl p-8 backdrop-blur-md flex flex-col justify-between shadow-2xl hover:border-accent/30 transition-all duration-700">
                {/* Glowing neon halo */}
                <div className="absolute inset-0 rounded-3xl bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl pointer-events-none" />
                
                {/* Badge */}
                <div className="flex justify-between items-center z-10">
                  <span className="text-[9px] uppercase tracking-[3px] font-extrabold text-accent bg-accent/10 border border-accent/20 px-3 py-1.5 rounded-full">
                    Ebook PDF
                  </span>
                  <span className="text-[10px] text-white/40 font-mono">
                    Edición Digital
                  </span>
                </div>

                {/* Mockup Center Design */}
                <div className="my-8 flex flex-col items-center justify-center space-y-6 relative z-10">
                  {/* Glowing book icon representing the PDF */}
                  <div className="w-24 h-24 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-4xl text-accent shadow-[0_0_30px_var(--accent-glow)] group-hover:scale-105 transition-transform duration-500">
                    📖
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-black uppercase tracking-wider text-white leading-none">
                      ¿Cómo es el más allá?
                    </h3>
                    <p className="text-white/40 text-[10px] uppercase tracking-[4px]">
                      Trascendencia y Conciencia
                    </p>
                  </div>
                </div>

                {/* Secure checkout footer */}
                <div className="pt-6 border-t border-white/5 flex justify-between items-center z-10">
                  <div className="text-left">
                    <span className="text-[9px] uppercase tracking-wider text-white/30 block">Entrega inmediata</span>
                    <span className="text-[11px] font-bold text-white/80">📧 Envío Automático</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase tracking-wider text-white/30 block">Valor único</span>
                    <span className="text-base font-black text-accent drop-shadow-[0_0_10px_var(--accent)]">$30.000 COP</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ================= MODULES SECTION ================= */}
          <div className="max-w-5xl mx-auto mb-32 space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-4xl font-extrabold uppercase tracking-wider text-white">
                Contenido del Videolibro Hágase La Luz
              </h2>
              <p className="text-white/40 text-xs uppercase tracking-[3px]">
                Estructurado para una asimilación didáctica y espiritual profunda
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {modules.map((module) => (
                <div
                  key={module.num}
                  className="bg-white/[0.01] border border-white/5 p-8 rounded-2xl backdrop-blur-md hover:border-accent/20 transition-colors flex gap-6"
                >
                  <div className="text-3xl font-black text-accent drop-shadow-[0_0_10px_var(--accent-glow)]">
                    {module.num}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold uppercase text-white tracking-wide">
                      {module.title}
                    </h4>
                    <p className="text-white/50 text-sm leading-relaxed font-light">
                      {module.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= MEET THE CREATOR SECTION ================= */}
          <div className="max-w-4xl mx-auto mb-32 bg-white/[0.01] border border-white/5 p-8 md:p-12 rounded-3xl backdrop-blur-md">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Creator Photo */}
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-accent shrink-0 shadow-[0_0_20px_var(--accent-glow)]">
                <img
                  src="/img/equipo/eliecer.jpg"
                  alt="Eliecer Rojas"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150";
                  }}
                />
              </div>

              {/* Creator Biography */}
              <div className="space-y-4 text-center md:text-left">
                <div className="space-y-1">
                  <span className="text-accent text-[9px] uppercase tracking-[4px] font-bold block">
                    Creador del Contenido
                  </span>
                  <h3 className="text-2xl font-black uppercase text-white tracking-wider">
                    Eliecer Rojas
                  </h3>
                </div>
                <p className="text-white/60 text-sm leading-relaxed font-light">
                  Ingeniero electricista y apasionado creador de contenido enfocado en crecimiento personal, espiritualidad, bienestar integral y hábitos saludables. Su trabajo integra de manera única la ciencia de la energía con la medicina natural y el autoconocimiento, ayudando a las personas a elevar su bienestar de forma consciente.
                </p>
                <p className="text-white/40 text-xs leading-relaxed font-light">
                  A través de videolibros y herramientas innovadoras de aprendizaje visual, Eliecer facilita la absorción y aplicación práctica de las enseñanzas de los grandes maestros espirituales de nuestro tiempo.
                </p>
              </div>
            </div>
          </div>

          {/* ================= FAQ SECTION ================= */}
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-4xl font-extrabold uppercase tracking-wider text-white">
                Preguntas Frecuentes
              </h2>
              <p className="text-white/40 text-xs uppercase tracking-[3px]">
                Despeja todas tus dudas antes de iniciar
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.01] transition-colors"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-5 text-left flex justify-between items-center group cursor-pointer"
                    >
                      <span className="text-sm font-bold uppercase tracking-wider text-white group-hover:text-accent transition-colors">
                        {faq.question}
                      </span>
                      <span className="text-accent font-bold transition-transform duration-300">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                    
                    <div
                      className={`transition-all duration-300 overflow-hidden ${
                        isOpen ? "max-h-[300px] border-t border-white/5" : "max-h-0"
                      }`}
                    >
                      <div className="px-6 py-5 text-sm text-white/50 leading-relaxed font-light">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
