import type { APIContext } from "astro";

/**
 * robots.txt, generated at build time so the Sitemap URL always tracks
 * `site` in astro.config.mjs.
 *
 * Format: RFC 9309 (https://www.rfc-editor.org/rfc/rfc9309)
 * Content Signals: https://contentsignals.org/
 *
 * Policy: the site is fully open to crawlers that index or cite it, and
 * closed to crawlers whose only purpose is collecting training data. The
 * Content-Signal line states the same preference declaratively, for agents
 * that read it.
 */

const CONTENT_SIGNAL = "search=yes, ai-input=yes, ai-train=no";

/** Crawlers that index the site or fetch it to answer a question, with attribution. */
const ALLOWED_AGENTS = [
	"Googlebot",
	"Bingbot",
	"DuckDuckBot",
	"Applebot",
	"OAI-SearchBot",
	"ChatGPT-User",
	"Claude-User",
	"Claude-SearchBot",
	"PerplexityBot",
	"Perplexity-User",
];

/**
 * Crawlers and opt-out tokens that exist to gather model training data.
 * Disallowing these is the enforcement half of `ai-train=no`; none of them
 * affect search visibility.
 */
const TRAINING_AGENTS = [
	"GPTBot",
	"ClaudeBot",
	"anthropic-ai",
	"Claude-Web",
	"Google-Extended",
	"Applebot-Extended",
	"Amazonbot",
	"Meta-ExternalAgent",
	"Bytespider",
	"CCBot",
	"cohere-ai",
];

function group(agents: string[], rule: string): string {
	return [...agents.map((agent) => `User-agent: ${agent}`), `Content-Signal: ${CONTENT_SIGNAL}`, rule].join("\n");
}

export const GET = ({ site }: APIContext) => {
	const origin = site ?? new URL("https://tomascorreia.net");

	const body = `# robots.txt for ${origin.origin}/
# Syntax: RFC 9309 <https://www.rfc-editor.org/rfc/rfc9309>
#
# Content-Signal declares how this content may be used once accessed
# <https://contentsignals.org/>. It is a statement of preference, not an
# access control:
#   search=yes    indexing and linking back here is welcome
#   ai-input=yes  fetching at answer time is welcome, with attribution
#   ai-train=no   do not use this content to train or fine-tune models

# Everything on this site is public. Nothing here is private or paywalled.
${group(["*"], "Allow: /")}

# Search engines and answer engines that cite their sources.
${group(ALLOWED_AGENTS, "Allow: /")}

# Training-data collection. See ai-train=no above.
${group(TRAINING_AGENTS, "Disallow: /")}

Sitemap: ${new URL("/sitemap.xml", origin).href}
`;

	return new Response(body, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};
