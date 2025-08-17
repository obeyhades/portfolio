"use client";

import { Homepage } from "@/sanity/types/homepage";
import Navbar from "./Navbar";

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

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 text-white px-4">
        <h1 className="text-6xl md:text-8xl font-bold tracking-wide">
          {homepage.title}
        </h1>
        <p className="mt-4 text-lg md:text-2xl max-w-2xl mx-auto">
          {homepage.description}
        </p>
      </div>
    </section>
  );
}
