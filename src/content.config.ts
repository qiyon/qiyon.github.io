import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({
    base: "./posts",
    pattern: "**/*.md",
  }),
  schema: z.object({
    title: z.string().min(1),
    publishedAt: z.coerce.date(),
    tags: z.array(z.string().min(1)).default([]),
    description: z.string().min(1).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
