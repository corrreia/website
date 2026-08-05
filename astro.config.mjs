import expressiveCode from "astro-expressive-code";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
	// Must match the custom domain in wrangler.jsonc: it is the origin used for
	// canonical URLs in sitemap.xml, robots.txt, RSS and the markdown endpoints.
	site: "https://tomascorreia.net",

	integrations: [
		expressiveCode({
			// Warm light/dark pair; Expressive Code emits a
			// prefers-color-scheme media query for the two, matching how the
			// rest of the site switches themes.
			themes: ["vitesse-light", "vitesse-dark"],
			styleOverrides: {
				borderRadius: "8px",
				borderColor: "var(--line)",
				codeBackground: "var(--code-bg)",
				codeFontFamily: "var(--font-mono)",
				codeFontSize: "0.9rem",
				uiFontFamily: "var(--font-body)",
				frames: {
					shadowColor: "transparent",
					editorTabBarBackground: "var(--bg-tint)",
					editorActiveTabBackground: "var(--code-bg)",
					terminalBackground: "var(--code-bg)",
					terminalTitlebarBackground: "var(--bg-tint)",
				},
			},
		}),
	],

	markdown: {
		rehypePlugins: [
			rehypeSlug,
			[
				rehypeAutolinkHeadings,
				{
					behavior: "append",
					properties: { class: "heading-anchor", ariaHidden: "true", tabIndex: -1 },
					// The link is left empty and its "#" comes from CSS: any real
					// text node here would end up inside the heading, and so in
					// the `headings` list Astro derives the table of contents from.
					content: [],
				},
			],
		],
	},

	experimental: {
		// Self-hosted, subset and preloaded at build time — no request to
		// fonts.googleapis.com from the browser.
		fonts: [
			{
				provider: fontProviders.google(),
				name: "Fraunces",
				cssVariable: "--font-fraunces",
				weights: [400, 500, 600, 700],
				styles: ["normal", "italic"],
				subsets: ["latin"],
				fallbacks: ["ui-serif", "Georgia", "Times New Roman", "serif"],
			},
			{
				provider: fontProviders.google(),
				name: "Geist",
				cssVariable: "--font-geist",
				weights: [300, 400, 500, 600, 700],
				subsets: ["latin"],
				fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
			},
			{
				provider: fontProviders.google(),
				name: "JetBrains Mono",
				cssVariable: "--font-jetbrains",
				weights: [400, 500],
				subsets: ["latin"],
				fallbacks: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
			},
		],
	},
});
