"use client";

import { Project as ProjectType } from "@/sanity/types/project";
import Link from "next/link";

type ProjectProps = {
  projects: ProjectType[];
};

export default function Project({ projects }: ProjectProps) {
  return (
    <section id="projects" className="max-w-6xl mx-auto p-12 space-y-16">
      <h2 className="text-4xl font-bold text-center mb-12">Projects</h2>

      <div className="grid gap-12 grid-cols-1">
        {projects.map((project) => (
          <Link
            key={project._id}
            href={`/projects/${project.slug}`}
            className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 hover:shadow-2xl transition-transform hover:-translate-y-2 h-[400px] flex md:flex-row flex-col"
          >
            {project.previewImage && (
              <div className="md:w-1/2 h-1/2 md:h-full">
                <img
                  src={project.previewImage}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex-1 p-8 flex flex-col justify-between text-white">
              <div>
                <h3 className="text-3xl font-semibold mb-3">{project.title}</h3>
                <p className="text-gray-300 text-base line-clamp-4">
                  {project.definition}
                </p>
              </div>

              <div className="mt-6 flex gap-4">
                {project.links?.liveDemo && (
                  <a
                    href={project.links.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Live Demo
                  </a>
                )}
                {project.links?.repo && (
                  <a
                    href={project.links.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 border border-white text-sm rounded-lg hover:bg-white hover:text-black transition"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Code
                  </a>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
