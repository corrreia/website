import type { APIContext, GetStaticPaths } from "astro";
import { formatDate, getPosts, tagHref, type Post } from "../../../lib/blog";

/** Markdown twin of a post: the body as authored, with a small header block. */
export const getStaticPaths = (async () => {
	const posts = await getPosts();
	return posts.map((post) => ({ params: { slug: post.slug }, props: { post } }));
}) satisfies GetStaticPaths;

export const GET = ({ props, site }: APIContext) => {
	const { post } = props as { post: Post };
	const origin = site ?? new URL("https://tomascorreia.net");

	const header = [
		`# ${post.title}`,
		"",
		`${formatDate(post.date)} — ${post.readingMinutes} min read`,
		...(post.tags.length > 0
			? [`Tags: ${post.tags.map((tag) => `[${tag}](${new URL(tagHref(tag), origin).href})`).join(", ")}`]
			: []),
		"",
		`Canonical URL: ${new URL(post.href, origin).href}`,
	].join("\n");

	return new Response(`${header}\n\n---\n\n${post.body}\n`, {
		headers: { "Content-Type": "text/markdown; charset=utf-8" },
	});
};
