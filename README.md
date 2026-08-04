# Website

This website is a simple [Astro](https://astro.build/) blog.

## Installation

```bash
npm install
```

## Local Development

```bash
npm run dev
```

This command starts a local development server. Most changes are reflected live without restarting.

## Build

```bash
npm run build
```

This command generates static content into the `dist` directory.

## Deployment

```bash
npm run deploy
```

## Machine-readable endpoints

The site publishes a few things for crawlers and agents. All of them are
generated from the posts themselves, so they stay correct as content changes —
there is nothing to update by hand when publishing.

| Path | Source | Notes |
| --- | --- | --- |
| `/robots.txt` | `src/pages/robots.txt.ts` | RFC 9309 rules, `Content-Signal` preferences, sitemap reference |
| `/sitemap.xml` | `src/pages/sitemap.xml.ts` | Canonical URLs with `lastmod` |
| `/index.md`, `/blog/index.md`, `/blog/<slug>/index.md` | `src/pages/**/*.md.ts` | Markdown twin of each page |

`src/worker.ts` sits in front of the static assets and adds two behaviours:

- **Markdown content negotiation.** A request with `Accept: text/markdown` gets
  the markdown twin of the page as `text/markdown`, with an approximate
  `x-markdown-tokens` count. HTML stays the default for browsers.
- **`Link` headers** (RFC 8288) pointing at the sitemap, the canonical URL and
  the markdown alternate.

Because of this, `wrangler.jsonc` sets `assets.run_worker_first`, so requests
reach the Worker before the asset server.

### AI crawler policy

Everything is allowed: search, answer engines, and model training. The policy
lives in `src/pages/robots.txt.ts` as two lists, both `Allow: /`:

- `SEARCH_AGENTS` — search and answer engines.
- `TRAINING_AGENTS` — crawlers and opt-out tokens used for model training.

Both groups carry `Content-Signal: search=yes, ai-input=yes, ai-train=yes`,
which states the same permission declaratively. To withdraw a permission, edit
`CONTENT_SIGNAL` and switch the matching group to `Disallow: /`.
