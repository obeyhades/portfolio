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
import Preloader from "@/components/Preloader";
import Project from "@/components/Project";
import { scrollToSection } from "@/lib/scroll";

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
  // Laddskärmen ligger kvar tills datan och typsnitten finns, och monteras ur när den glidit bort.
  const [ready, setReady] = useState(false);
  const [preloading, setPreloading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Parallellt: två seriella rundturer till Sanity fördubblade väntetiden före första bilden.
      const [homepageData, projectsData] = await Promise.all([
        client.fetch<Homepage>(homepageQuery),
        client.fetch<ProjectType[]>(projectsQuery),
      ]);
      setHomepage(homepageData);
      setProjects(projectsData);
    }
    Promise.all([fetchData(), document.fonts.ready])
      // Även om Sanity fallerar ska laddskärmen släppa – annars står besökaren på 90 % för alltid.
      .catch(() => undefined)
      .finally(() => setReady(true));
  }, []);

  // Kommer man hit via /#about från en projektsida finns sektionen inte förrän datan
  // landat – webbläsarens eget hash-hopp har då redan missat. Ta hashen en gång själv.
  useEffect(() => {
    if (!homepage || preloading) return;
    const id = window.location.hash.slice(1);
    if (id) scrollToSection(id);
  }, [homepage, preloading]);

  const preloader = preloading ? (
    <Preloader ready={ready} onExited={() => setPreloading(false)} />
  ) : null;

  if (!homepage) return preloader;

  return (
    <>
    {preloader}
    <main className="scroll-smooth bg-zinc-950 text-white min-h-screen relative">
      <Hero homepage={homepage} />

      <motion.section
        id="skills"
        tabIndex={-1}
        className="relative flex justify-center py-16 outline-none"
        {...reveal}
      >
        <Skills skills={homepage.skills} />
      </motion.section>

      <div className="h-10 w-px bg-zinc-700 mx-auto" />

      <motion.section
        id="projects"
        tabIndex={-1}
        className="relative flex justify-center py-16 outline-none"
        {...reveal}
      >
        <Project projects={projects} />
      </motion.section>

      <div className="h-10 w-px bg-zinc-700 mx-auto" />

      <motion.section
        id="about"
        tabIndex={-1}
        className="relative flex justify-center py-16 outline-none"
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
        tabIndex={-1}
        className="relative flex justify-center py-16 outline-none"
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
    </>
  );
}
