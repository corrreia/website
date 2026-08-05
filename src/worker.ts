/**
 * Cloudflare Worker in front of the static assets in ./dist.
 *
 * It adds two things the static build cannot do on its own:
 *
 *  1. Content negotiation — a request for a page with `Accept: text/markdown`
 *     gets the markdown twin of that page (built by the `*.md.ts` endpoints
 *     under src/pages) instead of HTML. HTML stays the default for browsers.
 *     See https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/
 *
 *  2. `Link` response headers (RFC 8288) pointing agents at the sitemap, the
 *     canonical URL, and the markdown alternate of the page they asked for.
 *
 * Every request reaches this Worker because `assets.run_worker_first` is set
 * in wrangler.jsonc; anything not handled here is passed straight through to
 * the asset server.
 */

interface Env {
	ASSETS: { fetch: (request: Request) => Promise<Response> };
}

const SITEMAP_PATH = "/sitemap.xml";
const FEED_PATH = "/rss.xml";

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		const isRead = request.method === "GET" || request.method === "HEAD";

		if (isRead && prefersMarkdown(request.headers.get("Accept"))) {
			const markdown = await fetchMarkdown(request, env, url);
			if (markdown) return markdown;
		}

		const response = await env.ASSETS.fetch(request);
		if (!isHtml(response)) return response;

		const decorated = new Response(response.body, response);
		applyDiscoveryHeaders(decorated.headers, url);
		return decorated;
	},
};

/**
 * True when the client explicitly asked for markdown and did not rank HTML
 * above it. A wildcard accept header is not an explicit request, so browsers
 * and plain `curl` keep getting HTML.
 */
function prefersMarkdown(accept: string | null): boolean {
	if (!accept) return false;

	const quality = (type: string): number => {
		for (const part of accept.split(",")) {
			const [mediaType, ...params] = part.split(";").map((token) => token.trim());
			if (mediaType?.toLowerCase() !== type) continue;
			const q = params.find((param) => param.toLowerCase().startsWith("q="));
			return q ? Number.parseFloat(q.slice(2)) || 0 : 1;
		}
		return 0;
	};

	const markdown = quality("text/markdown");
	return markdown > 0 && markdown >= quality("text/html");
}

/** Path of the markdown twin of a page, or null if the path is not a page. */
function markdownPathFor(pathname: string): string | null {
	const lastSegment = pathname.split("/").pop() ?? "";
	if (lastSegment.includes(".")) return null; // already a file: .xml, .png, .md …
	return pathname.endsWith("/") ? `${pathname}index.md` : `${pathname}/index.md`;
}

async function fetchMarkdown(request: Request, env: Env, url: URL): Promise<Response | null> {
	const markdownPath = markdownPathFor(url.pathname);
	if (!markdownPath) return null;

	const assetUrl = new URL(markdownPath, url.origin);
	const asset = await env.ASSETS.fetch(new Request(assetUrl.toString(), { headers: request.headers }));
	if (!asset.ok) return null;

	const body = await asset.text();
	const headers = new Headers({
		"Content-Type": "text/markdown; charset=utf-8",
		// Approximation (~4 characters per token); good enough for an agent
		// deciding whether a page fits in its context window.
		"x-markdown-tokens": String(Math.ceil(body.length / 4)),
		"Cache-Control": asset.headers.get("Cache-Control") ?? "public, max-age=3600",
	});
	applyDiscoveryHeaders(headers, url);

	return new Response(request.method === "HEAD" ? null : body, { headers });
}

function isHtml(response: Response): boolean {
	return response.headers.get("Content-Type")?.includes("text/html") ?? false;
}

/** Link headers (RFC 8288) plus the Vary that keeps caches honest. */
function applyDiscoveryHeaders(headers: Headers, url: URL): void {
	const canonical = new URL(url.pathname, url.origin).href;
	const links = [
		`<${SITEMAP_PATH}>; rel="describedby"; type="application/xml"`,
		`<${canonical}>; rel="canonical"`,
		`<${FEED_PATH}>; rel="alternate"; type="application/rss+xml"`,
	];

	const markdownPath = markdownPathFor(url.pathname);
	if (markdownPath) {
		links.push(`<${markdownPath}>; rel="alternate"; type="text/markdown"`);
	}

	headers.set("Link", links.join(", "));
	headers.append("Vary", "Accept");
}
