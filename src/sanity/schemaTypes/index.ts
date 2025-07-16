import { type SchemaTypeDefinition } from 'sanity'
import { project, homepage } from './postType'


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project, homepage],
}
