import type { SanityDocument } from "next-sanity";
import type { Slug, Image, File } from "sanity";

export type Project = SanityDocument & {
  title: string;
  definition: string;
  description: string;
  longDescription?: string;
  slug: Slug;
  previewImage: Image;
  thumbnail: Image;
  video?: File;
  accentColor?: string;
  techstack?: string[];
  links?: {
    liveDemo?: string;
    repo?: string;
  };
};
