import type { APIContext } from "astro";
import { formatDate, posts } from "../lib/blog";

/** Markdown twin of the homepage, served to agents that ask for text/markdown. */
export const GET = ({ site }: APIContext) => {
	const origin = site ?? new URL("https://tomascorreia.net");
	const latest = posts.slice(0, 3);

	const body = `# Tomás Correia

Engineering @ MEO — WebDev · Homelabbing · Home automation.

Collection of my adventures in tech and in my homelab.

## Latest posts

${latest.map((post) => `- [${post.title}](${new URL(`/blog/${post.slug}/`, origin).href}) — ${formatDate(post.date)}${post.description ? `. ${post.description}` : ""}`).join("\n")}

All posts: ${new URL("/blog/", origin).href}

## Elsewhere

- CV: https://cv.tomascorreia.net
- GitHub: https://github.com/corrreia
`;

	return new Response(body, {
		headers: { "Content-Type": "text/markdown; charset=utf-8" },
	});
};
