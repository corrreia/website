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

## Writing a post

Posts live at `src/content/blog/<folder>/index.md`, with images in that same
folder. Frontmatter is validated by the schema in `src/content.config.ts`, so a
missing title or an unparseable date fails the build rather than rendering
"Invalid Date":

```yaml
---
title: Running Kubernetes on my Homelab
date: 2025-08-29
description: One line, used in listings, the feed and the social card.
tags: [homelab, kubernetes]
draft: false # true keeps it out of production builds but visible in `npm run dev`
---
```

The slug comes from the folder name unless frontmatter sets `slug`. Everything
else — reading time, tag pages, the feed, the sitemap, the social card — is
derived, so publishing is just adding the folder.

Tag code fences with a language (` ```bash `, ` ```yaml `) so
[Expressive Code](https://expressive-code.com/) can highlight and frame them;
untagged fences render as plain text.

## Machine-readable endpoints

The site publishes a few things for crawlers, feed readers and agents. All of
them are generated from the posts themselves, so they stay correct as content
changes — there is nothing to update by hand when publishing.

| Path | Source | Notes |
| --- | --- | --- |
| `/robots.txt` | `src/pages/robots.txt.ts` | RFC 9309 rules, `Content-Signal` preferences, sitemap reference |
| `/sitemap.xml` | `src/pages/sitemap.xml.ts` | Canonical URLs with `lastmod`, including tag pages |
| `/rss.xml` | `src/pages/rss.xml.ts` | Feed of all published posts |
| `/blog/<slug>/og.png` | `src/pages/blog/[slug]/og.png.ts` | Per-post social card, rendered at build time |
| `/index.md`, `/blog/index.md`, `/blog/<slug>/index.md`, `/blog/tags/<tag>/index.md` | `src/pages/**/*.md.ts` | Markdown twin of each page |

`src/worker.ts` sits in front of the static assets and adds two behaviours:

- **Markdown content negotiation.** A request with `Accept: text/markdown` gets
  the markdown twin of the page as `text/markdown`, with an approximate
  `x-markdown-tokens` count. HTML stays the default for browsers.
- **`Link` headers** (RFC 8288) pointing at the sitemap, the canonical URL, the
  markdown alternate and the feed.

Because of this, `wrangler.jsonc` sets `assets.run_worker_first`, so requests
reach the Worker before the asset server.

### Social cards

`src/lib/og.ts` lays a card out with [satori](https://github.com/vercel/satori)
and rasterises it with sharp. Text is converted to paths during layout, so the
result does not depend on fonts installed on the build machine — the two `.ttf`
files in `src/assets/fonts/` are read directly and are build-time only. Pages
without their own card fall back to `/img/social.png`.

### Fonts

Fraunces, Geist and JetBrains Mono are self-hosted through
`experimental.fonts` in `astro.config.mjs`: Astro downloads, subsets and
preloads them at build time, and exposes each as a CSS variable that
`src/styles/global.css` maps onto `--font-display`, `--font-body` and
`--font-mono`. Nothing is requested from `fonts.googleapis.com` at runtime.

### AI crawler policy

Everything is allowed: search, answer engines, and model training. The policy
lives in `src/pages/robots.txt.ts` as two lists, both `Allow: /`:

- `SEARCH_AGENTS` — search and answer engines.
- `TRAINING_AGENTS` — crawlers and opt-out tokens used for model training.

Both groups carry `Content-Signal: search=yes, ai-input=yes, ai-train=yes`,
which states the same permission declaratively. To withdraw a permission, edit
`CONTENT_SIGNAL` and switch the matching group to `Disallow: /`.
