import type { APIContext, GetStaticPaths } from "astro";
import { formatDate, posts, type Post } from "../../../lib/blog";

/** Markdown twin of a post: the body as authored, with a small header block. */
export const getStaticPaths = (() =>
	posts.map((post) => ({
		params: { slug: post.slug },
		props: { post },
	}))) satisfies GetStaticPaths;

export const GET = ({ props, site }: APIContext) => {
	const { post } = props as { post: Post };
	const origin = site ?? new URL("https://tomascorreia.net");

	const header = [
		`# ${post.title}`,
		"",
		formatDate(post.date) + (post.tags.length > 0 ? ` — ${post.tags.join(", ")}` : ""),
		"",
		`Canonical URL: ${new URL(`/blog/${post.slug}/`, origin).href}`,
	].join("\n");

	return new Response(`${header}\n\n---\n\n${post.body}\n`, {
		headers: { "Content-Type": "text/markdown; charset=utf-8" },
	});
};
