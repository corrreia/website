import { readFile } from "node:fs/promises";
import path from "node:path";
import satori from "satori";
import sharp from "sharp";

/**
 * Open Graph card renderer.
 *
 * satori lays the card out and emits SVG with the text already converted to
 * paths, then sharp rasterises it — so the result does not depend on any font
 * being installed on the machine that runs the build.
 */

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

// Dark palette from global.css, so cards match the site in dark mode.
const BG = "#131512";
const SURFACE = "#1b1e19";
const TEXT = "#f0eee7";
const MUTED = "#a8afa7";
const ACCENT = "#76c9a0";

// Fonts are read from the project directory rather than resolved relative to
// this module: during `astro build` these endpoints run from bundled chunks,
// where import.meta.url no longer points at src/.
const FONT_DIR = path.join(process.cwd(), "src/assets/fonts");

let fontCache: Awaited<ReturnType<typeof loadFonts>> | undefined;

async function loadFonts() {
	const [display, body] = await Promise.all([
		readFile(path.join(FONT_DIR, "fraunces-600.ttf")),
		readFile(path.join(FONT_DIR, "geist-400.ttf")),
	]);
	return [
		{ name: "Fraunces", data: display, weight: 600 as const, style: "normal" as const },
		{ name: "Geist", data: body, weight: 400 as const, style: "normal" as const },
	];
}

/** satori takes a React-ish element tree; these helpers build it without JSX. */
function box(style: Record<string, unknown>, children: unknown): unknown {
	return { type: "div", props: { style: { display: "flex", ...style }, children } };
}

function text(content: string, style: Record<string, unknown>): unknown {
	return { type: "div", props: { style, children: content } };
}

export interface OgCard {
	title: string;
	/** Small line under the title — date, reading time, tags. */
	meta?: string;
	/** Wordmark in the top-left corner. */
	eyebrow?: string;
}

export async function renderOgImage({ title, meta, eyebrow = "tomascorreia.net" }: OgCard): Promise<Buffer> {
	fontCache ??= await loadFonts();

	const card = box(
		{
			width: "100%",
			height: "100%",
			flexDirection: "column",
			justifyContent: "space-between",
			background: BG,
			padding: "64px 72px",
			fontFamily: "Geist",
			// A soft accent wash in the corner, echoing the site's background.
			backgroundImage: `radial-gradient(1000px 500px at 100% 0%, ${SURFACE} 0%, ${BG} 70%)`,
		},
		[
			box({ alignItems: "center", gap: "14px" }, [
				box({ width: "12px", height: "12px", borderRadius: "999px", background: ACCENT }, []),
				text(eyebrow, { fontSize: 26, color: MUTED, letterSpacing: "0.02em" }),
			]),
			box({ flexDirection: "column", gap: "28px" }, [
				text(title, {
					fontFamily: "Fraunces",
					fontSize: title.length > 55 ? 68 : 84,
					lineHeight: 1.08,
					color: TEXT,
					letterSpacing: "-0.02em",
					// satori has no line clamp; the size step above keeps long
					// titles inside the card.
					display: "block",
				}),
				box({ width: "120px", height: "5px", borderRadius: "999px", background: ACCENT }, []),
			]),
			text(meta ?? "", { fontSize: 28, color: MUTED }),
		],
	);

	const svg = await satori(card as Parameters<typeof satori>[0], {
		width: OG_WIDTH,
		height: OG_HEIGHT,
		fonts: fontCache,
	});

	return sharp(Buffer.from(svg)).png().toBuffer();
}
