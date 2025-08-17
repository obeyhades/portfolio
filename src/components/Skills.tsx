"use client";

type SkillsProps = {
  skills: string[];
};

export default function Skills({ skills }: SkillsProps) {
  if (!skills || skills.length === 0) return null;

  return (
    <section className="py-16 flex justify-center">
      <div className="max-w-6xl rounded-2xl shadow-2xl p-12">
        <h2 className="text-3xl font-bold mb-8 text-white text-center">Skills</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {skills.map((skill, i) => (
            <span
              key={i}
              className="px-5 py-2 bg-amber-950 text-white rounded-full shadow-sm hover:bg-gray-700 transition"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
