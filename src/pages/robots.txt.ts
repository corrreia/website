import type { APIContext } from "astro";

/**
 * robots.txt, generated at build time so the Sitemap URL always tracks
 * `site` in astro.config.mjs.
 *
 * Format: RFC 9309 (https://www.rfc-editor.org/rfc/rfc9309)
 * Content Signals: https://contentsignals.org/
 *
 * Policy: the site is open to every crawler, for search, for answering
 * questions, and for model training. The Content-Signal line states the same
 * permission declaratively, for agents that read it.
 */

const CONTENT_SIGNAL = "search=yes, ai-input=yes, ai-train=yes";

/** Crawlers that index the site or fetch it to answer a question. */
const SEARCH_AGENTS = [
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
 * Crawlers and opt-out tokens used to gather model training data. Listed
 * explicitly, and allowed, so the permission is unambiguous to anything that
 * reads only the user-agent rules and ignores Content-Signal.
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
# <https://contentsignals.org/>:
#   search=yes    indexing and linking back here is welcome
#   ai-input=yes  fetching at answer time is welcome
#   ai-train=yes  using this content to train or fine-tune models is welcome

# Everything on this site is public. Nothing here is private or paywalled.
${group(["*"], "Allow: /")}

# Search engines and answer engines.
${group(SEARCH_AGENTS, "Allow: /")}

# AI crawlers, including training-data collection. See ai-train=yes above.
${group(TRAINING_AGENTS, "Allow: /")}

Sitemap: ${new URL("/sitemap.xml", origin).href}
`;

	return new Response(body, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};
