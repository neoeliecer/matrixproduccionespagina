"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CinematicOverlay from "@/components/CinematicOverlay";
import { useState } from "react";

interface SeccionInforme {
  id: string;
  titulo: string;
  contenido: string;
}

const informeBledo: SeccionInforme[] = [
  {
    id: "etnobotanico",
    titulo: "1. Introducción y Contexto Etnobotánico",
    contenido: `En la frontera de la neurobiología contemporánea, la revalorización de recursos fitogenéticos ancestrales se presenta como una estrategia imperativa frente al avance de las patologías neurodegenerativas. El bledo (Amaranthus spp.), lejos de ser una simple maleza o un vestigio agrícola, constituye un activo bioquímico de alta densidad para la optimización del metabolismo cerebral.

Etimológicamente, el término Amaranto deriva del griego "amaranthos", "la que no se marchita", una alusión a su persistencia que trasciende lo ornamental para describir la robustez de sus componentes bioactivos.

Especies como A. dubius, A. spinosus y A. caudatus (conocida como "kiwicha" o pequeño gigante) exhiben una resiliencia botánica excepcional, prosperando en suelos salinos y condiciones de estrés hídrico.

Esta planta, pilar nutricional de las civilizaciones maya, azteca e inca, sufrió una persecución sistemática durante la conquista española; Hernán Cortés prohibió su cultivo bajo pena de muerte, intentando erradicar los rituales donde se empleaba la semilla.

Sin embargo, su valor es tal que la NASA lo ha integrado como "cultivo CELSS" en misiones espaciales, validando su capacidad para generar alimento y oxígeno en entornos controlados. Esta tenacidad evolutiva es la manifestación fenotípica de una matriz molecular diseñada para la protección y el alto rendimiento.`,
  },
  {
    id: "bromatologico",
    titulo: "2. Perfil Bromatológico",
    contenido: `Desde la perspectiva de la nutrición funcional, el bledo supera significativamente a los cereales convencionales en densidad de nutrientes, estableciendo un sustrato metabólico ideal para la plasticidad neuronal.

ANÁLISIS PROTEICO Y DIGESTIBILIDAD:
El bledo aporta entre 14 y 18 g de proteína por cada 100 g, destacando por su contenido de lisina, aminoácido esencial limitante en otros granos y crucial para el desarrollo de tejidos cerebrales. Según estándares de la FAO/OMS, el amaranto alcanza un índice de digestibilidad de 75, superando a la leche vacuna (72), la soja (68) y el trigo (60).

MATRIZ MINERAL ESTRATÉGICA:
• Hierro (~9 mg): Presente en concentraciones que triplican las del arroz, fundamental para la oxigenación tisular y la prevención de la hipoxia cerebral.
• Magnesio (>300 mg): Actúa como cofactor en la síntesis proteica y la comunicación neuromuscular, regulando la excitabilidad sináptica.
• Calcio y Fósforo: Esenciales para la estabilidad de las membranas celulares y el metabolismo energético (formación de ATP).

COMPLEJO VITAMÍNICO:
Contiene Vitamina B1 (tiamina), indispensable en el metabolismo de carbohidratos para la obtención de energía neuronal, y Vitamina B9 (ácido fólico), vital para la división celular y la síntesis de ADN, particularmente durante la neurogénesis fetal.

Esta base nutricional robusta actúa como el soporte indispensable para que los compuestos fitoquímicos ejerzan su función de escudo molecular.`,
  },
  {
    id: "fitoquimica",
    titulo: "3. Fitoquímica Avanzada",
    contenido: `La arquitectura molecular del bledo integra metabolitos secundarios que operan como sistemas de defensa contra el estrés oxidativo en el parénquima cerebral.

LÍPIDOS Y ESCUALENO:
El bledo es rico en ácidos grasos poliinsaturados (Omega-3 y Omega-6). Su contenido de escualeno es particularmente notable, actuando como un potente antioxidante que regula el colesterol y previene la peroxidación lipídica en las membranas neuronales.

POLIFENOLES Y FLAVONOIDES:
Se han identificado compuestos de alta actividad farmacológica como la quercetina, kaempferol, rutina y naringenina, además de ácidos fenólicos como el ferúlico, siríngico y p-cumárico. Estos actúan neutralizando radicales libres y modulando las vías de señalización proinflamatorias.

PIGMENTOS ESPECÍFICOS (BETALAÍNAS):
A diferencia de otros vegetales, el bledo sintetiza betacianinas específicas como la amarantina e isoamarantina, junto con betaxantinas. Estos pigmentos no solo reducen el daño oxidativo crónico, sino que poseen propiedades antiinflamatorias que protegen la integridad celular ante estresores ambientales.`,
  },
  {
    id: "evidencia",
    titulo: "4. Evidencia Científica",
    contenido: `La validación técnica del potencial del bledo se sustenta en modelos experimentales de ratones Swiss albino, donde el extracto etanólico de la planta ha demostrado una actividad nootrópica significativa.

MEJORA DE LA FUNCIÓN COGNITIVA:
La administración pre-tratamiento (especialmente en dosis de 500 mg/kg) incrementó la retención inhibitoria (IR) y redujo la latencia de transferencia (TL), evidenciando una optimización en los procesos de consolidación de la memoria y aprendizaje.

MARCADORES ANTIOXIDANTES ENDÓGENOS:
Se ha documentado que el extracto de amaranto reduce marcadores de daño como el malondialdehído, mientras restaura los niveles de enzimas críticas: glutatión (GSH), catalasa y superóxido dismutasa (SOD), fortaleciendo la respuesta antioxidante del organismo.

HALLAZGOS HISTOLÓGICOS:
Los análisis del tejido cerebral tras la suplementación revelaron un aumento en la densidad de las células piramidales en el hipocampo y un fortalecimiento de las conexiones neuronales en la corteza cerebelosa, sugiriendo un efecto promotor de la neurogénesis y la plasticidad sináptica.

REGULACIÓN METABÓLICA:
El bledo modula el metabolismo de la glucosa mediante la regulación de la hexocinasa y la glucosa-6-fosfatasa, lo cual es determinante para el mantenimiento de la homeostasis energética cerebral.`,
  },
  {
    id: "mecanismos",
    titulo: "5. Mecanismos de Acción",
    contenido: `El bledo ejerce su efecto neuroprotector a través de una acción sinérgica que integra la oxigenación celular y la estabilidad de las redes de comunicación.

OPTIMIZACIÓN DE LA OXIGENACIÓN:
La combinación de altas concentraciones de hierro y escualeno garantiza un transporte eficiente de oxígeno, reduciendo la vulnerabilidad neuronal ante procesos de isquemia o fatiga metabólica.

NEUROTRANSMISIÓN Y ESTABILIDAD:
El magnesio del bledo facilita la señalización eléctrica y reduce la excitotoxicidad, protegiendo las sinapsis de la sobreestimulación química.

SINERGIA CON OMEGA-3 Y VITAMINAS LIPOSOLUBLES:
En modelos de bebidas enriquecidas, el uso de harinas de amaranto junto con DHA (ácido docosahexaenoico) potencia el desarrollo neurológico y la salud de la retina. Esta matriz se complementa con la presencia de Vitaminas A, D y K, esenciales para el mantenimiento de la salud cognitiva y la integridad de las estructuras visuales.

SEGURIDAD FARMACOLÓGICA:
Los estudios de toxicidad aguda reportan un perfil de seguridad elevado (LD50 > 2000 mg/kg), lo que permite su recomendación como ingrediente base en regímenes de nutrición funcional a largo plazo.`,
  },
  {
    id: "conclusiones",
    titulo: "6. Conclusiones y Proyecciones",
    contenido: `El bledo se posiciona como una solución estratégica de bajo costo y alto impacto frente a la desnutrición y el deterioro cognitivo. Su viabilidad técnica lo convierte en un candidato ideal para la industrialización alimentaria.

VENTAJAS CRÍTICAS:
El bledo ofrece una capacidad antioxidante superior mediada por amarantina, una mejora histológica demostrada en el hipocampo y una regulación eficiente del metabolismo glucídico.

IMPACTO SOCIAL:
El desarrollo de harinas y bebidas basadas en Amaranthus permite competir con fórmulas internacionales costosas, ofreciendo una alternativa accesible para poblaciones vulnerables en regiones como Perú, México y Venezuela.

RECOMENDACIÓN CLÍNICA:
La integración del bledo en la dieta diaria, ya sea a través de semillas reventadas, harinas o consumo de hojas tiernas, constituye una estrategia preventiva robusta contra el envejecimiento celular prematuro y una herramienta eficaz para la optimización del rendimiento cognitivo en todas las etapas del ciclo vital.`,
  },
];

interface Planta {
  id: number;
  nombre: string;
  nombreCientifico: string;
  alias: string[];
  descripcion: string;
  imagen: string;
  videoUrl?: string;
  usos: {
    titulo: string;
    descripcion: string;
  }[];
  preparacion: {
    titulo: string;
    partes: string[];
    pasos: string[];
  };
  beneficios: string[];
  notas: string[];
}

const plantas: Planta[] = [
  {
    id: 1,
    nombre: "Bledo",
    nombreCientifico: "Amaranthus palmeri",
    alias: ["Pira", "Amaranto", "Quelite"],
    descripcion:
      "El bledo es una planta herbácea de la familia Amaranthaceae, presente en diversas regiones de América. Ha sido utilizada desde tiempos ancestrales tanto como alimento como planta medicinal. Sus hojas, tallos y raíces contienen compuestos beneficiosos para la salud.",
    imagen:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/embed/6AVHe0VleNM",
    usos: [
      {
        titulo: "Memoria y Concentración",
        descripcion:
          "Utilizar las hojas (frescas o secas) para preparar la infusión. Consumir un vaso diario en ayunas. Esto ayuda a estimular las neuronas, mejorar la actividad cerebral, oxigenar el cerebro y aportar vitalidad al cuerpo.",
      },
      {
        titulo: "Eliminación de Parásitos",
        descripcion:
          "Hacer la infusión específicamente con las hojas secas. Consumir en ayunas y nuevamente antes de acostarse.",
      },
      {
        titulo: "Diarrea, Ansiedad, Depresión y Dolores de Garganta",
        descripcion:
          "Preparar la infusión con raíces, tallos y hojas. Consumir tres veces al día. En el caso de irritación de garganta, utilizar esta misma cocción para hacer gárgaras.",
      },
    ],
    preparacion: {
      titulo: "Infusión de Bledo",
      partes: [
        "Raíces",
        "Tallos",
        "Hojas (frescas o secas)",
        "Opcionalmente la espiga de la planta",
      ],
      pasos: [
        "Seleccionar las partes de la planta que deseas utilizar según el propósito (hojas para memoria, hojas secas para parásitos, raíces+tallos+hojas para otros malestares).",
        "Lavar bien las partes de la planta con agua limpia.",
        "Hervir agua en una olla.",
        "Colocar las partes de la planta en el agua hirviendo y dejar reposar o hervir a fuego bajo durante 10-15 minutos.",
        "Retirar del fuego y filtrar la infusión.",
        "Servir y consumir según la recomendación específica.",
      ],
    },
    beneficios: [
      "Estimula la actividad neuronal",
      "Mejora la memoria y concentración",
      "Oxigena el cerebro",
      "Aporta vitalidad al cuerpo",
      "Propiedades antiparasitarias",
      "Ayuda con la ansiedad y depresión",
      "Alivia dolores de garganta",
      "Efecto refrescante",
    ],
    notas: [
      "El sabor es similar al té de cabello o pelusa de choclo (maíz).",
      "Es una bebida muy refrescante.",
      "Se pueden usar hojas frescas o secas.",
      "Incluso la espiga puede utilizarse para el té.",
    ],
  },
];

export default function Medicinal() {
  const [plantaActiva, setPlantaActiva] = useState<number>(1);
  const [seccionAbierta, setSeccionAbierta] = useState<string | null>(null);
  const planta = plantas.find((p) => p.id === plantaActiva) || plantas[0];

  const toggleSeccion = (id: string) => {
    setSeccionAbierta(seccionAbierta === id ? null : id);
  };

  return (
    <>
      <CinematicOverlay />
      <Navbar />

      <main className="relative min-h-screen bg-[#030303] pt-32 pb-24 px-6 md:px-12 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center space-y-4 mb-16">
            <span className="text-emerald-400 text-xs uppercase tracking-[5px] font-bold block">
              Plantas Medicinales
            </span>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tight text-white leading-none">
              Remedios de la Naturaleza
            </h1>
            <p className="text-white/40 text-sm max-w-lg mx-auto uppercase tracking-[3px] mt-2">
              Videos, recetas y documentos sobre el poder curativo de las plantas
            </p>
          </div>

          {/* Planta Info */}
          <article className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md mb-16">
            {/* Hero */}
            <div className="relative aspect-[21/9] overflow-hidden">
              <img
                src={planta.imagen}
                alt={planta.nombre}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex flex-wrap gap-2 mb-3">
                  {planta.alias.map((a) => (
                    <span
                      key={a}
                      className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[9px] uppercase tracking-[2px] font-bold px-3 py-1 rounded"
                    >
                      {a}
                    </span>
                  ))}
                </div>
                <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-wide">
                  {planta.nombre}
                </h2>
                <p className="text-white/40 text-sm italic mt-1">
                  {planta.nombreCientifico}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12 space-y-10">
              <p className="text-white/60 text-sm leading-relaxed max-w-3xl">
                {planta.descripcion}
              </p>

              {/* Video */}
              {planta.videoUrl && (
                <div className="space-y-4">
                  <h3 className="text-emerald-400 text-xs uppercase tracking-[4px] font-bold">
                    Video Informativo
                  </h3>
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10">
                    <iframe
                      src={planta.videoUrl}
                      title={planta.nombre}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Usos Medicinales */}
              <div className="space-y-6">
                <h3 className="text-emerald-400 text-xs uppercase tracking-[4px] font-bold">
                  Usos Medicinales
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {planta.usos.map((uso, idx) => (
                    <div
                      key={idx}
                      className="bg-white/[0.02] border border-white/5 rounded-xl p-6 space-y-3"
                    >
                      <h4 className="text-white text-sm font-bold uppercase tracking-wide">
                        {uso.titulo}
                      </h4>
                      <p className="text-white/50 text-xs leading-relaxed">
                        {uso.descripcion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preparación */}
              <div className="space-y-6">
                <h3 className="text-emerald-400 text-xs uppercase tracking-[4px] font-bold">
                  {planta.preparacion.titulo}
                </h3>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Partes */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 space-y-4">
                    <span className="text-emerald-400 text-[9px] uppercase tracking-[3px] font-bold block">
                      Partes de la Planta
                    </span>
                    <ul className="text-white/50 text-xs space-y-2">
                      {planta.preparacion.partes.map((parte, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5">●</span>
                          {parte}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pasos */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 space-y-4">
                    <span className="text-emerald-400 text-[9px] uppercase tracking-[3px] font-bold block">
                      Preparación
                    </span>
                    <ol className="text-white/50 text-xs space-y-3">
                      {planta.preparacion.pasos.map((paso, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold w-5 h-5 rounded flex items-center justify-center shrink-0">
                            {i + 1}
                          </span>
                          {paso}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>

              {/* Beneficios */}
              <div className="space-y-4">
                <h3 className="text-emerald-400 text-xs uppercase tracking-[4px] font-bold">
                  Beneficios
                </h3>
                <div className="flex flex-wrap gap-2">
                  {planta.beneficios.map((b, i) => (
                    <span
                      key={i}
                      className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400/80 text-[10px] uppercase tracking-[1px] font-bold px-4 py-2 rounded-full"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* INFORME CIENTÍFICO */}
              <div className="space-y-4 mt-12">
                <div className="border-t border-emerald-500/20 pt-8">
                  <span className="text-emerald-400 text-[9px] uppercase tracking-[3px] font-bold block mb-2">
                    Informe de Investigación
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black uppercase text-white tracking-wide">
                    Potencial Neuroprotector y Antioxidante del Bledo
                  </h3>
                  <p className="text-white/40 text-xs mt-2">
                    Amaranthus spp. en la Salud Cerebral
                  </p>
                </div>

                <div className="space-y-3">
                  {informeBledo.map((seccion) => (
                    <div
                      key={seccion.id}
                      className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleSeccion(seccion.id)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
                      >
                        <span className="text-white text-sm font-bold uppercase tracking-wide pr-4">
                          {seccion.titulo}
                        </span>
                        <span className="text-emerald-400 text-lg shrink-0">
                          {seccionAbierta === seccion.id ? "−" : "+"}
                        </span>
                      </button>
                      {seccionAbierta === seccion.id && (
                        <div className="px-5 pb-5 border-t border-white/5">
                          <div className="pt-4 text-white/50 text-xs leading-relaxed whitespace-pre-line">
                            {seccion.contenido}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notas */}
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-6 space-y-3">
                <span className="text-emerald-400 text-[9px] uppercase tracking-[3px] font-bold block">
                  Notas
                </span>
                <ul className="text-white/40 text-xs space-y-1">
                  {planta.notas.map((nota, i) => (
                    <li key={i}>• {nota}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </>
  );
}
