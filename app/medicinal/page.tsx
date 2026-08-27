"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CinematicOverlay from "@/components/CinematicOverlay";
import { useState } from "react";

interface Planta {
  id: number;
  nombre: string;
  nombreCientifico: string;
  alias: string[];
  descripcion: string;
  imagen: string;
  videoUrl?: string;
  pdfUrl?: string;
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
        {
          "": "Colocar las partes de la planta en el agua hirviendo y dejar reposar o hervir a fuego bajo durante 10-15 minutos.",
        },
        "Retirar del fuego y filtrar la infusión.",
        "Servir y consumir según la recomendación específica.",
      ].filter((p) => typeof p === "string") as string[],
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
  const planta = plantas.find((p) => p.id === plantaActiva) || plantas[0];

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
