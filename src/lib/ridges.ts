
export const VIEW_W = 1440;
export const VIEW_H = 900;

export type SceneLayer = {
  name: string;
  d: string;
  fill: string;
  lag: number;
  baseline: number;
  haze: number;
};

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (n: number) => Math.round(n * 100) / 100;

function ridge(opts: {
  seed: number;
  baseline: number;
  amp: number;
  freq: number;
  roughness?: number;
  step?: number;
}): string {
  const { seed, baseline, amp, freq, roughness = 0.35, step = 24 } = opts;
  const rnd = mulberry32(seed);
  const phase = [rnd() * 6.28, rnd() * 6.28, rnd() * 6.28, rnd() * 6.28];

  const pts: Array<[number, number]> = [];
  const n = Math.ceil(VIEW_W / step);
  for (let i = 0; i <= n; i++) {
    const x = Math.min(i * step, VIEW_W);
    const t = x / VIEW_W;
    const envelope = 0.5 + 0.5 * Math.sin(t * Math.PI * 0.8 + phase[3]);
    let y = baseline;
    y -= Math.sin(t * Math.PI * freq + phase[0]) * amp * (0.55 + 0.75 * envelope);
    y -= Math.sin(t * Math.PI * freq * 2.3 + phase[1]) * amp * 0.45;
    y -= Math.sin(t * Math.PI * freq * 4.7 + phase[2]) * amp * roughness * 0.5;
    y -= Math.sin(t * Math.PI * freq * 9.1 + phase[3]) * amp * roughness * 0.22;
    pts.push([x, y]);
  }

  let d = `M0,${round(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${round(c1x)},${round(c1y)} ${round(c2x)},${round(c2y)} ${round(p2[0])},${round(p2[1])}`;
  }
  return `${d}L${VIEW_W},${VIEW_H}L0,${VIEW_H}Z`;
}

function forest(opts: {
  seed: number;
  baseline: number;
  minH: number;
  maxH: number;
  minW: number;
  maxW: number;
}): string {
  const { seed, baseline, minH, maxH, minW, maxW } = opts;
  const rnd = mulberry32(seed);

  type Tree = { cx: number; half: number; h: number };
  const trees: Tree[] = [];
  let x = -maxW;
  while (x < VIEW_W + maxW) {
    const w = minW + rnd() * (maxW - minW);
    let h = minH + Math.pow(rnd(), 1.7) * (maxH - minH);
    if (rnd() < 0.08) h *= 1.4; 
    trees.push({ cx: x + w / 2, half: w / 2, h });
    x += w * (0.42 + rnd() * 0.7);
  }

  const gPhase = rnd() * 6.28;
  const gAmp = Math.max(3, minH * 0.12);
  const ground = (px: number) =>
    baseline + Math.sin((px / VIEW_W) * Math.PI * 3.1 + gPhase) * gAmp;

  const step = 3;
  let d = "";
  for (let px = 0; px <= VIEW_W; px += step) {
    let y = ground(px);
    for (const t of trees) {
      const dist = Math.abs(px - t.cx);
      if (dist > t.half) continue;
      const u = dist / t.half; 
      const crown = t.h * Math.pow(1 - u, 1.25) * (1 + 0.07 * Math.sin(u * 9));
      y = Math.min(y, ground(t.cx) - crown);
    }
    d += `${px === 0 ? "M" : "L"}${px},${round(y)}`;
  }
  return `${d}L${VIEW_W},${VIEW_H}L0,${VIEW_H}Z`;
}


export const SCENE_LAYERS: SceneLayer[] = [
  { name: "ridge-far",   fill: "#6d5b73", lag: 0.85, baseline: 452, haze: 0.34, d: ridge({ seed: 11, baseline: 452, amp: 26, freq: 1.6, roughness: 0.25, step: 40 }) },
  { name: "ridge-mid",   fill: "#504661", lag: 0.7,  baseline: 500, haze: 0.27, d: ridge({ seed: 29, baseline: 500, amp: 38, freq: 2.1, roughness: 0.4,  step: 32 }) },
  { name: "ridge-near",  fill: "#3a3550", lag: 0.56, baseline: 556, haze: 0.2,  d: ridge({ seed: 47, baseline: 556, amp: 46, freq: 2.7, roughness: 0.55, step: 28 }) },
  { name: "ridge-front", fill: "#2a2740", lag: 0.43, baseline: 618, haze: 0.14, d: ridge({ seed: 73, baseline: 618, amp: 52, freq: 3.3, roughness: 0.7,  step: 24 }) },
  { name: "forest-far",  fill: "#1c1a2e", lag: 0.31, baseline: 676, haze: 0.09, d: forest({ seed: 101, baseline: 676, minH: 22,  maxH: 44,  minW: 13, maxW: 24 }) },
  { name: "forest-mid",  fill: "#141320", lag: 0.19, baseline: 744, haze: 0.05, d: forest({ seed: 137, baseline: 744, minH: 46,  maxH: 88,  minW: 25, maxW: 45 }) },
  { name: "forest-near", fill: "#0e0e16", lag: 0.07, baseline: 838, haze: 0,    d: forest({ seed: 181, baseline: 838, minH: 88,  maxH: 156, minW: 45, maxW: 80 }) },
  { name: "forest-edge", fill: "#09090b", lag: 0,    baseline: 962, haze: 0,    d: forest({ seed: 223, baseline: 962, minH: 165, maxH: 290, minW: 88, maxW: 150 }) },
];

export type Star = { x: number; y: number; r: number; o: number };

export const STARS: Star[] = (() => {
  const rnd = mulberry32(919);
  const out: Star[] = [];
  for (let i = 0; i < 70; i++) {
    out.push({
      x: round(rnd() * VIEW_W),
      y: round(rnd() * 400),
      r: round(0.6 + rnd() * 1.3),
      o: round(0.18 + rnd() * 0.55),
    });
  }
  return out;
})();
