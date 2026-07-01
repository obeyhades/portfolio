"use client";

import { Homepage } from "@/sanity/types/homepage";
import Navbar from "./Navbar";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";

type HeroProps = {
  homepage: Homepage;
};

export default function Hero({ homepage }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative w-full h-screen flex items-center justify-center text-center"
      style={{
        backgroundImage: `url(${homepage.heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar />

      {/* Gradient-scrim: lite mörkare i topp (nav) och botten (stadsljus) för kontrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/75" />

      <div className="relative z-10 text-white px-4">
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
            className="px-7 py-3 border border-zinc-300/80 rounded-lg text-white uppercase tracking-widest text-sm md:text-base hover:bg-white hover:text-black transition"
          >
            Contact me
          </a>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 text-white z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown size={48} strokeWidth={1.5} className="mx-auto opacity-80" />
      </motion.div>
    </section>
  );
}
