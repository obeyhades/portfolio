import TechPill from "./TechPill";

type SkillsProps = {
  skills: string[];
};

export default function Skills({ skills }: SkillsProps) {
  if (!skills || skills.length === 0) return null;

  return (
    <section className="flex justify-center">
      <div className="max-w-6xl rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold mb-8 text-white text-center">Skills</h2>
        <ul className="flex flex-wrap justify-center gap-3">
          {skills.map((skill) => (
            <TechPill key={skill} name={skill} />
          ))}
        </ul>
      </div>
    </section>
  );
}
