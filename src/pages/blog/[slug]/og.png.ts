import type { APIContext, GetStaticPaths } from "astro";
import { formatDate, getPosts, type Post } from "../../../lib/blog";
import { renderOgImage } from "../../../lib/og";

/** Per-post social card, rendered at build time to /blog/<slug>/og.png. */
export const getStaticPaths = (async () => {
	const posts = await getPosts();
	return posts.map((post) => ({ params: { slug: post.slug }, props: { post } }));
}) satisfies GetStaticPaths;

export const GET = async ({ props }: APIContext) => {
	const { post } = props as { post: Post };

	const meta = [formatDate(post.date), `${post.readingMinutes} min read`, ...post.tags.map((tag) => `#${tag}`)].join(
		"  ·  ",
	);

	const png = await renderOgImage({ title: post.title, meta });

	// No Cache-Control here: this is a static build, so Astro writes the body to
	// dist and drops the headers. Caching is whatever Cloudflare serves assets
	// with (currently must-revalidate against an ETag), which is what we want —
	// the URL is stable but its content changes when the post title does.
	return new Response(new Uint8Array(png), {
		headers: { "Content-Type": "image/png" },
	});
};
