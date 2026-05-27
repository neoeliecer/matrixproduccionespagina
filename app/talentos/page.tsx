"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CinematicOverlay from "@/components/CinematicOverlay";

interface Actor {
  id: string;
  name: string;
  role: string;
  image: string;
  tags: string[];
  bio: string;
  fullBio: string;
  height: string;
  eyes: string;
  hair: string;
  skin: string;
  skills: string[];
  experience: string[];
}

export default function Talentos() {
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);

  const actors: Actor[] = [
    {
      id: "kathleen-alvarez",
      name: "Kathleen Álvarez",
      role: "Actriz & Intérprete Dramática",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600",
      tags: ["Dramático", "Teatro Clásico", "Cine Contemporáneo"],
      bio: "Estudiante de último año de la Escuela Cree en Cali. Kathleen destaca por su gran profundidad psicológica y magnetismo emocional delante de la cámara.",
      fullBio: "Kathleen es una actriz emergente con una notable inteligencia actoral. Cursando su último año en la Escuela Cree de Cali, se ha especializado en perfiles dramáticos complejos y de alta exigencia emocional. Su formación integra técnicas de actuación cinematográfica realista, expresión dramática corporal y modulación de voz. Aporta una mirada introspectiva, madura y muy expresiva a cada rol, siendo ideal para protagónicos en cortometrajes y largometrajes contemporáneos.",
      height: "1.65 m",
      eyes: "Café Oscuro",
      hair: "Castaño Oscuro",
      skin: "Trigueña",
      skills: ["Expresión corporal dramática", "Canto y afinación básica", "Voz dramática e impostación", "Danza clásica", "Inglés básico"],
      experience: [
        "Protagónico en Cortometraje 'Hágase la Luz' (Matrix Producciones, 2025)",
        "Obra de Teatro 'El Eco de la Sombra' (Teatro Cree, 2024)",
        "Participación en Fotorreportaje BTS de Cortometraje de Daniel (Cree, 2025)",
        "Monólogos de Realismo Contemporáneo (Auditorio Cree, 2024)"
      ]
    },
    {
      id: "yuly",
      name: "Yuly",
      role: "Actriz & Creadora Escénica",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
      tags: ["Improvisación", "Realismo Mágico", "Cine Social"],
      bio: "Estudiante destacada de último año en la Escuela Cree. Posee un rango interpretativo amplio, soltura y una frescura natural delante de la cámara.",
      fullBio: "Yuly es una intérprete multifacética y creadora escénica de la Escuela Cree. Posee una habilidad innata para la improvisación, la comedia física y las narrativas de impacto social y realismo mágico. Su frescura, carisma y capacidad de reacción inmediata le otorgan una soltura excepcional delante de la cámara. Su versatilidad le permite adaptarse rápidamente a distintos tonos actorales, desde la comedia costumbrista hasta el drama social de alto realismo.",
      height: "1.60 m",
      eyes: "Marrón Claro",
      hair: "Negro / Rizado",
      skin: "Morena",
      skills: ["Improvisación teatral avanzada", "Danza contemporánea y folclórica", "Manejo de acentos y dialectos", "Comedia física y clown", "Liderazgo de dinámicas escénicas"],
      experience: [
        "Co-protagónico en Serie Web 'Cali Creativa' (Matrix Producciones, 2025)",
        "Obra de Formato Corto 'Voces del Viento' (Teatro Cree, 2024)",
        "Performance de Impacto y Conciencia Social en Espacio Público (Cree, 2024)",
        "Lecturas Dramáticas de Literatura Latinoamericana (Biblioteca Departamental, 2024)"
      ]
    },
    {
      id: "scarria",
      name: "Scarria",
      role: "Actor & Intérprete Físico",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600",
      tags: ["Acción", "Drama Físico", "Combate Escénico"],
      bio: "Estudiante de último año de la Escuela Cree. Combina una fuerte presencia escénica con precisión física para narrativas dramáticas intensas.",
      fullBio: "Scarria es un actor emergente con una presencia física y escénica imponente. Su preparación en el último año de la Escuela Cree destaca por un fuerte enfoque en el drama físico y el dominio de la corporalidad. Ha recibido entrenamiento en combate escénico, expresión corporal avanzada y actuación de método para cine de acción e intriga. Su mirada intensa, disciplina física y precisión actoral lo convierten en un perfil sumamente competitivo para producciones dramáticas complejas, thrillers y cortometrajes independientes.",
      height: "1.78 m",
      eyes: "Café",
      hair: "Castaño Oscuro / Corto",
      skin: "Trigueña Clara",
      skills: ["Combate escénico y acrobacia básica", "Expresión corporal y mimo", "Improvisación física", "Entrenamiento de fuerza y destreza", "Inglés intermedio"],
      experience: [
        "Actor Principal en Cortometraje 'El Set' (Escuela Cree, 2025)",
        "Rol Antagónico en la Obra de Teatro 'Luz Inquieta' (Teatro Cree, 2024)",
        "Co-protagónico en Cortometraje de Grado Daniel (Cree, 2025)",
        "Performance Físico de Teatro Físico Contemporáneo (Cali, 2024)"
      ]
    }
  ];

  return (
    <>
      <CinematicOverlay />
      <Navbar />

      <main className="relative min-h-screen bg-[#030303] pt-32 pb-24 px-6 md:px-12 overflow-hidden">
        {/* Glowing background highlights */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* ================= HERO HEADER ================= */}
          <div className="text-center space-y-4 mb-20">
            <span className="text-accent text-xs uppercase tracking-[5px] font-bold block">
              Casting y Talento Local
            </span>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight text-white leading-none">
              Talentos Matrix
            </h1>
            <p className="text-white/40 text-sm max-w-2xl mx-auto uppercase tracking-[3px] mt-2">
              Nuevas actrices y actores de la Escuela Cree listos para rodaje
            </p>
          </div>

          {/* ================= TALENTS GRID ================= */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-32">
            {actors.map((actor) => (
              <article
                key={actor.id}
                className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md hover:border-accent/30 hover:bg-white/[0.02] transition-all duration-500 flex flex-col justify-between group shadow-2xl relative"
              >
                {/* Image Section */}
                <div className="relative aspect-[4/5] overflow-hidden border-b border-white/5">
                  <img
                    src={actor.image}
                    alt={actor.name}
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105 group-hover:brightness-110"
                  />
                  {/* Decorative School Overlay Badge */}
                  <div className="absolute top-4 left-4 bg-black/80 border border-white/10 px-3 py-1 rounded text-[8px] uppercase font-extrabold tracking-widest text-accent">
                    Último Año Cree
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {actor.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-white/5 border border-white/5 px-2.5 py-1 rounded text-[8px] uppercase font-bold tracking-widest text-white/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-2xl font-extrabold uppercase text-white tracking-wide transition-colors group-hover:text-accent">
                        {actor.name}
                      </h2>
                      <p className="text-xs text-accent font-medium tracking-wide">
                        {actor.role}
                      </p>
                    </div>
                    <p className="text-white/50 text-sm leading-relaxed font-light">
                      {actor.bio}
                    </p>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => setSelectedActor(actor)}
                      className="border border-white/10 hover:border-accent bg-white/5 hover:bg-accent hover:text-black font-extrabold text-[9px] uppercase tracking-[3px] py-4 rounded-[2px] w-full transition-all duration-300 text-center block cursor-pointer"
                    >
                      Ver Perfil & Book
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* ================= GENERAL CASTING BANNER ================= */}
          <div className="max-w-4xl mx-auto bg-white/[0.01] border border-white/5 p-8 md:p-12 rounded-3xl backdrop-blur-md text-center space-y-8">
            <div className="space-y-3">
              <span className="text-accent text-[10px] uppercase tracking-[4px] font-bold block">
                Agencia y Producción
              </span>
              <h2 className="text-3xl font-black uppercase text-white tracking-wider">
                ¿Buscas talentos para tu rodaje?
              </h2>
              <p className="text-white/60 text-sm max-w-xl mx-auto leading-relaxed font-light">
                Si eres director, productor o gestionas un casting para comerciales, cortometrajes o televisión, y deseas coordinar pruebas de cámara con los estudiantes de la Escuela Cree, ponte en contacto directo con nosotros.
              </p>
            </div>
            <div className="flex justify-center">
              <a
                href="https://wa.me/573174734070?text=Hola%20Matrix%20Producciones%2C%20estoy%20interesado%20en%20los%20talentos%20de%20la%20Escuela%20Cree%20para%20un%20proyecto."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent hover:bg-[#00cc6a] text-black font-extrabold text-xs uppercase tracking-[3px] px-8 py-5 rounded-[2px] transition-all duration-300 shadow-[0_0_20px_var(--accent-glow)] hover:shadow-[0_0_30px_var(--accent)] hover:-translate-y-1 active:translate-y-0 cursor-pointer"
              >
                Coordinar Casting por WhatsApp
              </a>
            </div>
          </div>

        </div>
      </main>

      {/* ================= STATEFUL DETAILED POPUP MODAL ================= */}
      {selectedActor && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto transition-opacity duration-300 animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-[#080808] border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-10 my-8">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedActor(null)}
              className="absolute top-6 right-6 text-white/50 hover:text-white text-3xl font-light cursor-pointer z-55 transition-colors w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10"
              aria-label="Cerrar modal"
            >
              &times;
            </button>

            <div className="grid md:grid-cols-12 gap-8 items-start">
              
              {/* Profile Image & Specs (Left) */}
              <div className="md:col-span-5 space-y-6">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/10">
                  <img
                    src={selectedActor.image}
                    alt={selectedActor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Physical Specifications */}
                <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl space-y-3">
                  <h4 className="text-[10px] uppercase tracking-[3px] font-bold text-accent">Ficha Física / Specs</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-white/40 block uppercase tracking-wider text-[8px] font-bold">Estatura</span>
                      <span className="text-white/80 font-medium">{selectedActor.height}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block uppercase tracking-wider text-[8px] font-bold">Ojos</span>
                      <span className="text-white/80 font-medium">{selectedActor.eyes}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block uppercase tracking-wider text-[8px] font-bold">Cabello</span>
                      <span className="text-white/80 font-medium">{selectedActor.hair}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block uppercase tracking-wider text-[8px] font-bold">Tez / Piel</span>
                      <span className="text-white/80 font-medium">{selectedActor.skin}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actor Career Details (Right) */}
              <div className="md:col-span-7 space-y-6">
                <div className="space-y-2">
                  <span className="text-accent text-[9px] uppercase tracking-[4px] font-bold block">
                    Escuela Cree · Último Año
                  </span>
                  <h3 className="text-3xl md:text-4xl font-black uppercase text-white tracking-wider">
                    {selectedActor.name}
                  </h3>
                  <p className="text-sm text-accent font-semibold tracking-wide uppercase">
                    {selectedActor.role}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase tracking-[3px] font-bold text-white/50">Perfil Bio</h4>
                  <p className="text-white/70 text-sm leading-relaxed font-light">
                    {selectedActor.fullBio}
                  </p>
                </div>

                {/* Skills */}
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase tracking-[3px] font-bold text-white/50">Especialidades & Habilidades</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedActor.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-white/5 border border-white/5 px-3 py-1.5 rounded-full text-xs text-white/70"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase tracking-[3px] font-bold text-white/50">Proyectos / Experiencia</h4>
                  <ul className="space-y-2 text-xs text-white/60 font-light list-inside list-disc">
                    {selectedActor.experience.map((exp, index) => (
                      <li key={index} className="leading-relaxed">
                        {exp}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-4">
                  <a
                    href={`https://wa.me/573174734070?text=Hola%20Matrix%20Producciones%2C%20estoy%20interesado%20en%20el%20perfil%20de%20${encodeURIComponent(selectedActor.name)}%20de%20la%20Escuela%20Cree%20para%20un%20proyecto.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-accent hover:bg-[#00cc6a] text-black font-extrabold text-[10px] uppercase tracking-[3px] py-4 rounded-[2px] text-center shadow-[0_0_15px_var(--accent-glow)] transition-all duration-300 cursor-pointer"
                  >
                    Cotizar para Proyecto
                  </a>
                  <button
                    onClick={() => setSelectedActor(null)}
                    className="flex-1 border border-white/10 hover:border-white text-white font-extrabold text-[10px] uppercase tracking-[3px] py-4 rounded-[2px] transition-colors cursor-pointer"
                  >
                    Cerrar Book
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
