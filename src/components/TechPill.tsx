import * as SI from "@icons-pack/react-simple-icons";
import { Code2, Sparkles } from "lucide-react";
import type { ComponentType, CSSProperties } from "react";

type IconCmp = ComponentType<{ color?: string; size?: number; className?: string }>;

type Entry = { icon: string | IconCmp; color: string };

// Namn (gemener) -> ikon + hover-färg.
// icon = Simple Icons-komponentnamn (sträng) ELLER en färdig komponent
// (t.ex. lucide) för tech som saknar officiell logga i paketet.
const TECH_ICONS: Record<string, Entry> = {
  // Frontend
  "next.js": { icon: "SiNextdotjs", color: "#ffffff" },
  nextjs: { icon: "SiNextdotjs", color: "#ffffff" },
  react: { icon: "SiReact", color: "#61dafb" },
  "react query": { icon: "SiReactquery", color: "#ff4154" },
  "react router": { icon: "SiReactrouter", color: "#ca4245" },
  vite: { icon: "SiVite", color: "#646cff" },
  vitest: { icon: "SiVitest", color: "#6e9f18" },
  angular: { icon: "SiAngular", color: "#dd0031" },
  "three.js": { icon: "SiThreedotjs", color: "#ffffff" },
  threejs: { icon: "SiThreedotjs", color: "#ffffff" },
  redux: { icon: "SiRedux", color: "#764abc" },
  expo: { icon: "SiExpo", color: "#ffffff" },
  storybook: { icon: "SiStorybook", color: "#ff4785" },
  // Språk
  typescript: { icon: "SiTypescript", color: "#3178c6" },
  javascript: { icon: "SiJavascript", color: "#f7df1e" },
  php: { icon: "SiPhp", color: "#787cb5" },
  python: { icon: "SiPython", color: "#3776ab" },
  go: { icon: "SiGo", color: "#00add8" },
  golang: { icon: "SiGo", color: "#00add8" },
  "c++": { icon: "SiCplusplus", color: "#00599c" },
  zod: { icon: "SiZod", color: "#3e67b1" },
  // Styling / design
  tailwind: { icon: "SiTailwindcss", color: "#38bdf8" },
  "tailwind css": { icon: "SiTailwindcss", color: "#38bdf8" },
  scss: { icon: "SiSass", color: "#cc6699" },
  sass: { icon: "SiSass", color: "#cc6699" },
  css: { icon: "SiCss", color: "#1572b6" },
  html: { icon: "SiHtml5", color: "#e34f26" },
  figma: { icon: "SiFigma", color: "#f24e1e" },
  // Backend / databas
  "node.js": { icon: "SiNodedotjs", color: "#5fa04e" },
  nodejs: { icon: "SiNodedotjs", color: "#5fa04e" },
  node: { icon: "SiNodedotjs", color: "#5fa04e" },
  nodemon: { icon: "SiNodemon", color: "#76d04b" },
  express: { icon: "SiExpress", color: "#ffffff" },
  fastify: { icon: "SiFastify", color: "#ffffff" },
  laravel: { icon: "SiLaravel", color: "#ff2d20" },
  trpc: { icon: "SiTrpc", color: "#2596be" },
  graphql: { icon: "SiGraphql", color: "#e10098" },
  prisma: { icon: "SiPrisma", color: "#5eead4" },
  sanity: { icon: "SiSanity", color: "#f03e2f" },
  mongodb: { icon: "SiMongodb", color: "#47a248" },
  mysql: { icon: "SiMysql", color: "#4479a1" },
  postgresql: { icon: "SiPostgresql", color: "#4169e1" },
  postgres: { icon: "SiPostgresql", color: "#4169e1" },
  supabase: { icon: "SiSupabase", color: "#3ecf8e" },
  firebase: { icon: "SiFirebase", color: "#ffca28" },
  rabbitmq: { icon: "SiRabbitmq", color: "#ff6600" },
  // Verktyg / infra
  git: { icon: "SiGit", color: "#f05032" },
  gitlab: { icon: "SiGitlab", color: "#fc6d26" },
  github: { icon: "SiGithub", color: "#ffffff" },
  docker: { icon: "SiDocker", color: "#2496ed" },
  vercel: { icon: "SiVercel", color: "#ffffff" },
  cloudflare: { icon: "SiCloudflare", color: "#f38020" },
  jest: { icon: "SiJest", color: "#c21325" },
  stripe: { icon: "SiStripe", color: "#635bff" },
  bun: { icon: "SiBun", color: "#fbf0df" },
  // AI (OpenAI-loggan finns inte i simple-icons -> lucide Sparkles)
  openai: { icon: Sparkles, color: "#10a37f" },
  "openai api": { icon: Sparkles, color: "#10a37f" },
  chatgpt: { icon: Sparkles, color: "#10a37f" },
  gpt: { icon: Sparkles, color: "#10a37f" },
  ai: { icon: Sparkles, color: "#10a37f" },
};

const asRecord = SI as unknown as Record<string, IconCmp | undefined>;

// Slår upp en Simple Icons-komponent från en slug ("nextdotjs" -> SiNextdotjs)
function siBySlug(raw: string): IconCmp | undefined {
  const key = raw.trim();
  if (!key) return undefined;
  const siName = key.startsWith("Si")
    ? key
    : "Si" + key.charAt(0).toUpperCase() + key.slice(1);
  return asRecord[siName];
}

function resolveIcon(name: string, iconSlug?: string, colorOverride?: string) {
  const mapEntry = TECH_ICONS[name.toLowerCase().trim()];

  // 1. Ikon vald i Sanity (slug)
  if (iconSlug && iconSlug.trim()) {
    const Comp = siBySlug(iconSlug);
    if (Comp) return { Icon: Comp, color: colorOverride || mapEntry?.color || "#ffffff" };
  }

  // 2. Auto utifrån namnet
  if (mapEntry) {
    const Comp = typeof mapEntry.icon === "string" ? asRecord[mapEntry.icon] : mapEntry.icon;
    if (Comp) return { Icon: Comp, color: colorOverride || mapEntry.color };
  }

  // 3. Fallback: neutral ikon
  return { Icon: Code2 as IconCmp, color: colorOverride || "#f59e0b" };
}

export default function TechPill({
  name,
  icon,
  color,
}: {
  name: string;
  icon?: string;
  color?: string;
}) {
  const { Icon, color: c } = resolveIcon(name, icon, color);
  return (
    <li
      style={{ "--c": c } as CSSProperties}
      className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/50 px-4 py-2 text-zinc-200 transition-colors hover:border-[var(--c)] hover:text-[var(--c)]"
    >
      <Icon color="currentColor" size={18} />
      <span className="text-sm font-medium">{name}</span>
    </li>
  );
}
