interface PostModule {
	frontmatter: Record<string, any>;
}

const postModules = import.meta.glob<PostModule>("../content/blog/**/index.md", { eager: true });
const rawModules = import.meta.glob<string>("../content/blog/**/index.md", {
	eager: true,
	query: "?raw",
	import: "default",
});

export interface Post {
	slug: string;
	title: string;
	description?: string;
	date: Date;
	tags: string[];
	/** Post body as authored, with the YAML frontmatter block removed. */
	body: string;
}

export const posts: Post[] = Object.entries(postModules)
	.map(([path, post]) => {
		const folder = path.split("/").at(-2) ?? "";
		return {
			slug: post.frontmatter.slug ?? folder,
			title: post.frontmatter.title,
			description: post.frontmatter.description,
			date: new Date(post.frontmatter.date),
			tags: post.frontmatter.tags ?? [],
			body: stripFrontmatter(rawModules[path] ?? ""),
		};
	})
	.sort((a, b) => b.date.valueOf() - a.date.valueOf());

function stripFrontmatter(raw: string): string {
	return raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "").trim();
}

export function formatDate(date: Date): string {
	return date.toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" });
}

/** YYYY-MM-DD, the <lastmod> format required by the sitemaps protocol. */
export function isoDate(date: Date): string {
	return date.toISOString().slice(0, 10);
}
