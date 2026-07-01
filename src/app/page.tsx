"use client";

import { client } from "@/sanity/lib/client";
import { homepageQuery, projectsQuery } from "@/sanity/lib/queries";
import { Homepage } from "@/sanity/types/homepage";
import { Project as ProjectType } from "@/sanity/types/project";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";

import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Project from "@/components/Project";

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

function contactIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("git")) return Github;
  if (n.includes("linked")) return Linkedin;
  if (n.includes("mail") || n.includes("@")) return Mail;
  return ExternalLink;
}

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

      <motion.section
        id="skills"
        className="relative flex justify-center py-16"
        {...reveal}
      >
        <Skills skills={homepage.skills} />
      </motion.section>

      <div className="h-10 w-px bg-zinc-700 mx-auto" />

      <motion.section
        id="projects"
        className="relative flex justify-center py-16"
        {...reveal}
      >
        <Project projects={projects} />
      </motion.section>

      <div className="h-10 w-px bg-zinc-700 mx-auto" />

      <motion.section
        id="about"
        className="relative flex justify-center py-16"
        {...reveal}
      >
        <div className="max-w-4xl w-full border border-zinc-800 rounded-2xl p-10 bg-zinc-900/40">
          <h2 className="text-3xl font-bold mb-6 text-center">About Me</h2>
          <p className="text-zinc-200 leading-relaxed text-lg tracking-wide">
            {homepage.about}
          </p>
        </div>
      </motion.section>

      <div className="h-10 w-px bg-zinc-700 mx-auto" />

      <motion.section
        id="contact"
        className="relative flex justify-center py-16"
        {...reveal}
      >
        <div className="max-w-4xl w-full border border-zinc-800 rounded-2xl p-10 bg-zinc-900/40 text-center">
          <h2 className="text-3xl font-semibold mb-10">Get in Touch</h2>
          <div className="flex flex-wrap justify-center gap-10 text-lg tracking-wide">
            {homepage.contact.map((c) => {
              const Icon = contactIcon(c.name);
              return (
                <a
                  key={c.name}
                  href={c.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-gray-400 transition"
                >
                  <Icon size={20} />
                  {c.name.toUpperCase()}
                </a>
              );
            })}
          </div>
        </div>
      </motion.section>

      <footer className="border-t border-zinc-800 py-6 px-8 flex justify-between items-center text-sm tracking-widest">
        <span className="uppercase">Abdulhameed Al-Azzawi</span>
        <div className="flex gap-4">
          {homepage.contact.slice(0, 3).map((c) => {
            const Icon = contactIcon(c.name);
            return (
              <a
                key={c.name}
                href={c.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={c.name}
                className="hover:text-gray-400 transition"
              >
                <Icon size={18} />
              </a>
            );
          })}
        </div>
      </footer>
    </main>
  );
}
