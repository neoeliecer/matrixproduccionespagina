"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CinematicOverlay from "@/components/CinematicOverlay";

export default function Servicios() {
  const services = [
    {
      title: "Producción de Cine Documental",
      icon: "🎥",
      desc: "Creamos producciones cinematográficas y documentales de alta calidad con un enfoque en historias reales, de impacto social, humano y medioambiental.",
      features: ["Guion cinematográfico", "Grabación 4K/Cine", "Dirección creativa profesional"],
    },
    {
      title: "Dirección Creativa & Guion",
      icon: "💡",
      desc: "Transformamos ideas abstractas en guiones sólidos y conceptos visuales memorables que conectan profundamente con el público.",
      features: ["Desarrollo de conceptos", "Estructura narrativa", "Storyboard y previsualización"],
    },
    {
      title: "Postproducción & Color",
      icon: "🎞️",
      desc: "Damos el toque final a tus proyectos con edición cinematográfica fluida, corrección de color atmosférica y diseño de sonido de alta gama.",
      features: ["Edición de video avanzada", "Color Grading cinematográfico", "Diseño de sonido e instrumentalización"],
    },
    {
      title: "Proyectos de Impacto Social",
      icon: "🌍",
      desc: "Especialidad en consultoría y realización de campañas visuales para fundaciones, ONGs y marcas con propósito ecológico o social.",
      features: ["Narrativas de cambio", "Estrategia de distribución", "Documentales medioambientales"],
    },
  ];

  return (
    <>
      <CinematicOverlay />
      <Navbar />

      <main className="relative min-h-screen bg-[#030303] pt-32 pb-24 px-6 md:px-12 overflow-hidden">
        {/* Neon glowing aura */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-4 mb-20">
            <span className="text-accent text-xs uppercase tracking-[5px] font-bold block">
              Experiencias Visuales De Alto Impacto
            </span>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight text-white leading-none">
              Servicios
            </h1>
            <p className="text-white/40 text-sm max-w-md mx-auto uppercase tracking-[3px] mt-2">
              Transformamos ideas en legados inspiradores
            </p>
          </div>

          {/* Services Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white/[0.01] border border-white/5 p-8 md:p-12 rounded-2xl backdrop-blur-md hover:border-accent/30 hover:bg-white/[0.02] transition-all duration-500 flex flex-col justify-between group shadow-2xl relative"
              >
                <div className="space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-accent/5 border border-accent/10 flex items-center justify-center text-3xl transition-transform duration-500 group-hover:scale-110 group-hover:bg-accent/10 group-hover:border-accent/20 group-hover:shadow-[0_0_20px_var(--accent-glow)]">
                    {service.icon}
                  </div>

                  <h2 className="text-2xl md:text-3xl font-extrabold uppercase text-white tracking-wide transition-colors group-hover:text-accent">
                    {service.title}
                  </h2>

                  <p className="text-white/50 text-sm leading-relaxed font-light">
                    {service.desc}
                  </p>

                  <ul className="space-y-2 pt-4">
                    {service.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-3 text-xs text-white/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <a
                    href="/contacto"
                    className="inline-flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[3px] text-accent group-hover:text-white transition-colors"
                  >
                    Cotizar Servicio <span className="transition-transform group-hover:translate-x-1">→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
