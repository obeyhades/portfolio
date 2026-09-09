"use client";

import { useRef } from "react";

import { Homepage } from "@/sanity/types/homepage";
import Navbar from "./Navbar";
import ParallaxScene from "./ParallaxScene";
import { ChevronDown, ArrowRight } from "lucide-react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";

import { scrollToSection } from "@/lib/scroll";

type HeroProps = {
  homepage: Homepage;
};

export default function Hero({ homepage }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);

  // Texten dröjer sig kvar när sidan drar iväg (37vh per 100vh scroll, samma släp
  // som landskapets mellanplan) och tonar ut innan navbaren hinner klippa rubriken.
  const copyRef = useRef<HTMLDivElement>(null);
  const still = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Skrivs direkt till elementet i stället för via style={{ y, opacity }}. Motion lämnar
  // annars över scroll-länkade värden till webbläsarens ScrollTimeline, och där fick
  // opacitet och transform olika progress. En skrivning per scrollhändelse, samma p.
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const el = copyRef.current;
    if (!el) return;
    if (still) {
      el.style.transform = "";
      el.style.opacity = "";
      el.style.visibility = "";
      return;
    }
    el.style.transform = `translate3d(0, ${(p * 37).toFixed(2)}vh, 0)`;
    el.style.opacity = Math.max(0, 1 - p / 0.55).toFixed(3);
    // Opacitet 0 är fortfarande klickbart och tabbbart – göm på riktigt när den tonat ut.
    el.style.visibility = p >= 0.55 ? "hidden" : "";
  });

  return (
    <section
      ref={heroRef}
      id="hero"
      tabIndex={-1}
      className="relative w-full h-svh overflow-hidden flex items-start justify-center text-center outline-none"
    >
      <ParallaxScene target={heroRef} />

      <Navbar />

      {/* Mörkar bara där texten ligger, så landskapet inte plattas till av en heltäckande scrim. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(62%_46%_at_50%_30%,rgba(4,6,13,0.62)_0%,rgba(4,6,13,0.3)_46%,rgba(4,6,13,0)_76%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/55 to-transparent" />

      {/* Uppe i himlen, som Firewatch-loggan – nedre halvan tillhör landskapet och fiskaren. */}
      <div ref={copyRef} className="relative z-10 text-white px-4 pt-[13vh] md:pt-[15vh] will-change-transform">
        <h1 className="text-5xl md:text-8xl font-bold tracking-wide drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)]">
          {homepage.title}
        </h1>
        <p className="mt-4 text-lg md:text-2xl max-w-2xl mx-auto text-zinc-100/90">
          {homepage.description}
        </p>

        <motion.div
          className="mt-10 flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("contact");
            }}
            className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm md:text-base font-semibold text-black shadow-lg shadow-black/30 ring-1 ring-white/30 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-black/40"
          >
            Get in touch
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 text-white z-10"
        animate={still ? undefined : { y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown size={48} strokeWidth={1.5} className="mx-auto opacity-80" />
      </motion.div>
    </section>
  );
}
