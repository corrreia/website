import type { APIContext } from "astro";
import { formatDate, posts } from "../../lib/blog";

/** Markdown twin of the blog index. */
export const GET = ({ site }: APIContext) => {
	const origin = site ?? new URL("https://tomascorreia.net");

	const body = `# Blog

Notes on homelab projects, infrastructure, and the occasional debugging session.

${posts
	.map((post) =>
		[
			`## [${post.title}](${new URL(`/blog/${post.slug}/`, origin).href})`,
			"",
			formatDate(post.date) + (post.tags.length > 0 ? ` — ${post.tags.join(", ")}` : ""),
			...(post.description ? ["", post.description] : []),
		].join("\n"),
	)
	.join("\n\n")}
`;

	return new Response(body, {
		headers: { "Content-Type": "text/markdown; charset=utf-8" },
	});
};
