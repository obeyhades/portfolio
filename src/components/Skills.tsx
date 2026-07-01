import TechPill from "./TechPill";
import type { Skill } from "@/sanity/types/homepage";

type SkillsProps = {
  skills: Skill[];
};

export default function Skills({ skills }: SkillsProps) {
  if (!skills || skills.length === 0) return null;

  return (
    <section className="flex justify-center">
      <div className="max-w-6xl rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold mb-8 text-white text-center">Skills</h2>
        <ul className="flex flex-wrap justify-center gap-3">
          {skills.map((s, i) => {
            const name = typeof s === "string" ? s : s.name;
            const icon = typeof s === "string" ? undefined : s.icon;
            const color = typeof s === "string" ? undefined : s.color;
            return (
              <TechPill key={`${name}-${i}`} name={name} icon={icon} color={color} />
            );
          })}
        </ul>
      </div>
    </section>
  );
}
