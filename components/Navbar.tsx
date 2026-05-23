"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Inicio", path: "/" },
    { name: "Quiénes Somos", path: "/#quienes-somos" },
    { name: "Catálogo", path: "/catalogo" },
    { name: "Servicios", path: "/servicios" },
    { name: "Convocatorias", path: "/convocatorias" },
    { name: "Cine con Propósito", path: "/recomendadas" },
    { name: "Blog", path: "/blog" },
    { name: "Contacto", path: "/contacto" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[999] transition-all duration-500 border-b border-white/5 backdrop-blur-xl ${
        scrolled ? "py-4 bg-[#030303]/90 shadow-2xl" : "py-8 bg-[#030303]/40"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link href="/" className="logo-container group">
          <img
            src="/img/logo.png"
            alt="Matrix Producciones Logo"
            className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = "/img/logos/logo matrix.png";
            }}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className={`text-[11px] uppercase tracking-[3px] font-bold transition-all duration-300 hover:text-accent hover:drop-shadow-[0_0_8px_var(--accent-glow)] ${
                      isActive ? "text-accent drop-shadow-[0_0_8px_var(--accent-glow)]" : "text-white/60"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href="/propuesta"
            className="border border-accent/40 bg-accent/5 hover:bg-accent hover:text-black font-extrabold text-[11px] uppercase tracking-[3px] px-6 py-3 rounded-[2px] transition-all duration-300 hover:shadow-[0_0_25px_var(--accent-glow)] hover:-translate-y-0.5 active:translate-y-0"
          >
            Enviar Propuesta
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden flex flex-col gap-2 z-[1000] p-2 focus:outline-none"
          aria-label="Toggle menu"
        >
          <div
            className={`w-8 h-[2px] bg-white transition-all duration-300 ${
              menuOpen ? "transform rotate-45 translate-y-[5px]" : ""
            }`}
          />
          <div
            className={`w-8 h-[2px] bg-white transition-all duration-300 ${
              menuOpen ? "transform -rotate-45 -translate-y-[5px]" : ""
            }`}
          />
        </button>

        {/* Mobile Nav Overlay */}
        <div
          className={`fixed inset-0 h-screen w-screen bg-[#030303]/98 z-[99] flex flex-col justify-center items-center gap-8 transition-all duration-500 lg:hidden ${
            menuOpen ? "right-0 opacity-100 visible" : "-right-full opacity-0 invisible"
          }`}
        >
          <ul className="flex flex-col items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.path}
                  onClick={() => setMenuOpen(false)}
                  className="text-lg uppercase tracking-[5px] font-bold text-white/80 hover:text-accent transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/propuesta"
            onClick={() => setMenuOpen(false)}
            className="border border-accent bg-accent/10 text-accent font-extrabold text-sm uppercase tracking-[4px] px-8 py-4 rounded-[2px] transition-all duration-300 hover:bg-accent hover:text-black mt-4"
          >
            Enviar Propuesta
          </Link>
        </div>
      </div>
    </header>
  );
}
