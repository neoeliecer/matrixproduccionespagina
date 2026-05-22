import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-[#030303] border-t border-white/5 py-20 px-6 md:px-12 z-10 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        <div className="flex flex-col items-center md:items-start gap-4">
          <img
            src="/img/logo.png"
            alt="Matrix Producciones Logo"
            className="h-10 w-auto object-contain brightness-110"
            onError={(e) => {
              e.currentTarget.src = "/img/logos/logo matrix.png";
            }}
          />
          <p className="text-white/40 text-xs tracking-wider max-w-sm text-center md:text-left mt-2 leading-relaxed">
            &copy; {new Date().getFullYear()} Matrix Producciones. Todos los derechos reservados. <br />
            Cine Documental de Impacto Positivo y Medioambiental.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="flex gap-8">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-accent font-semibold text-xs uppercase tracking-[3px] transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-accent font-semibold text-xs uppercase tracking-[3px] transition-colors"
            >
              Facebook
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-accent font-semibold text-xs uppercase tracking-[3px] transition-colors"
            >
              YouTube
            </a>
          </div>
          <p className="text-[10px] text-white/20 uppercase tracking-[2px] mt-2">
            Hecho con pasión en Colombia
          </p>
        </div>
      </div>
    </footer>
  );
}
