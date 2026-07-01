import * as SI from "@icons-pack/react-simple-icons";
import { Code2 } from "lucide-react";
import type { ComponentType, CSSProperties } from "react";

type IconCmp = ComponentType<{ color?: string; size?: number; className?: string }>;

// Tech/skill-namn (gemener) -> { Simple Icons-komponent, brandfärg för hover }.
// Namn som saknar officiell logga faller tillbaka på en neutral ikon nedan.
const TECH_ICONS: Record<string, { icon: string; color: string }> = {
  "next.js": { icon: "SiNextdotjs", color: "#ffffff" },
  nextjs: { icon: "SiNextdotjs", color: "#ffffff" },
  react: { icon: "SiReact", color: "#61dafb" },
  "react query": { icon: "SiReactquery", color: "#ff4154" },
  vite: { icon: "SiVite", color: "#646cff" },
  typescript: { icon: "SiTypescript", color: "#3178c6" },
  javascript: { icon: "SiJavascript", color: "#f7df1e" },
  sanity: { icon: "SiSanity", color: "#f03e2f" },
  tailwind: { icon: "SiTailwindcss", color: "#38bdf8" },
  "tailwind css": { icon: "SiTailwindcss", color: "#38bdf8" },
  scss: { icon: "SiSass", color: "#cc6699" },
  sass: { icon: "SiSass", color: "#cc6699" },
  css: { icon: "SiCss", color: "#1572b6" },
  html: { icon: "SiHtml5", color: "#e34f26" },
  git: { icon: "SiGit", color: "#f05032" },
  gitlab: { icon: "SiGitlab", color: "#fc6d26" },
  github: { icon: "SiGithub", color: "#ffffff" },
  figma: { icon: "SiFigma", color: "#f24e1e" },
  angular: { icon: "SiAngular", color: "#dd0031" },
  php: { icon: "SiPhp", color: "#787cb5" },
  mysql: { icon: "SiMysql", color: "#4479a1" },
  laravel: { icon: "SiLaravel", color: "#ff2d20" },
  trpc: { icon: "SiTrpc", color: "#2596be" },
  rabbitmq: { icon: "SiRabbitmq", color: "#ff6600" },
  prisma: { icon: "SiPrisma", color: "#5eead4" },
  mongodb: { icon: "SiMongodb", color: "#47a248" },
  "node.js": { icon: "SiNodedotjs", color: "#5fa04e" },
  nodejs: { icon: "SiNodedotjs", color: "#5fa04e" },
  node: { icon: "SiNodedotjs", color: "#5fa04e" },
  nodemon: { icon: "SiNodemon", color: "#76d04b" },
  motion: { icon: "SiFramer", color: "#ffffff" },
  "framer motion": { icon: "SiFramer", color: "#ffffff" },
  express: { icon: "SiExpress", color: "#ffffff" },
  bun: { icon: "SiBun", color: "#fbf0df" },
};

function resolveIcon(name: string): { Icon: IconCmp; color: string } {
  const entry = TECH_ICONS[name.toLowerCase().trim()];
  if (entry) {
    const Comp = (SI as unknown as Record<string, IconCmp | undefined>)[entry.icon];
    if (Comp) return { Icon: Comp, color: entry.color };
  }
  // Fallback: neutral ikon i temats amber-ton för tech utan officiell logga
  return { Icon: Code2 as IconCmp, color: "#f59e0b" };
}

export default function TechPill({ name }: { name: string }) {
  const { Icon, color } = resolveIcon(name);
  return (
    <li
      style={{ "--c": color } as CSSProperties}
      className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/50 px-4 py-2 text-zinc-200 transition-colors hover:border-[var(--c)] hover:text-[var(--c)]"
    >
      <Icon color="currentColor" size={18} />
      <span className="text-sm font-medium">{name}</span>
    </li>
  );
}
