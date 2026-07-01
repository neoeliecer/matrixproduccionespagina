"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CinematicOverlay from "@/components/CinematicOverlay";
import { useState } from "react";

interface LibraryItem {
  id: string;
  type: "manual" | "libro" | "plantilla";
  title: string;
  excerpt: string;
  icon: string;
  duration: string;
  author: string;
  actionText: string;
  isManual?: boolean;
  manualId?: string;
  downloadUrl?: string;
  isDownload?: boolean;
  isExternal?: boolean;
}

export default function Biblioteca() {
  const [activeCategory, setActiveCategory] = useState<"todos" | "manual" | "libro" | "plantilla">("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedManual, setSelectedManual] = useState<string | null>(null);

  // Checklist interactivo para el manual de Zello
  const [checklist, setChecklist] = useState({
    installed: false,
    channelCreated: false,
    rolesAssigned: false,
    subchannelsCreated: false,
    protocolAgreed: false,
    baseTested: false,
  });

  const toggleChecklist = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const libraryItems: LibraryItem[] = [
    {
      id: "zello-manual",
      type: "manual",
      title: "Manual de Zello para Producción Audiovisual",
      excerpt: "Convierte el celular de tu equipo en un walkie-talkie instantáneo. Aprende a crear canales de comunicación, asignar roles y coordinar el set de rodaje de forma eficiente.",
      icon: "📱",
      duration: "10 min lectura",
      author: "Eliecer / Matrix",
      actionText: "Leer Manual ➔",
      isManual: true,
      manualId: "zello"
    },
    {
      id: "documental-ebook",
      type: "libro",
      title: "Guía del Cine Documental Contemporáneo",
      excerpt: "Un recurso digital que profundiza en la estructuración de narrativas reales, técnicas de entrevista éticas y la producción de documentales con impacto social.",
      icon: "📚",
      duration: "E-book PDF",
      author: "Matrix Producciones",
      actionText: "Descargar E-book ➔",
      downloadUrl: "#",
      isExternal: true
    },
    {
      id: "release-form",
      type: "plantilla",
      title: "Formato de Derechos de Imagen (Release Form)",
      excerpt: "Plantilla legal esencial en PDF/Word para que los participantes y extras firmen su autorización de imagen antes de salir en cámara en tus rodajes.",
      icon: "📝",
      duration: "Formato Word / PDF",
      author: "Legal Matrix",
      actionText: "Descargar Formato ➔",
      downloadUrl: "#",
      isDownload: true
    },
    {
      id: "script-template",
      type: "plantilla",
      title: "Planilla de Continuista / Script",
      excerpt: "Plantilla para llevar el control de escenas, planos, tomas, lentes y detalles técnicos durante el rodaje. Indispensable para organizar la postproducción.",
      icon: "🎞️",
      duration: "Planilla Excel / PDF",
      author: "Producción Matrix",
      actionText: "Descargar Planilla ➔",
      downloadUrl: "#",
      isDownload: true
    }
  ];

  const categories = [
    { id: "todos", name: "Todos los recursos" },
    { id: "manual", name: "Manuales Técnicos" },
    { id: "libro", name: "Libros y E-books" },
    { id: "plantilla", name: "Plantillas de Rodaje" },
  ];

  const filteredItems = libraryItems.filter((item) => {
    const matchesCategory = activeCategory === "todos" || item.type === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <>
      <CinematicOverlay />
      <Navbar />

      <main className="relative min-h-screen bg-[#030303] pt-32 pb-24 px-6 md:px-12 overflow-hidden print:p-0 print:bg-white print:text-black">
        {/* Ambient neon light */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[130px] pointer-events-none print:hidden" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[130px] pointer-events-none print:hidden" />

        <div className="max-w-7xl mx-auto relative z-10 print:max-w-full">
          
          {/* ================= VIEW 1: BIBLIOTECA DASHBOARD ================= */}
          {!selectedManual ? (
            <div className="space-y-16 animate-fade-in print:hidden">
              <div className="text-center space-y-4">
                <span className="text-accent text-xs uppercase tracking-[5px] font-bold block">
                  Conocimiento & Recursos Audiovisuales
                </span>
                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight text-white leading-none">
                  Biblioteca Digital
                </h1>
                <p className="text-white/40 text-sm max-w-xl mx-auto uppercase tracking-[3px] mt-2 leading-relaxed">
                  Manuales, guías recomendadas, libros y plantillas de descarga para elevar el nivel de tus rodajes.
                </p>
              </div>

              {/* Search & Category Filter Section */}
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar manuales, plantillas, libros..."
                    className="w-full bg-white/[0.02] border border-white/10 focus:border-accent/40 rounded-xl px-5 py-4 pl-12 text-sm text-white focus:outline-none transition-colors backdrop-blur-md"
                  />
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 text-base">🔍</span>
                </div>

                <div className="flex flex-wrap gap-3 justify-center">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id as any)}
                      className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-extrabold border transition-all cursor-pointer ${
                        activeCategory === cat.id
                          ? "bg-accent border-accent text-black shadow-[0_0_15px_var(--accent-glow)]"
                          : "bg-white/[0.02] border-white/5 text-white/60 hover:text-white hover:border-white/20"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid Layout of resources */}
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white/[0.01] border border-white/5 p-8 rounded-2xl backdrop-blur-md hover:border-accent/30 hover:bg-white/[0.02] transition-all duration-500 flex flex-col justify-between group shadow-2xl relative"
                    >
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="w-14 h-14 rounded-2xl bg-accent/5 border border-accent/10 flex items-center justify-center text-2xl transition-transform duration-500 group-hover:scale-110 group-hover:bg-accent/10">
                            {item.icon}
                          </div>
                          <span className="text-[10px] uppercase tracking-wider font-bold text-accent px-3 py-1 rounded bg-accent/5 border border-accent/10">
                            {item.type}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <h3 className="text-xl font-extrabold uppercase text-white tracking-wide transition-colors group-hover:text-accent leading-tight">
                            {item.title}
                          </h3>
                          <p className="text-white/50 text-xs leading-relaxed font-light">
                            {item.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="pt-8 border-t border-white/5 mt-6 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-white/40">
                        <span>{item.author} • {item.duration}</span>
                        
                        {item.isManual ? (
                          <button
                            onClick={() => setSelectedManual(item.manualId || null)}
                            className="inline-flex items-center gap-2 text-accent group-hover:text-white transition-colors cursor-pointer"
                          >
                            {item.actionText}
                          </button>
                        ) : (
                          <a
                            href={item.downloadUrl}
                            onClick={(e) => {
                              if (item.downloadUrl === "#") {
                                e.preventDefault();
                                alert("Recurso en preparación. Estará disponible para descargar próximamente.");
                              }
                            }}
                            className="inline-flex items-center gap-2 text-accent group-hover:text-white transition-colors cursor-pointer"
                          >
                            {item.actionText}
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-20 text-white/40 uppercase tracking-widest text-sm">
                    No se encontraron recursos que coincidan con tu búsqueda.
                  </div>
                )}
              </div>
            </div>
          ) : (
            // ================= VIEW 2: INTERACTIVE ZELLO MANUAL =================
            <div className="space-y-12 animate-fade-in print:space-y-6">
              
              {/* Header Navigation Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-6 border-b border-white/10 print:hidden">
                <button
                  onClick={() => setSelectedManual(null)}
                  className="text-accent hover:text-white text-xs uppercase tracking-[3px] font-bold flex items-center gap-2 cursor-pointer transition-colors"
                >
                  ← Volver a la Biblioteca
                </button>

                <div className="flex gap-4">
                  <button
                    onClick={handlePrint}
                    className="border border-white/20 hover:border-white text-white font-bold text-xs uppercase tracking-[3px] px-5 py-3 rounded backdrop-blur-sm transition-all duration-300 hover:bg-white/5 cursor-pointer"
                  >
                    🖨️ Imprimir / PDF
                  </button>
                  <button
                    onClick={() => setSelectedManual(null)}
                    className="bg-accent hover:bg-[#00cc6a] text-black font-extrabold text-xs uppercase tracking-[3px] px-5 py-3 rounded transition-all duration-300 shadow-[0_0_15px_var(--accent-glow)] cursor-pointer"
                  >
                    Finalizar Lectura
                  </button>
                </div>
              </div>

              {/* Split layout: Table of contents + Content */}
              <div className="grid lg:grid-cols-4 gap-12 items-start print:block">
                
                {/* Sticky Sidebar Table of Contents */}
                <aside className="lg:sticky lg:top-32 space-y-6 lg:col-span-1 print:hidden bg-white/[0.01] border border-white/5 p-6 rounded-2xl backdrop-blur-md">
                  <h4 className="text-xs uppercase tracking-[3px] font-black text-white pb-3 border-b border-white/10">
                    Contenido del Manual
                  </h4>
                  <nav className="flex flex-col gap-3 text-[11px] uppercase tracking-wider font-bold text-white/50">
                    <a href="#introduccion" className="hover:text-accent transition-colors">1. Introducción</a>
                    <a href="#instalacion" className="hover:text-accent transition-colors">2. Instalación</a>
                    <a href="#crear-canal" className="hover:text-accent transition-colors">3. Crear Canal</a>
                    <a href="#invitar" className="hover:text-accent transition-colors">4. Invitar Equipo</a>
                    <a href="#roles" className="hover:text-accent transition-colors">5. Roles de Canal</a>
                    <a href="#organizacion" className="hover:text-accent transition-colors">6. Estructura Set</a>
                    <a href="#protocolo" className="hover:text-accent transition-colors">7. Protocolo Set</a>
                    <a href="#tecnico" className="hover:text-accent transition-colors">8. Consejos Técnicos</a>
                    <a href="#cierre" className="hover:text-accent transition-colors">9. Cierre de Canal</a>
                    <a href="#checklist" className="text-accent hover:text-white transition-colors">📋 Checklist de Rodaje</a>
                  </nav>
                </aside>

                {/* Main Content Area */}
                <article className="lg:col-span-3 space-y-12 text-sm leading-relaxed text-white/80 print:text-black print:max-w-full">
                  
                  {/* Manual Title Section */}
                  <div className="space-y-4 border-b border-white/5 pb-8 print:border-black/10">
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wide text-white leading-tight print:text-black">
                      Manual de Zello para Producción Audiovisual
                    </h2>
                    <p className="text-accent text-xs uppercase tracking-[3px] font-bold print:text-black/70">
                      Cómo crear y manejar un canal de comunicación en set para tu equipo de rodaje
                    </p>
                  </div>

                  {/* Section 1: Intro */}
                  <section id="introduccion" className="space-y-4 scroll-mt-32">
                    <h3 className="text-lg font-extrabold uppercase text-white tracking-widest border-l-2 border-accent pl-3 print:text-black print:border-black">
                      1. ¿Qué es Zello y por qué sirve para un rodaje?
                    </h3>
                    <p>
                      Zello convierte cualquier dispositivo celular en un walkie-talkie virtual con tecnología <strong>Push-to-Talk (PTT)</strong>. Presionas un botón en pantalla (o un botón físico mapeado), hablas, y todos los que están sintonizados en tu mismo canal te escuchan al instante sin necesidad de marcar números, timbrar o esperar a que alguien conteste.
                    </p>
                    <p>
                      Para producciones cinematográficas y documentales de <strong>Matrix Producciones</strong>, esto reemplaza la renta de radiocomunicadores tradicionales costosos con el propio celular del equipo mediante redes WiFi o datos móviles.
                    </p>
                    
                    <div className="bg-white/[0.02] border border-white/5 p-5 rounded-xl space-y-3 mt-4 print:bg-black/5 print:border-black/10">
                      <h4 className="text-xs uppercase tracking-wider font-extrabold text-white print:text-black">Ventajas clave en un set:</h4>
                      <ul className="list-disc list-inside space-y-1.5 text-xs text-white/60 print:text-black/80">
                        <li><strong>Comunicación Instantánea:</strong> Sincronización inmediata entre dirección, cámara, sonido, iluminación y producción.</li>
                        <li><strong>Historial de Voz:</strong> Los mensajes quedan grabados; si estabas operando cámara y no escuchaste un llamado, puedes reproducirlo en segundos.</li>
                        <li><strong>Multiplataforma:</strong> Disponible en Android, iOS, y versión de escritorio para el monitoreo general desde el Video Assist.</li>
                      </ul>
                    </div>
                  </section>

                  {/* Section 2: Installation */}
                  <section id="instalacion" className="space-y-4 scroll-mt-32">
                    <h3 className="text-lg font-extrabold uppercase text-white tracking-widest border-l-2 border-accent pl-3 print:text-black print:border-black">
                      2. Instalación y primeros pasos
                    </h3>
                    <ol className="list-decimal list-inside space-y-3">
                      <li>
                        <strong>Descarga la App:</strong> Busca <strong>Zello Walkie Talkie</strong> en Google Play Store (Android) o Apple App Store (iOS).
                      </li>
                      <li>
                        <strong>Registro de Cuentas:</strong> Crea una cuenta de usuario gratis usando un correo o número celular.
                      </li>
                      <li>
                        <strong>Nomenclatura Recomendada:</strong> Para sets ordenados, exige al equipo registrarse con su Rol en la producción. 
                        Ejemplo: <code className="bg-white/5 px-2 py-0.5 rounded text-accent font-mono text-xs print:bg-black/5 print:text-black">director_matrix</code>, <code className="bg-white/5 px-2 py-0.5 rounded text-accent font-mono text-xs print:bg-black/5 print:text-black">camara1_matrix</code>, <code className="bg-white/5 px-2 py-0.5 rounded text-accent font-mono text-xs print:bg-black/5 print:text-black">script_matrix</code>. Esto permite identificar quién habla instantáneamente.
                      </li>
                      <li>
                        <strong className="text-accent print:text-black">IMPORTANTE:</strong> Asegúrate de que todo el equipo instale la aplicación y cree su cuenta <strong>el día previo al rodaje</strong>. Configurar la comunicación en pleno set consume tiempo de producción muy valioso.
                      </li>
                    </ol>
                  </section>

                  {/* Section 3: Create Channel */}
                  <section id="crear-canal" className="space-y-4 scroll-mt-32">
                    <h3 className="text-lg font-extrabold uppercase text-white tracking-widest border-l-2 border-accent pl-3 print:text-black print:border-black">
                      3. Crear el canal del proyecto
                    </h3>
                    <p>El canal es el espacio de comunicación del equipo. Para crearlo:</p>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Abre la aplicación de Zello y desplázate a la pestaña de <strong>Canales</strong>.</li>
                      <li>Presiona el botón circular azul con el símbolo <strong>+</strong> en la esquina inferior.</li>
                      <li>Elige la opción <strong>Crear un nuevo canal</strong>.</li>
                      <li>
                        Define el nombre del canal. Usa nombres claros de proyecto: <code className="bg-white/5 px-2 py-0.5 rounded text-accent font-mono text-xs print:bg-black/5 print:text-black">MATRIX_Proyecto_Rodaje</code>. Evita nombres genéricos como "Rodaje 1" que puedan confundirse si manejas varios proyectos en paralelo.
                      </li>
                      <li>Establece la privacidad como <strong>Privado</strong>. Esto requiere contraseña o aprobación para unirse, protegiendo la confidencialidad de la producción.</li>
                    </ol>
                  </section>

                  {/* Section 4: Invite Team */}
                  <section id="invitar" className="space-y-4 scroll-mt-32">
                    <h3 className="text-lg font-extrabold uppercase text-white tracking-widest border-l-2 border-accent pl-3 print:text-black print:border-black">
                      4. Invitar al equipo de rodaje
                    </h3>
                    <p>Con el canal privado listo, tienes dos vías ágiles de invitar a los integrantes:</p>
                    <ul className="list-disc list-inside space-y-2">
                      <li>
                        <strong>Enlace Directo (Recomendado):</strong> Toca sobre el nombre del canal, selecciona "Compartir enlace del canal" y envíalo mediante el grupo de coordinación en WhatsApp. Al tocar el enlace, se les abrirá la aplicación directamente para ingresar.
                      </li>
                      <li>
                        <strong>Búsqueda Directa:</strong> Agrega a los usuarios escribiendo sus IDs personalizados en Zello.
                      </li>
                      <li>
                        <strong>Mensaje de Bienvenida:</strong> Escribe una directriz breve fija en las opciones del canal que describa el uso del walkie-talkie (ej: "Canal exclusivo para avisos del set y logística").
                      </li>
                    </ul>
                  </section>

                  {/* Section 5: Roles */}
                  <section id="roles" className="space-y-4 scroll-mt-32">
                    <h3 className="text-lg font-extrabold uppercase text-white tracking-widest border-l-2 border-accent pl-3 print:text-black print:border-black">
                      5. Roles del canal: quién habla, quién escucha
                    </h3>
                    <p>
                      Para evitar la superposición de voces y mantener el orden del set, asigna roles de transmisión restringidos dentro de Zello:
                    </p>

                    <div className="overflow-x-auto mt-4 border border-white/5 rounded-xl print:border-black/10">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-white/5 text-white border-b border-white/10 font-extrabold uppercase tracking-wider print:bg-black/5 print:text-black print:border-black/10">
                            <th className="p-4">Rol en Zello</th>
                            <th className="p-4">Capacidades en Canal</th>
                            <th className="p-4">Asignado a (Set Audiovisual)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-white/70 print:divide-black/10 print:text-black/90">
                          <tr>
                            <td className="p-4 font-bold text-white print:text-black">Administrador</td>
                            <td className="p-4">Control total de usuarios, contraseñas y permisos del canal.</td>
                            <td className="p-4">Director de Producción, Productor Ejecutivo.</td>
                          </tr>
                          <tr>
                            <td className="p-4 font-bold text-white print:text-black">Hablar y Escuchar</td>
                            <td className="p-4">Puede transmitir voz y recibir transmisiones instantáneamente.</td>
                            <td className="p-4">Director, Asistente de Dirección (AD), Directores de Fotografía, Arte, Sonido.</td>
                          </tr>
                          <tr>
                            <td className="p-4 font-bold text-white print:text-black">Solo Escuchar</td>
                            <td className="p-4">Recibe y oye todas las instrucciones pero no tiene permiso de hablar en el canal.</td>
                            <td className="p-4">Asistentes de producción, transportadores, maquillaje, vestuario, extras.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>

                  {/* Section 6: Organization */}
                  <section id="organizacion" className="space-y-4 scroll-mt-32">
                    <h3 className="text-lg font-extrabold uppercase text-white tracking-widest border-l-2 border-accent pl-3 print:text-black print:border-black">
                      6. Estructura de canales por departamentos
                    </h3>
                    <p>
                      En producciones grandes de Matrix, te sugerimos segmentar la comunicación en varios canales paralelos para evitar saturación de la frecuencia de audio principal:
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                      <li><code className="bg-white/5 px-2 py-0.5 rounded text-accent font-mono print:bg-black/5 print:text-black">MATRIX_[Proyecto]_General</code>: Coordinación total (anunciar tomas, cortes, pausas, almuerzo).</li>
                      <li><code className="bg-white/5 px-2 py-0.5 rounded text-accent font-mono print:bg-black/5 print:text-black">MATRIX_[Proyecto]_AD</code>: AD coordinando llamados de actores, camerinos, preparación de extras.</li>
                      <li><code className="bg-white/5 px-2 py-0.5 rounded text-accent font-mono print:bg-black/5 print:text-black">MATRIX_[Proyecto]_Logistica</code>: Transporte, catering, locaciones, equipos de carga.</li>
                    </ul>
                  </section>

                  {/* Section 7: Protocol */}
                  <section id="protocolo" className="space-y-4 scroll-mt-32">
                    <h3 className="text-lg font-extrabold uppercase text-white tracking-widest border-l-2 border-accent pl-3 print:text-black print:border-black">
                      7. Protocolo de comunicación en set
                    </h3>
                    <p>
                      Sigue estas directrices para que la comunicación inalámbrica sea ágil e interfiera lo menos posible en el rodaje:
                    </p>
                    <ol className="list-decimal list-inside space-y-2">
                      <li><strong>Espera el tono:</strong> Tras presionar el PTT, espera medio segundo antes de comenzar a hablar para que el inicio de tu mensaje no se corte en el aire.</li>
                      <li><strong>Código corto:</strong> Usa frases concisas. Ejemplo: "Cámara lista", "Sonido listo", "Rodando", "¡Corte!". Evita discusiones largas en canales generales.</li>
                      <li><strong>Monitoreo silencioso:</strong> En el momento exacto del rodaje de la toma, el AD debe indicar silencio absoluto en los canales y los operadores técnicos silenciarán sus terminales o usarán auriculares cerrados.</li>
                    </ol>
                  </section>

                  {/* Section 8: Technical Tips */}
                  <section id="tecnico" className="space-y-4 scroll-mt-32">
                    <h3 className="text-lg font-extrabold uppercase text-white tracking-widest border-l-2 border-accent pl-3 print:text-black print:border-black">
                      8. Consejos técnicos y de hardware
                    </h3>
                    <ul className="list-disc list-inside space-y-2">
                      <li><strong>Baterías:</strong> Zello requiere conexión constante a internet, lo cual gasta batería. Exige baterías externas de respaldo para los roles de coordinación.</li>
                      <li><strong>Manos Libres:</strong> Suministra audífonos con micrófono integrado (manos libres) a camarógrafos, sonidistas e iluminadores que requieran tener las manos libres.</li>
                      <li><strong>Señal celular:</strong> Valida la señal móvil de datos en la locación previo al día de grabación. Si la cobertura en la zona es nula, prepara radiocomunicadores analógicos como plan de contingencia.</li>
                    </ul>
                  </section>

                  {/* Section 9: Closing */}
                  <section id="cierre" className="space-y-4 scroll-mt-32">
                    <h3 className="text-lg font-extrabold uppercase text-white tracking-widest border-l-2 border-accent pl-3 print:text-black print:border-black">
                      9. Cierre del proyecto
                    </h3>
                    <p>
                      Una vez completado el rodaje del proyecto, el Administrador del canal deberá darlo de baja (Eliminar Canal) o desactivarlo para evitar acumular canales en desuso y proteger los datos compartidos.
                    </p>
                  </section>

                  {/* Section 10: Interactive Checklist */}
                  <section id="checklist" className="space-y-6 scroll-mt-32 bg-white/[0.02] border border-white/5 p-8 rounded-2xl backdrop-blur-md print:bg-black/5 print:border-black/10">
                    <div className="space-y-2">
                      <h3 className="text-xl font-extrabold uppercase text-white tracking-widest flex items-center gap-3 print:text-black">
                        <span>📋</span> Checklist Operativo del Día de Rodaje
                      </h3>
                      <p className="text-xs text-white/50 print:text-black/70">
                        Interactúa marcando cada elemento para llevar el control logístico de comunicación directamente en tu dispositivo en el set de filmación.
                      </p>
                    </div>

                    <div className="space-y-4 pt-2">
                      <label className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/[0.02] transition-colors cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={checklist.installed}
                          onChange={() => toggleChecklist("installed")}
                          className="mt-1 w-5 h-5 rounded border-white/10 text-accent bg-transparent focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                        <div>
                          <span className={`text-xs uppercase font-extrabold tracking-wider ${checklist.installed ? "text-accent line-through" : "text-white print:text-black"}`}>
                            App Instalada en el Equipo
                          </span>
                          <p className="text-[11px] text-white/40 mt-1">Todo el personal cuenta con la app de Zello descargada y configurada con sus respectivos nombres y roles en la producción.</p>
                        </div>
                      </label>

                      <label className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/[0.02] transition-colors cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={checklist.channelCreated}
                          onChange={() => toggleChecklist("channelCreated")}
                          className="mt-1 w-5 h-5 rounded border-white/10 text-accent bg-transparent focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                        <div>
                          <span className={`text-xs uppercase font-extrabold tracking-wider ${checklist.channelCreated ? "text-accent line-through" : "text-white print:text-black"}`}>
                            Canal Privado Creado
                          </span>
                          <p className="text-[11px] text-white/40 mt-1">Canal con contraseña y nombre del proyecto definido, protegiendo las comunicaciones del rodaje.</p>
                        </div>
                      </label>

                      <label className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/[0.02] transition-colors cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={checklist.rolesAssigned}
                          onChange={() => toggleChecklist("rolesAssigned")}
                          className="mt-1 w-5 h-5 rounded border-white/10 text-accent bg-transparent focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                        <div>
                          <span className={`text-xs uppercase font-extrabold tracking-wider ${checklist.rolesAssigned ? "text-accent line-through" : "text-white print:text-black"}`}>
                            Roles del Canal Configurados
                          </span>
                          <p className="text-[11px] text-white/40 mt-1">Asistentes configurados como 'Solo escuchar' y cabezas de área habilitadas para transmitir.</p>
                        </div>
                      </label>

                      <label className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/[0.02] transition-colors cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={checklist.subchannelsCreated}
                          onChange={() => toggleChecklist("subchannelsCreated")}
                          className="mt-1 w-5 h-5 rounded border-white/10 text-accent bg-transparent focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                        <div>
                          <span className={`text-xs uppercase font-extrabold tracking-wider ${checklist.subchannelsCreated ? "text-accent line-through" : "text-white print:text-black"}`}>
                            Subcanales Segmentados
                          </span>
                          <p className="text-[11px] text-white/40 mt-1">Canales creados por separado para Dirección (AD) y Logística/Producción en caso de equipos numerosos.</p>
                        </div>
                      </label>

                      <label className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/[0.02] transition-colors cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={checklist.protocolAgreed}
                          onChange={() => toggleChecklist("protocolAgreed")}
                          className="mt-1 w-5 h-5 rounded border-white/10 text-accent bg-transparent focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                        <div>
                          <span className={`text-xs uppercase font-extrabold tracking-wider ${checklist.protocolAgreed ? "text-accent line-through" : "text-white print:text-black"}`}>
                            Protocolo y Códigos Explicados
                          </span>
                          <p className="text-[11px] text-white/40 mt-1">El equipo conoce la instrucción de 'Silencio en canal' en las tomas y la espera de medio segundo tras presionar el PTT.</p>
                        </div>
                      </label>

                      <label className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/[0.02] transition-colors cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={checklist.baseTested}
                          onChange={() => toggleChecklist("baseTested")}
                          className="mt-1 w-5 h-5 rounded border-white/10 text-accent bg-transparent focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                        <div>
                          <span className={`text-xs uppercase font-extrabold tracking-wider ${checklist.baseTested ? "text-accent line-through" : "text-white print:text-black"}`}>
                            Pruebas de Conectividad en Locación
                          </span>
                          <p className="text-[11px] text-white/40 mt-1">Validación de cobertura de red o datos celulares en el set de grabación antes del inicio de rodaje.</p>
                        </div>
                      </label>
                    </div>
                  </section>
                </article>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
