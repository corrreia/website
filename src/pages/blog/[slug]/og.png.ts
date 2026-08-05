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

	return new Response(new Uint8Array(png), {
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
};
