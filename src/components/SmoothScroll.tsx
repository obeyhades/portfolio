"use client";

import type Lenis from "lenis";
import type { LenisOptions } from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { setLenis } from "@/lib/scroll";

/**
 * Låg lerp = mer tröghet. 0.085 är där scrollen känns tung utan att kännas seg.
 * `anchors` är medvetet av: all sektionsnavigering går via scrollToSection, och
 * Lenis egen ankarhantering körde annars en andra scroll ovanpå den, utan navbar-offset.
 */
const options: LenisOptions = {
  autoRaf: true,
  lerp: 0.085,
  smoothWheel: true,
  syncTouch: false,
  wheelMultiplier: 0.9,
};

/**
 * Mjuk, trög scroll för hela sidan. Renderar inget – den bara kopplar in Lenis
 * och kopplar ur den igen när användaren ber om reduced motion eller lämnar sidan.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Sanity Studio har egen scrollhantering som Lenis skulle bråka med.
    if (pathname.startsWith("/studio")) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let instance: Lenis | undefined;
    let generation = 0;

    const start = async () => {
      const mine = ++generation;
      if (reduced.matches) return;

      // Dynamisk import: Lenis ska inte ligga i server-bundeln eller blockera första målningen.
      const { default: LenisCtor } = await import("lenis");
      if (mine !== generation || reduced.matches) return;

      instance = new LenisCtor(options);
      setLenis(instance);
    };

    const stop = () => {
      generation += 1;
      instance?.destroy();
      instance = undefined;
      setLenis(null);
    };

    const onPreferenceChange = () => {
      stop();
      void start();
    };

    void start();
    reduced.addEventListener("change", onPreferenceChange);

    return () => {
      stop();
      reduced.removeEventListener("change", onPreferenceChange);
    };
  }, [pathname]);

  return null;
}
