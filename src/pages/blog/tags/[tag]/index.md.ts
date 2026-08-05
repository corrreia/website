import type { APIContext, GetStaticPaths } from "astro";
import { formatDate, getTags, type Tag } from "../../../../lib/blog";

/** Markdown twin of a tag page. */
export const getStaticPaths = (async () => {
	const tags = await getTags();
	return tags.map((tag) => ({ params: { tag: tag.slug }, props: { tag } }));
}) satisfies GetStaticPaths;

export const GET = ({ props, site }: APIContext) => {
	const { tag } = props as { tag: Tag };
	const origin = site ?? new URL("https://tomascorreia.net");
	const count = tag.posts.length;

	const body = `# Posts tagged ${tag.name}

${count} post${count === 1 ? "" : "s"} with this tag.

${tag.posts
	.map(
		(post) =>
			`- [${post.title}](${new URL(post.href, origin).href}) — ${formatDate(post.date)}, ${post.readingMinutes} min read${post.description ? `. ${post.description}` : ""}`,
	)
	.join("\n")}
`;

	return new Response(body, {
		headers: { "Content-Type": "text/markdown; charset=utf-8" },
	});
};
