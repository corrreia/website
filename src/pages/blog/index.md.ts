import type { APIContext } from "astro";
import { formatDate, getPosts, tagHref } from "../../lib/blog";

/** Markdown twin of the blog index. */
export const GET = async ({ site }: APIContext) => {
	const origin = site ?? new URL("https://tomascorreia.net");
	const posts = await getPosts();

	const body = `# Blog

Notes on homelab projects, infrastructure, and the occasional debugging session.

Feed: ${new URL("/rss.xml", origin).href}

${posts
	.map((post) =>
		[
			`## [${post.title}](${new URL(post.href, origin).href})`,
			"",
			`${formatDate(post.date)} — ${post.readingMinutes} min read`,
			...(post.tags.length > 0
				? ["", `Tags: ${post.tags.map((tag) => `[${tag}](${new URL(tagHref(tag), origin).href})`).join(", ")}`]
				: []),
			...(post.description ? ["", post.description] : []),
		].join("\n"),
	)
	.join("\n\n")}
`;

	return new Response(body, {
		headers: { "Content-Type": "text/markdown; charset=utf-8" },
	});
};
