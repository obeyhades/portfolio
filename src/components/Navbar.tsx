"use client";

import { useEffect, useState } from "react";

const links = [
  { name: "About", href: "about" },
  { name: "Skills", href: "skills" },
  { name: "Abdulhameed", href: "hero", isCenter: true },
  { name: "Projects", href: "projects" },
  { name: "Contact", href: "contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight - 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80; // 80px för navbar
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-zinc-900/60 backdrop-blur-md border-b border-zinc-800"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-8 text-white font-medium">
        {links.map((link) =>
          link.isCenter ? (
            <span
              key={link.name}
              className="text-2xl font-bold mx-6 cursor-pointer"
              onClick={() => handleScrollTo(link.href)}
            >
              {link.name}
            </span>
          ) : (
            <span
              key={link.name}
              className="text-lg cursor-pointer transition hover:text-gray-300"
              onClick={() => handleScrollTo(link.href)}
            >
              {link.name}
            </span>
          )
        )}
      </div>
    </nav>
  );
}
