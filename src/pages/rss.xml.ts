import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPosts } from "../lib/blog";

export const GET = async ({ site }: APIContext) => {
	const origin = site ?? new URL("https://tomascorreia.net");
	const posts = await getPosts();

	return rss({
		title: "Tomás Correia",
		description: "Notes on homelab projects, infrastructure, and the occasional debugging session.",
		site: origin,
		items: posts.map((post) => ({
			title: post.title,
			pubDate: post.date,
			description: post.description,
			link: post.href,
			categories: post.tags,
		})),
		customData: "<language>en</language>",
	});
};
