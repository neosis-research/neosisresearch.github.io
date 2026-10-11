import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
const insights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    author: z.string().optional(),
    category: z.enum([
      'Research commentary',
      'Methods',
      'Evaluation',
      'Computational research',
      'Research notes',
    ]),
    draft: z.boolean().default(true),
  }),
});
export const collections = { insights };
