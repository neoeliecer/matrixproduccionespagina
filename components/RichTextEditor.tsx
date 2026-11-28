"use client";

import { useEffect, useRef, useState } from "react";
import type { ClipboardEvent } from "react";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** ¿El texto contiene etiquetas HTML? */
const hasHtml = (s: string) => /<[a-z][\s\S]*>/i.test(s);

/** Quita todas las etiquetas (para validar que hay texto real). */
export const stripHtml = (html: string) =>
  (html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

/** Convierte texto plano (con saltos de línea) a HTML para el editor. */
export const textToHtml = (text: string): string => {
  if (!text) return "";
  if (hasHtml(text)) return text;
  return text
    .split(/\n{2,}/)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
};

interface RichTextEditorProps {
  /** Contenido en HTML (o texto plano, que se convertirá automáticamente). */
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

/**
 * Editor de texto enriquecido ligero (sin dependencias):
 * negrita, cursiva, subrayado, tachado, tipografía, tamaño, color,
 * títulos, citas, listas, alineación y enlaces.
 */
export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Escribe aquí...",
  minHeight = 300,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);
  const lastEmitted = useRef<string | null>(null);
  const [active, setActive] = useState<Record<string, boolean>>({});

  // Sincroniza cuando el valor cambia desde fuera (IA, apertura del modal...)
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const incoming = textToHtml(value || "");
    if (incoming === lastEmitted.current) return;
    lastEmitted.current = incoming;
    if (el.innerHTML !== incoming) el.innerHTML = incoming;
    if (incoming !== (value || "")) onChange(incoming);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Resalta los botones activos (negrita, listas, etc.)
  useEffect(() => {
    const onSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || !editorRef.current?.contains(sel.anchorNode)) return;
      try {
        setActive({
          bold: document.queryCommandState("bold"),
          italic: document.queryCommandState("italic"),
          underline: document.queryCommandState("underline"),
          strikeThrough: document.queryCommandState("strikeThrough"),
          insertUnorderedList: document.queryCommandState("insertUnorderedList"),
          insertOrderedList: document.queryCommandState("insertOrderedList"),
        });
      } catch {
        /* noop */
      }
    };
    document.addEventListener("selectionchange", onSelectionChange);
    return () => document.removeEventListener("selectionchange", onSelectionChange);
  }, []);

  const emit = () => {
    const el = editorRef.current;
    if (!el) return;
    lastEmitted.current = el.innerHTML;
    onChange(el.innerHTML);
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const ensureSelection = () => {
    const el = editorRef.current;
    if (!el) return;
    const sel = window.getSelection();
    const inEditor = !!sel && sel.rangeCount > 0 && el.contains(sel.anchorNode);
    el.focus();
    if (!inEditor && savedRange.current) {
      const s = window.getSelection();
      if (s) {
        s.removeAllRanges();
        s.addRange(savedRange.current);
      }
    }
  };

  const exec = (command: string, arg?: string) => {
    ensureSelection();
    try {
      document.execCommand("styleWithCSS", false, "true");
    } catch {
      /* noop */
    }
    document.execCommand(command, false, arg);
    emit();
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    emit();
  };

  const addLink = () => {
    const url = window.prompt("URL del enlace:");
    if (url) exec("createLink", url);
  };

  const btnClass = (isActive: boolean) =>
    `px-2 py-1.5 rounded border text-[10px] font-black uppercase tracking-widest transition-colors ${
      isActive
        ? "border-accent text-accent bg-accent/10"
        : "border-transparent text-white/50 hover:text-accent hover:bg-white/5"
    }`;

  const selectClass =
    "bg-black/40 border border-white/10 text-white/70 text-[10px] font-bold uppercase tracking-widest rounded px-1.5 py-1.5 focus:outline-none focus:border-accent cursor-pointer";

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-white/[0.02]">
      {/* Barra de herramientas */}
      <div className="flex flex-wrap items-center gap-1 border-b border-white/10 bg-white/[0.03] px-2 py-2">
        <button type="button" title="Negrita" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("bold")} className={btnClass(active.bold)}>
          <b>B</b>
        </button>
        <button type="button" title="Cursiva" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("italic")} className={btnClass(active.italic)}>
          <i>I</i>
        </button>
        <button type="button" title="Subrayado" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("underline")} className={btnClass(active.underline)}>
          <u>U</u>
        </button>
        <button type="button" title="Tachado" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("strikeThrough")} className={btnClass(active.strikeThrough)}>
          <s>S</s>
        </button>

        <span className="w-px h-4 bg-white/10 mx-1" />

        <select
          title="Tipografía"
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) exec("fontName", e.target.value);
            e.target.selectedIndex = 0;
          }}
          className={selectClass}
        >
          <option value="" className="bg-[#030303]">Tipografía</option>
          <option value="Outfit" className="bg-[#030303]">Outfit</option>
          <option value="Inter" className="bg-[#030303]">Inter</option>
          <option value="Georgia" className="bg-[#030303]">Georgia</option>
          <option value="Arial" className="bg-[#030303]">Arial</option>
          <option value="Courier New" className="bg-[#030303]">Monoespaciada</option>
        </select>

        <select
          title="Tamaño"
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) exec("fontSize", e.target.value);
            e.target.selectedIndex = 0;
          }}
          className={selectClass}
        >
          <option value="" className="bg-[#030303]">Tamaño</option>
          <option value="2" className="bg-[#030303]">Pequeño</option>
          <option value="3" className="bg-[#030303]">Normal</option>
          <option value="4" className="bg-[#030303]">Grande</option>
          <option value="5" className="bg-[#030303]">Enorme</option>
        </select>

        <input
          type="color"
          title="Color del texto"
          defaultValue="#ffffff"
          onChange={(e) => exec("foreColor", e.target.value)}
          className="w-7 h-7 bg-transparent border border-white/10 rounded cursor-pointer p-0.5"
        />

        <span className="w-px h-4 bg-white/10 mx-1" />

        <button type="button" title="Párrafo" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("formatBlock", "<p>")} className={btnClass(false)}>
          Texto
        </button>
        <button type="button" title="Título" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("formatBlock", "<h2>")} className={btnClass(false)}>
          H2
        </button>
        <button type="button" title="Subtítulo" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("formatBlock", "<h3>")} className={btnClass(false)}>
          H3
        </button>
        <button type="button" title="Cita" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("formatBlock", "<blockquote>")} className={btnClass(false)}>
          Cita
        </button>

        <span className="w-px h-4 bg-white/10 mx-1" />

        <button type="button" title="Lista con viñetas" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("insertUnorderedList")} className={btnClass(active.insertUnorderedList)}>
          • Lista
        </button>
        <button type="button" title="Lista numerada" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("insertOrderedList")} className={btnClass(active.insertOrderedList)}>
          1. Lista
        </button>

        <span className="w-px h-4 bg-white/10 mx-1" />

        <button type="button" title="Alinear a la izquierda" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("justifyLeft")} className={btnClass(false)}>
          Izq
        </button>
        <button type="button" title="Centrar" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("justifyCenter")} className={btnClass(false)}>
          Centro
        </button>
        <button type="button" title="Alinear a la derecha" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("justifyRight")} className={btnClass(false)}>
          Der
        </button>

        <span className="w-px h-4 bg-white/10 mx-1" />

        <button type="button" title="Insertar enlace" onMouseDown={(e) => e.preventDefault()} onClick={addLink} className={btnClass(false)}>
          Enlace
        </button>
        <button type="button" title="Limpiar formato" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("removeFormat")} className={btnClass(false)}>
          Limpiar
        </button>
      </div>

      {/* Área de escritura */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={() => {
          saveSelection();
          emit();
        }}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        className="rich-editor px-4 py-3 text-white text-sm leading-relaxed focus:outline-none whitespace-pre-wrap break-words"
        style={{ minHeight }}
      />
    </div>
  );
}
