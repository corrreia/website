import { defineConfig } from "astro/config";

export default defineConfig({
	// Must match the custom domain in wrangler.jsonc: it is the origin used for
	// canonical URLs in sitemap.xml, robots.txt and the markdown endpoints.
	site: "https://tomascorreia.net",
});
