import { groq } from "next-sanity";

export const homepageQuery = groq`
  *[_type == "homepage"][0]{
    title,
    description,
    skills[],
    about,
    contact[]{
      name,
      link
    },
    "heroImage": heroImage.asset->url
  }
`;

export const projectsQuery = groq`
  *[_type == "project"]{
    _id,
    title,
    definition,
    description,
    longDescription,
    "slug": slug.current,
    "previewImage": previewImage.asset->url,
    "thumbnail": thumbnail.asset->url,
    "video": video.asset->url,
    accentColor,
    techstack[],
    links{
      liveDemo,
      repo
    }
  }
`;

export const projectQuery = groq`
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    definition,
    description,
    longDescription,
    "slug": slug.current,
    "previewImage": previewImage.asset->url,
    "thumbnail": thumbnail.asset->url,
    "video": video.asset->url,
    accentColor,
    techstack[],
    links{
      liveDemo,
      repo
    }
  }
`;
