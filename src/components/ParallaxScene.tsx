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
 * Himlen och kvällsglöden, ritade i SAMMA viewBox som bergen.
 *
 * Låg de i procent av rutan i stället gled de isär från bergskanten så fort
 * skärmens proportioner ändrades – på en hög telefonskärm hamnade glöden som ett
 * brett orange fält långt under åsryggen. Här är horisonten låst till y=452,
 * samma linje som bortre åsen, oavsett skärm.
 *
 * Rektangeln går långt utanför viewBoxen upp och ner: när lagret flyttas med
 * scrollen får den aldrig lämna en tom kant efter sig. Gradienten är i
 * userSpaceOnUse, så den håller sina stopp där de hör hemma medan ytan sträcks.
 */
function Sky({ progress, still }: { progress: MotionValue<number>; still: boolean }) {
  const y = useTransform(progress, [0, 1], ["0%", still ? "0%" : "92%"]);

  return (
    <motion.div
      className="absolute inset-0"
      style={{ y, willChange: still ? undefined : "transform" }}
    >
      <svg {...SVG_PROPS}>
        <defs>
          <linearGradient
            id="scene-sky"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="0"
            y2={VIEW_H}
          >
            <stop offset="0%" stopColor="#04060f" />
            <stop offset="16%" stopColor="#080d20" />
            <stop offset="30%" stopColor="#101637" />
            <stop offset="40%" stopColor="#1e2049" />
            <stop offset="46%" stopColor="#35285a" />
            <stop offset="49%" stopColor="#6b3c63" />
            <stop offset="51%" stopColor="#a5564c" />
            <stop offset="53%" stopColor="#d17c3d" />
            <stop offset="57%" stopColor="#7c4145" />
            <stop offset="64%" stopColor="#3a2438" />
            <stop offset="75%" stopColor="#1a1526" />
            <stop offset="88%" stopColor="#0d0d14" />
            <stop offset="100%" stopColor="#09090b" />
          </linearGradient>

          {/* Bärnstensglöden vid horisonten – samma accent som scrollbaren. */}
          <radialGradient id="scene-glow" gradientUnits="userSpaceOnUse" cx="720" cy="478" r="600">
            <stop offset="0%" stopColor="#ffb05c" stopOpacity="0.5" />
            <stop offset="34%" stopColor="#f59e0b" stopOpacity="0.22" />
            <stop offset="70%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x={-VIEW_W} y={-VIEW_H} width={VIEW_W * 3} height={VIEW_H * 3} fill="url(#scene-sky)" />
        <ellipse cx="720" cy="478" rx="600" ry="150" fill="url(#scene-glow)" />
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

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <Sky progress={scrollYProgress} still={still} />

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

      {SCENE_LAYERS.map((layer) => (
        <Layer key={layer.name} layer={layer} progress={scrollYProgress} still={still} />
      ))}

      {/*
        Heron klipps av sin overflow-hidden. Utan den här övergången slutar
        trädsiluetterna i en rak linje mot nästa sektion – tydligast på mobil,
        där skärmen är hög och bilden beskärs hårdast.
      */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[14%] bg-gradient-to-b from-transparent to-zinc-950" />
    </div>
  );
}
