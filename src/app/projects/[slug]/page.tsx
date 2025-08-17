/* eslint-disable @next/next/no-img-element */
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { projectQuery } from "@/sanity/lib/queries";
import { Project } from "@/sanity/types/project";

type Props = {
  params: Promise<{ slug: string }>; 
};

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params; 

  const project = await client.fetch<Project>(projectQuery, { slug });

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Project not found
      </div>
    );
  }

  return (
    <main className="bg-zinc-950 text-white min-h-screen">
      {project.previewImage && (
        <section className="relative flex justify-center items-center py-12">
          <div className="relative w-[90%] h-[80vh] overflow-hidden rounded-2xl shadow-2xl">
            <img
              src={project.previewImage}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <h1 className="text-6xl md:text-7xl font-bold text-center drop-shadow-xl">
                {project.title}
              </h1>
            </div>
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto py-16 px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">{project.definition}</h2>
          <p className="text-neutral-400 leading-relaxed mb-8">
            {project.longDescription || project.description}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-xl shadow-lg bg-black">
          {project.video ? (
            <video
              src={
                typeof project.video === "string"
                  ? project.video
                  : project.video
                  ? URL.createObjectURL(project.video as unknown as File)
                  : undefined
              }
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-[400px] object-contain"
            />
          ) : (
            <img
              src={urlFor(project.previewImage).url() || "/placeholder.png"}
              alt={project.title}
              className="w-full h-[400px] object-cover"
            />
          )}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 md:px-12 pb-24">
        {project.techstack && project.techstack.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-4">Tech Stack</h3>
            <div className="flex flex-wrap gap-3">
              {project.techstack.map((tech, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-neutral-800 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4">
          {project.links?.liveDemo && (
            <a
              href={project.links.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-300 transition"
            >
              Live Demo
            </a>
          )}
          {project.links?.repo && (
            <a
              href={project.links.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 border border-white rounded-lg hover:bg-white hover:text-black transition"
            >
              View Code
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
