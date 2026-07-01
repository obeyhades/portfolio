import type { SanityDocument } from "next-sanity";
import type { Image } from "sanity";

export type Contact = {
  name: string;
  link: string;
};

// En skill kan vara en enkel sträng (auto-ikon från namnet)
// eller ett objekt där man valt ikon/färg i Sanity.
export type Skill = string | { name: string; icon?: string; color?: string };

export type Homepage = SanityDocument & {
  title: string;
  description: string;
  heroImage: Image;
  skills: Skill[];
  about: string;
  contact: Contact[];
};
