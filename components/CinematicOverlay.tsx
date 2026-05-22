"use client";

import { useEffect, useState } from "react";

export default function CinematicOverlay() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check if device supports hover (desktop mouse)
    const mediaQuery = window.matchMedia("(min-width: 1025px)");
    setIsDesktop(mediaQuery.matches);

    const handleResize = () => setIsDesktop(mediaQuery.matches);
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    if (mediaQuery.matches) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    // Custom hover trigger for buttons/links
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const updateHoverListeners = () => {
      const interactiveElements = document.querySelectorAll(
        "a, button, input, textarea, select, [role='button']"
      );
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
      });
    };

    updateHoverListeners();

    // Re-bind when DOM changes
    const observer = new MutationObserver(updateHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      const interactiveElements = document.querySelectorAll(
        "a, button, input, textarea, select, [role='button']"
      );
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* 🎞 Film Grain Overlay */}
      <div className="film-grain" />

      {/* 🕶 Vignette Dark Cinematic Borders */}
      <div className="vignette" />

      {/* 🟢 Custom Cinematic Glowing Cursor */}
      {isDesktop && (
        <div
          className={`custom-cursor ${isHovered ? "hover" : ""}`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        />
      )}
    </>
  );
}
