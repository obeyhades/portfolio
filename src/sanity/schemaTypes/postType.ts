import { defineArrayMember, defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Project title",
      type: "string",
    }),
    defineField({
      name: "definition",
      title: "Project definition",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Project description",
      type: "text",
    }),
    defineField({
      name: "longDescription",
      title: "Project long description",
      type: "text",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "previewImage",
      title: "Preview image",
      type: "image",
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail image",
      type: "image",
    }),
    defineField({
      name: "video",
      title: "Project video",
      type: "file",
    }),
    defineField({
      name: "accentColor",
      title: "Accent color",
      type: "string",
    }),
    defineField({
      name: "techstack",
      title: "Tech stack",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "links",
      title: "Project Links",
      type: "object",
      fields: [
        defineField({
          name: "liveDemo",
          title: "Live Demo URL",
          type: "url",
        }),
        defineField({
          name: "repo",
          title: "GitHub Repository URL",
          type: "url",
        }),
      ],
    }),
  ],
});

export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Homepage title",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Homepage description",
      type: "text",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
    }),
    defineField({
      name: "skills",
      title: "Skills",
      of: [{ type: "string" }],
      type: "array",
    }),
    defineField({
      name: "about",
      title: "About Me",
      type: "text",
    }),
   defineField({
      name: 'contact',
      title: 'Contact',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'contact',
          title: 'Contact',
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'link',
              title: 'Link',
              type: 'url',
              validation: (rule) =>
                rule
                  .uri({
                    scheme: ['http', 'https', 'mailto'],
                  })
                  .required(),
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
})
