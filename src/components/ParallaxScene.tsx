"use client";

import type { RefObject } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

import { SCENE_LAYERS, STARS, VIEW_H, VIEW_W, type SceneLayer } from "@/lib/ridges";


const ATMOSPHERE = "#b8797a";

const SVG_PROPS = {
  viewBox: `0 0 ${VIEW_W} ${VIEW_H}`,
  preserveAspectRatio: "xMidYMax slice",
  className: "h-full w-full",
} as const;


function Layer({
  layer,
  progress,
  still,
}: {
  layer: SceneLayer;
  progress: MotionValue<number>;
  still: boolean;
}) {
  const y = useTransform(progress, [0, 1], ["0%", still ? "0%" : `${layer.lag * 100}%`]);
  const hazeId = `scene-haze-${layer.name}`;
  const hazeTop = layer.baseline - 210;
  const hazeHeight = VIEW_H - hazeTop;

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        y,
        willChange: still || layer.lag === 0 ? undefined : "transform",
      }}
    >
      <svg {...SVG_PROPS}>
        <path d={layer.d} fill={layer.fill} />

        {layer.haze > 0 && (
          <>
            <defs>
              <linearGradient id={hazeId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ATMOSPHERE} stopOpacity="0" />
                <stop
                  offset={`${((210 / hazeHeight) * 100).toFixed(1)}%`}
                  stopColor={ATMOSPHERE}
                  stopOpacity={layer.haze}
                />
                <stop offset="100%" stopColor={ATMOSPHERE} stopOpacity={layer.haze} />
              </linearGradient>
            </defs>
            {/*
              Sträcker sig hela vägen ner till bildkanten. Slutar bandet vid
              åsryggen gör det så med full opacitet, och den kanten syns som
              ett hårt vågrätt streck tvärs över scenen.
            */}
            <rect x="0" y={hazeTop} width={VIEW_W} height={hazeHeight} fill={`url(#${hazeId})`} />
          </>
        )}
      </svg>
    </motion.div>
  );
}

/**
 * Landskapet bakom heron: himmel, stjärnor, horisontglöd och åtta djupplan.
 * Rent dekorativt, därför aria-hidden – skärmläsare ska höra rubriken, inte bergen.
 *
 * `target` måste peka på hero-sektionen själv. Mäter man i stället mot ett
 * absolut positionerat barn kan useScroll inte räkna ut sin offset, och
 * progressen fastnar tyst på 0 – parallaxen dör utan att något kraschar.
 */
export default function ParallaxScene({
  target,
}: {
  target: RefObject<HTMLElement | null>;
}) {
  const still = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target,
    offset: ["start start", "end start"],
  });

  const starY = useTransform(scrollYProgress, [0, 1], ["0%", still ? "0%" : "92%"]);
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", still ? "0%" : "80%"]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Himlen. Sista dagsljuset ligger kvar strax ovanför horisonten. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, #04060f 0%, #080d20 16%, #101637 30%, #1e2049 40%, #35285a 46%, #6b3c63 50%, #a5564c 53%, #d17c3d 55.5%, #7c4145 60%, #3a2438 68%, #1a1526 78%, #0d0d14 90%, #09090b 100%)",
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{ y: starY, willChange: still ? undefined : "transform" }}
      >
        <svg {...SVG_PROPS}>
          {STARS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#dbe4ff" opacity={s.o} />
          ))}
        </svg>
      </motion.div>

      {/* Bärnstensglöden vid horisonten – samma accent som scrollbaren. */}
      <motion.div
        className="absolute inset-x-0"
        style={{
          top: "22%",
          height: "34%",
          y: glowY,
          willChange: still ? undefined : "transform",
          background:
            "radial-gradient(52% 100% at 50% 100%, rgba(255,176,92,0.5) 0%, rgba(245,158,11,0.22) 34%, rgba(245,158,11,0) 70%)",
        }}
      />

      {SCENE_LAYERS.map((layer) => (
        <Layer key={layer.name} layer={layer} progress={scrollYProgress} still={still} />
      ))}
    </div>
  );
}
