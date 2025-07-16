import { defineArrayMember, defineField, defineType } from "sanity";

export const project = defineType({
  name: "profile",
  title: "profile",
  type: "document",
fields: [
    defineField({
        name: "title",
        title: "Project title",
        type: "string",
    }),
    defineField({
      name: "definition",
      title: "project definition",
      type: "string", 
    }),
    defineField({
      name: "description",
      title: "project description",
      type: "text", 
    }),
    defineField({
      name: "previewImage",
      title: "preview image",
      type: "image", 
    }),
    defineField({
      name: "thumbnail",
      title: "thumbnail image",
      type: "image", 
    }),
    defineField({
      name: "vidoe",
      title: "project video",
      type: "file", 
    }),
]});  

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
