import { getCollection, type CollectionEntry } from "astro:content";

export type BlogEntry = CollectionEntry<"blog">;

export interface Post {
	slug: string;
	title: string;
	description?: string;
	date: Date;
	tags: string[];
	/** Post body as authored, without the frontmatter block. */
	body: string;
	readingMinutes: number;
	href: string;
	entry: BlogEntry;
}

const WORDS_PER_MINUTE = 200;

function toPost(entry: BlogEntry): Post {
	const body = entry.body ?? "";
	return {
		slug: entry.id,
		title: entry.data.title,
		description: entry.data.description,
		date: entry.data.date,
		tags: entry.data.tags,
		body,
		readingMinutes: readingMinutes(body),
		href: `/blog/${entry.id}/`,
		entry,
	};
}

/**
 * Every post, newest first. Drafts are kept in `astro dev` so they can be
 * previewed, and dropped from production builds.
 */
export async function getPosts(): Promise<Post[]> {
	const entries = await getCollection("blog", ({ data }) => import.meta.env.DEV || !data.draft);
	return entries.map(toPost).sort((a, b) => b.date.valueOf() - a.date.valueOf());
}

export interface Tag {
	name: string;
	slug: string;
	posts: Post[];
}

/** Tags across all posts, most used first, then alphabetical. */
export async function getTags(): Promise<Tag[]> {
	const posts = await getPosts();
	const byTag = new Map<string, Tag>();

	for (const post of posts) {
		for (const name of post.tags) {
			const slug = tagSlug(name);
			const tag = byTag.get(slug) ?? { name, slug, posts: [] };
			tag.posts.push(post);
			byTag.set(slug, tag);
		}
	}

	return [...byTag.values()].sort((a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name));
}

export function tagSlug(tag: string): string {
	return tag
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

export function tagHref(tag: string): string {
	return `/blog/tags/${tagSlug(tag)}/`;
}

/**
 * Rough reading time. Fenced code blocks are skipped: people skim config
 * dumps rather than read them, and counting them makes every homelab post
 * look like an hour of reading.
 */
function readingMinutes(body: string): number {
	const prose = body.replace(/```[\s\S]*?```/g, " ");
	const words = prose.split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function formatDate(date: Date): string {
	return date.toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" });
}

/** YYYY-MM-DD, the <lastmod> format required by the sitemaps protocol. */
export function isoDate(date: Date): string {
	return date.toISOString().slice(0, 10);
}
