import type { APIContext } from "astro";
import { getPosts, getTags, isoDate } from "../lib/blog";

/**
 * /sitemap.xml, per https://www.sitemaps.org/protocol.html
 *
 * Built from the same post list the pages render from, so publishing or
 * removing a post updates the sitemap on the next build with no extra step.
 */

interface Entry {
	path: string;
	lastmod: Date;
	changefreq: string;
	priority: string;
}

function escapeXml(value: string): string {
	return value.replace(/[<>&'"]/g, (char) => {
		switch (char) {
			case "<":
				return "&lt;";
			case ">":
				return "&gt;";
			case "&":
				return "&amp;";
			case "'":
				return "&apos;";
			default:
				return "&quot;";
		}
	});
}

export const GET = async ({ site }: APIContext) => {
	const origin = site ?? new URL("https://tomascorreia.net");
	const posts = await getPosts();
	const tags = await getTags();
	const newest = posts[0]?.date ?? new Date();

	const entries: Entry[] = [
		{ path: "/", lastmod: newest, changefreq: "weekly", priority: "1.0" },
		{ path: "/blog/", lastmod: newest, changefreq: "weekly", priority: "0.8" },
		...posts.map((post) => ({
			path: post.href,
			lastmod: post.date,
			changefreq: "monthly",
			priority: "0.7",
		})),
		...tags.map((tag) => ({
			path: `/blog/tags/${tag.slug}/`,
			// Newest post carrying the tag: getPosts() is already sorted.
			lastmod: tag.posts[0]?.date ?? newest,
			changefreq: "monthly",
			priority: "0.4",
		})),
	];

	const urls = entries
		.map((entry) =>
			[
				"\t<url>",
				`\t\t<loc>${escapeXml(new URL(entry.path, origin).href)}</loc>`,
				`\t\t<lastmod>${isoDate(entry.lastmod)}</lastmod>`,
				`\t\t<changefreq>${entry.changefreq}</changefreq>`,
				`\t\t<priority>${entry.priority}</priority>`,
				"\t</url>",
			].join("\n"),
		)
		.join("\n");

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

	return new Response(body, {
		headers: { "Content-Type": "application/xml; charset=utf-8" },
	});
};
