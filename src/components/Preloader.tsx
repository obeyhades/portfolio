"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { lockScroll } from "@/lib/scroll";

/**
 * Så länge räknaren minst visas, även om datan kommer direkt – annars blinkar den bara förbi.
 * Datan är normalt klar på ~0,5 s; hela sekvensen (ramp + sista biten + paus + uppglidning)
 * landar på ~2,3 s, samma som förlagan. Mer än så känns som väntan, inte som en entré.
 */
const MIN_VISIBLE_MS = 1000;
/** Hur lång tid rampen upp till taket tar. */
const RAMP_MS = 1000;
/** Hur långt räknaren tar sig på egen hand innan datan landat. Sista biten kräver riktig laddning. */
const IDLE_CAP = 90;
/** Sista biten 90 → 100, när datan finns. */
const FINISH_MS = 250;
/** Paus på 100 % innan skärmen släpper, så signaturen hinner ses. */
const HOLD_AT_FULL_MS = 320;
/** Uppglidningen. */
const EXIT_S = 0.7;

const RADIUS = 64;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

type Props = {
  /** Sant när sidans data och typsnitt är på plats. */
  ready: boolean;
  /** Anropas när överlägget lämnat skärmen och kan monteras ur. */
  onExited: () => void;
};

/**
 * Laddskärm: en cirkel nere till vänster vars kontur ritas i takt med att sidan
 * laddar, ett procenttal inuti som blir en signatur vid 100 %, och en rad om vem
 * man har kommit till. Sedan glider den upp och släpper fram landskapet.
 *
 * Framstegen räknas från klocktid, inte bildrutor, så en flik som öppnats i
 * bakgrunden blir klar även om webbläsaren pausat animationerna där.
 */
export default function Preloader({ ready, onExited }: Props) {
  const still = useReducedMotion() ?? false;
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const startedAt = useRef<number | null>(null);
  const readyAt = useRef<number | null>(null);

  useEffect(() => {
    lockScroll(true);
    return () => lockScroll(false);
  }, []);

  // Säkring: i en bakgrundsflik pausar webbläsaren animationer, och då kommer
  // onAnimationComplete aldrig. Skärmen ska släppa ändå – ingen ska bli inlåst.
  useEffect(() => {
    if (!leaving) return;
    const fallback = window.setTimeout(onExited, EXIT_S * 1000 + 300);
    return () => window.clearTimeout(fallback);
  }, [leaving, onExited]);

  useEffect(() => {
    if (ready && readyAt.current === null) readyAt.current = performance.now();
  }, [ready]);

  useEffect(() => {
    startedAt.current ??= performance.now();
    let holdTimer: number | undefined;

    const tick = () => {
      const now = performance.now();
      const elapsed = now - (startedAt.current ?? now);

      // Egen framfart upp till taket, mjukt avtagande – som en riktig laddning.
      const idle = IDLE_CAP * easeOutCubic(Math.min(1, elapsed / RAMP_MS));
      let next = idle;

      // När datan finns och minimitiden gått: kör sista biten till 100.
      if (readyAt.current !== null && elapsed >= MIN_VISIBLE_MS) {
        const since = now - Math.max(readyAt.current, (startedAt.current ?? 0) + MIN_VISIBLE_MS);
        next = Math.max(idle, IDLE_CAP + (100 - IDLE_CAP) * Math.min(1, since / FINISH_MS));
      }

      const value = Math.min(100, Math.round(next));
      setProgress(value);
      if (value >= 100) {
        window.clearInterval(interval);
        holdTimer = window.setTimeout(() => setLeaving(true), HOLD_AT_FULL_MS);
      }
    };

    // Intervall i stället för rAF: fortsätter (glesare) även i en bakgrundsflik.
    const interval = window.setInterval(tick, 40);
    tick();

    return () => {
      window.clearInterval(interval);
      if (holdTimer) window.clearTimeout(holdTimer);
    };
  }, []);

  const full = progress >= 100;

  return (
    <motion.div
      role="status"
      // Bara två tillstånd annonseras – ett procenttal som byts 25 gånger i sekunden
      // skulle få en skärmläsare att rabbla siffror.
      aria-label={full ? "Sidan är laddad" : "Sidan laddas"}
      className="fixed inset-0 z-[60] bg-zinc-950 text-white"
      initial={false}
      animate={leaving ? { y: "-100%" } : { y: 0 }}
      transition={
        still
          ? { duration: 0 }
          : { duration: EXIT_S, ease: [0.76, 0, 0.24, 1] }
      }
      onAnimationComplete={() => {
        if (leaving) onExited();
      }}
    >
      <div className="absolute bottom-8 left-8 flex items-end gap-5 md:bottom-12 md:left-12">
        <div className="relative size-[9rem] md:size-[10.5rem]">
          <svg viewBox="0 0 160 160" className="size-full -rotate-90" aria-hidden="true">
            {/* Spåret: knappt synligt, så bågen som ritas är det som läses. */}
            <circle cx="80" cy="80" r={RADIUS} fill="none" stroke="#27272a" strokeWidth="1" />
            <circle
              cx="80"
              cy="80"
              r={RADIUS}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              // Ingen CSS-transition här: den startas om vid varje tick (var 40:e ms)
              // och hinner aldrig gå, så bågen släpar efter siffran tills räknaren stannar.
              style={{ strokeDashoffset: CIRCUMFERENCE * (1 - progress / 100) }}
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`absolute text-3xl font-bold tabular-nums tracking-tight transition-opacity duration-300 md:text-4xl ${
                full ? "opacity-0" : "opacity-100"
              }`}
            >
              {progress}%
            </span>
            {/* Signaturen tar över när allt är laddat. */}
            <span
              className={`absolute text-3xl font-bold tracking-[0.18em] transition-opacity duration-500 md:text-4xl ${
                full ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={!full}
            >
              AA
            </span>
          </div>
        </div>

        <p className="mb-2 max-w-[13rem] text-[0.6rem] uppercase leading-relaxed tracking-[0.18em] text-zinc-400 md:mb-3">
          Hi, I&apos;m Abdulhameed, a curious, problem-solving fullstack developer.
        </p>
      </div>
    </motion.div>
  );
}
