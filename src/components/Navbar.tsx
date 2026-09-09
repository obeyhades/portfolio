"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { scrollToSection } from "@/lib/scroll";

const links = [
  { name: "Skills", href: "skills" },
  { name: "Projects", href: "projects" },
  { name: "Abdulhameed", href: "hero", isCenter: true },
  { name: "About", href: "about" },
  { name: "Contact", href: "contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const onLanding = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      // Heron ljusnar mot horisonten redan efter någon hundradels skärm, så
      // navbaren behöver sin platta långt innan man scrollat förbi hela heron.
      setScrolled(window.scrollY > 64);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Landning: scrolla mjukt till sektionen. Andra sidor: navigera till /#sektion.
  const go = (id: string) => {
    if (onLanding) {
      scrollToSection(id);
    } else {
      router.push(`/#${id}`);
    }
  };

  // Alltid solid bakgrund utanför landningens hero (annars ligger den över en bild).
  const solid = scrolled || !onLanding;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        solid
          ? "bg-zinc-900/70 backdrop-blur-md border-b border-zinc-800"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-8 text-white font-medium">
        {links.map((link) =>
          link.isCenter ? (
            <button
              key={link.name}
              onClick={() => go(link.href)}
              className="text-2xl font-bold mx-6 cursor-pointer hidden md:block hover:text-gray-300 transition"
            >
              {link.name}
            </button>
          ) : (
            <button
              key={link.name}
              onClick={() => go(link.href)}
              className="text-lg cursor-pointer transition hover:text-gray-300"
            >
              {link.name}
            </button>
          )
        )}
      </div>
    </nav>
  );
}
