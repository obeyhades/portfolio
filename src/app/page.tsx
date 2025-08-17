"use client";

import { client } from "@/sanity/lib/client";
import { homepageQuery, projectsQuery } from "@/sanity/lib/queries";
import { Homepage } from "@/sanity/types/homepage";
import { Project as ProjectType } from "@/sanity/types/project";
import { useEffect, useState } from "react";

import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Project from "@/components/Project";

export default function Home() {
  const [homepage, setHomepage] = useState<Homepage | null>(null);
  const [projects, setProjects] = useState<ProjectType[]>([]);

  useEffect(() => {
    async function fetchData() {
      const homepageData = await client.fetch<Homepage>(homepageQuery);
      setHomepage(homepageData);

      const projectsData = await client.fetch<ProjectType[]>(projectsQuery);
      setProjects(projectsData);
    }
    fetchData();
  }, []);

  if (!homepage) return <div>Loading...</div>;

  return (
    <main className="scroll-smooth bg-zinc-950 text-white min-h-screen relative">
      <Hero homepage={homepage} />

      <section id="skills" className="relative flex justify-center py-24">
          <Skills skills={homepage.skills} />
      </section>


      <div className="h-16 w-px bg-zinc-700 mx-auto" />

      <section id="projects" className="relative flex justify-center py-24">
          <Project projects={projects} />
        
      </section>


      <div className="h-16 w-px bg-zinc-700 mx-auto" />

      <section id="about" className="relative flex justify-center py-24">
        <div className="max-w-4xl w-full border border-zinc-800 rounded-2xl p-10 bg-zinc-900/40 text-center">
          <h2 className="text-3xl font-bold mb-6">About Me</h2>
          <p className="text-neutral-300 leading-relaxed text-lg">
            {homepage.about}
          </p>
        </div>
      </section>


      <div className="h-16 w-px bg-zinc-700 mx-auto" />

      <section id="contact" className="relative flex justify-center py-24">
        <div className="max-w-4xl w-full border border-zinc-800 rounded-2xl p-10 bg-zinc-900/40 text-center">
          <h2 className="text-3xl font-semibold mb-10">Get in Touch</h2>
          <div className="flex flex-wrap justify-center gap-12 text-lg tracking-wide">
            {homepage.contact.map((c, i) => (
              <a
                key={i}
                href={c.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400 transition"
              >
                {c.name.toUpperCase()}
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-800 py-6 px-8 flex justify-between items-center text-sm tracking-widest">
        <span className="uppercase">{homepage?.name || "Abdulhmaeed"}</span>
        <div className="flex gap-4">
          {homepage.contact.slice(0, 3).map((c, i) => (
            <a
              key={i}
              href={c.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400 transition"
            >
              {c.name.toUpperCase()}
            </a>
          ))}
        </div>
      </footer>
    </main>
  );
}
