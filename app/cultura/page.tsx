"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CinematicOverlay from "@/components/CinematicOverlay";

const culturales = [
  {
    id: 1,
    title: "Amaranto: De Maleza a Oro",
    subtitle: "Recetas y tradición ancestral",
    description:
      "El amaranto, conocido también como bledo, fue considerado un tesoro por las civilizaciones precolombinas. Hoy resurge como un superalimento lleno de nutrientes y sabor. En este video descubrirás cómo cocinarlo y aprovechar sus propiedades únicas.",
    videoUrl: "https://www.youtube.com/embed/6AVHe0VleNM",
    recetas: [
      {
        nombre: "Alegías de Amaranto",
        ingredientes: [
          "2 tazas de semillas de amaranto",
          "1/2 taza de miel o piloncillo",
          "1 cucharadita de canela",
          "1/2 taza de pasas o frutos secos (opcional)",
        ],
        preparacion:
          "1. Tostar las semillas de amaranto en una sartén seca a fuego medio hasta que empircen a explotar (3-5 min).\n2. Calentar la miel con la canela hasta que esté líquida.\n3. Mezclar las semillas tostadas con la miel caliente.\n4. Formar bolitas o barras con las manos húmedas.\n5. Dejar enfriar y endurecer antes de servir.",
      },
      {
        nombre: "Atole de Amaranto",
        ingredientes: [
          "1/2 taza de semillas de amaranto",
          "4 tazas de leche",
          "1/4 taza de azúcar",
          "1 raja de canela",
          "1 cucharadita de vainilla",
        ],
        preparacion:
          "1. Licuar las semillas de amaranto con 1 taza de leche.\n2. En una olla, calentar las 3 tazas restantes con la canela.\n3. Agregar la mezcla de amaranto y cocinar a fuego bajo.\n4. Añadir el azúcar y la vainilla.\n5. Cocinar revolviendo hasta que espese (10-15 min).\n6. Servir caliente.",
      },
    ],
    image:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800",
  },
];

export default function Cultura() {
  return (
    <>
      <CinematicOverlay />
      <Navbar />

      <main className="relative min-h-screen bg-[#030303] pt-32 pb-24 px-6 md:px-12 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-4 mb-16">
            <span className="text-accent text-xs uppercase tracking-[5px] font-bold block">
              Cultura & Tradición
            </span>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tight text-white leading-none">
              Raíces y Sabores
            </h1>
            <p className="text-white/40 text-sm max-w-lg mx-auto uppercase tracking-[3px] mt-2">
              Descubre el valor de nuestros ingredientes ancestrales y recetas que conectan pasado y presente
            </p>
          </div>

          {culturales.map((item) => (
            <article
              key={item.id}
              className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md mb-16"
            >
              {/* Hero Image */}
              <div className="relative aspect-[21/9] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <span className="text-accent text-[10px] uppercase tracking-[4px] font-bold block mb-2">
                    {item.subtitle}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-wide">
                    {item.title}
                  </h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 md:p-12 space-y-10">
                <p className="text-white/60 text-sm leading-relaxed max-w-3xl">
                  {item.description}
                </p>

                {/* Video Embed */}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10">
                  <iframe
                    src={item.videoUrl}
                    title={item.title}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* Recetas */}
                <div className="space-y-8">
                  <h3 className="text-accent text-xs uppercase tracking-[4px] font-bold">
                    Recetas
                  </h3>

                  <div className="grid md:grid-cols-2 gap-8">
                    {item.recetas.map((receta, idx) => (
                      <div
                        key={idx}
                        className="bg-white/[0.02] border border-white/5 rounded-xl p-6 md:p-8 space-y-4"
                      >
                        <h4 className="text-white text-lg font-bold uppercase tracking-wide">
                          {receta.nombre}
                        </h4>

                        <div className="space-y-2">
                          <span className="text-accent text-[9px] uppercase tracking-[3px] font-bold block">
                            Ingredientes
                          </span>
                          <ul className="text-white/50 text-xs space-y-1">
                            {receta.ingredientes.map((ing, i) => (
                              <li key={i}>• {ing}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <span className="text-accent text-[9px] uppercase tracking-[3px] font-bold block">
                            Preparación
                          </span>
                          <p className="text-white/50 text-xs leading-relaxed whitespace-pre-line">
                            {receta.preparacion}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
