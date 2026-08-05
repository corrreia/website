import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

/**
 * Posts live at src/content/blog/<folder>/index.md so images can sit next to
 * the markdown that references them.
 *
 * The entry id is the post slug, taken from frontmatter when set and from the
 * folder name otherwise — the same rule the pages used before, now applied in
 * one place.
 */
const blog = defineCollection({
	loader: glob({
		pattern: "**/index.md",
		base: "./src/content/blog",
		generateId: ({ entry, data }) =>
			typeof data.slug === "string" && data.slug.length > 0 ? data.slug : (entry.split("/")[0] ?? entry),
	}),
	schema: z.object({
		title: z.string(),
		slug: z.string().optional(),
		date: z.coerce.date(),
		description: z.string().optional(),
		tags: z.array(z.string()).default([]),
		/** Drafts render in `astro dev` and are excluded from production builds. */
		draft: z.boolean().default(false),
	}),
});

export const collections = { blog };
