import type { SanityDocument } from "next-sanity";
import type { Image } from "sanity";

export type Contact = {
  name: string;
  link: string;
};

export type Homepage = SanityDocument & {
  title: string;
  description: string;
  heroImage: Image;
  skills: string[];
  about: string;
  contact: Contact[];
};
