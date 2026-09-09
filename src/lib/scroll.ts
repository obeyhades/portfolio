import type Lenis from "lenis";

let lenis: Lenis | null = null;

/** Registreras av SmoothScroll när Lenis startar, så navigering går genom samma motor. */
export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

/** Sektionen ska landa strax under den fasta navbaren. */
const NAV_OFFSET = -80;

/**
 * Enda vägen att scrolla till en sektion. Native `scrollTo({ behavior: "smooth" })`
 * och Lenis slåss om samma hjul – går man via Lenis när den finns blir det en rörelse,
 * och utan Lenis (reduced motion, Studio) faller vi tillbaka på webbläsarens egen.
 */
/**
 * Låser sidan medan laddskärmen ligger över den. Går via Lenis när den finns
 * (den stänger av sig själv och sätter overflow via sin egen CSS), annars via html.
 */
export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  if (lenis) {
    lenis.scrollTo(el, { offset: NAV_OFFSET });
  } else {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const y = el.getBoundingClientRect().top + window.scrollY + NAV_OFFSET;
    window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  }

  // Fokus måste följa med. Annars ligger det kvar på knappen i heron, nästa Tab
  // hamnar på ett osynligt element där uppe, och webbläsaren rullar tillbaka.
  // preventScroll låter scrollen ovan löpa klart utan att fokusflytten rycker i den.
  el.focus({ preventScroll: true });
}
