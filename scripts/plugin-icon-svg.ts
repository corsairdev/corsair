/**
 * SVG handling for plugin icons: sanitizing third-party SVG before corsair.dev
 * serves it, rendering it to PNG, and a variant of black marks for dark
 * surfaces.
 */
import DOMPurify from 'isomorphic-dompurify';
import sharp from 'sharp';

/** Size icons are rendered at when an SVG becomes a PNG. */
export const ICON_RENDER_SIZE = 256;

/** Larger SVGs are almost always an embedded raster, not a drawn mark. */
export const MAX_SVG_BYTES = 64 * 1024;

const HREF_ATTRIBUTES = new Set(['href', 'xlink:href']);
const LOCAL_REFERENCE = /^#[\w.:-]+$/;
const EMBEDDED_RASTER =
	/^data:image\/(png|jpeg|webp|gif);base64,[a-z0-9+/=\s]+$/i;
/**
 * A CSS `url(…)` that points outside the file. The lookahead sits right after
 * `url(`, so `url('#g')` and `url( #g)` stay local however the spaces fall.
 */
const EXTERNAL_CSS_URL = /url\((?!\s*['"]?\s*#)/i;

// One hook on the shared DOMPurify instance: links may only point inside the
// file (`#id`) or at an embedded raster, never at a URL the browser would fetch.
DOMPurify.addHook('uponSanitizeAttribute', (_node, data) => {
	const name = data.attrName.toLowerCase();
	const value = data.attrValue;
	if (HREF_ATTRIBUTES.has(name)) {
		const target = value.trim();
		if (!LOCAL_REFERENCE.test(target) && !EMBEDDED_RASTER.test(target)) {
			data.keepAttr = false;
		}
		return;
	}
	// Every other attribute, not only `style`: presentation attributes such as
	// `fill` take `url(…)` too. A backslash is a CSS escape (`u\72l(`) that
	// could hide a URL from this check, and no drawn icon needs one.
	if (EXTERNAL_CSS_URL.test(value) || value.includes('\\')) {
		data.keepAttr = false;
	}
});

export type SanitizeResult =
	| { ok: true; svg: string }
	| { ok: false; error: string };

/**
 * Strip anything that could run or fetch: scripts, event handlers,
 * foreignObject, links outside the file, CSS that loads a URL. The result is
 * served from corsair.dev, where a script would run on our origin if someone
 * opened the icon URL directly.
 */
export function sanitizeSvg(raw: string): SanitizeResult {
	if (Buffer.byteLength(raw) > MAX_SVG_BYTES) {
		return { ok: false, error: `svg is ${Buffer.byteLength(raw)} bytes` };
	}
	if (/<style[\s>]/i.test(raw)) {
		// None of the sourced marks need a stylesheet, and CSS can @import.
		return { ok: false, error: 'svg has a <style> element' };
	}
	const clean = DOMPurify.sanitize(raw, {
		USE_PROFILES: { svg: true, svgFilters: true },
		ADD_TAGS: ['use'],
		// Traced logos keep hairline strokes thin with it.
		ADD_ATTR: ['vector-effect'],
	});
	if (!/^<svg[\s>]/.test(clean.trim())) {
		return { ok: false, error: 'svg has no <svg> root after sanitizing' };
	}
	return { ok: true, svg: `${clean.trim()}\n` };
}

/** sharp (libvips) accepts SVG densities from 1 to 100000 dpi. */
const clampDensity = (dpi: number) => Math.min(100_000, Math.max(1, dpi));

/** Render an SVG to a square PNG, the longer side drawn at `size`. */
export async function renderSvgToPng(
	svg: string | Buffer,
	size = ICON_RENDER_SIZE,
): Promise<Buffer> {
	const bytes = Buffer.isBuffer(svg) ? svg : Buffer.from(svg);
	const { width, height } = await sharp(bytes).metadata();
	if (!width || !height) throw new Error('svg has no size');
	// Render at the density that makes the longer side `size`, so the PNG is
	// drawn sharp rather than scaled up from 72 dpi.
	const density = clampDensity((72 * size) / Math.max(width, height));
	return sharp(bytes, { density })
		.resize(size, size, {
			fit: 'contain',
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		})
		.png()
		.toBuffer();
}

/** Mean absolute difference per RGBA channel (0–255) between two renders. */
export async function renderDifference(a: Buffer, b: Buffer): Promise<number> {
	const size = 96;
	const raw = (png: Buffer) =>
		sharp(png).resize(size, size).ensureAlpha().raw().toBuffer();
	const [x, y] = await Promise.all([raw(a), raw(b)]);
	let total = 0;
	for (let i = 0; i < x.length; i++) total += Math.abs(x[i]! - y[i]!);
	return total / x.length;
}

/** A pixel counts as neutral (black, white, grey) under this chroma. */
const NEUTRAL_CHROMA = 0.2;

const isNeutral = (r: number, g: number, b: number) =>
	(Math.max(r, g, b) - Math.min(r, g, b)) / 255 <= NEUTRAL_CHROMA;

const linear = (c: number) => {
	const s = c / 255;
	return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

const luminanceOf = (r: number, g: number, b: number) =>
	0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);

export type InkAnalysis = {
	/** Share of the canvas covered by visible pixels. */
	coverage: number;
	/** Share of visible pixels that are dark (relative luminance under 0.1). */
	dark: number;
	/** Share of visible pixels with noticeable colour. */
	colourful: number;
	/** Share of visible pixels that are dark and neutral: black or near-black. */
	neutralDark: number;
};

/** What the visible pixels of an icon look like. */
export async function analyzeInk(png: Buffer): Promise<InkAnalysis> {
	const size = 64;
	const data = await sharp(png)
		.resize(size, size, {
			fit: 'contain',
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		})
		.ensureAlpha()
		.raw()
		.toBuffer();
	let visible = 0;
	let dark = 0;
	let colourful = 0;
	let neutralDark = 0;
	for (let i = 0; i < data.length; i += 4) {
		if (data[i + 3]! < 128) continue;
		visible++;
		const [r, g, b] = [data[i]!, data[i + 1]!, data[i + 2]!];
		const isDark = luminanceOf(r, g, b) < 0.1;
		const neutral = isNeutral(r, g, b);
		if (isDark) dark++;
		if (!neutral) colourful++;
		if (isDark && neutral) neutralDark++;
	}
	const share = (n: number) => (visible ? n / visible : 0);
	return {
		coverage: visible / (size * size),
		dark: share(dark),
		colourful: share(colourful),
		neutralDark: share(neutralDark),
	};
}

/**
 * A mark drawn largely in black on transparency (GitHub's octocat, Bubble's
 * "b"), which disappears on a dark surface. So does a near-black tile whose
 * details are cut out to transparency rather than drawn in white (Intercom).
 * A mark in dark brand colours (Datadog's purple) keeps them, and a dark tile
 * with details drawn on it (a white triangle on black, a blue mark on a black
 * square) reads on both.
 */
export function needsDarkVariant(ink: InkAnalysis): boolean {
	if (ink.coverage <= 0.02) return false;
	if (ink.coverage < 0.7) return ink.neutralDark > 0.3;
	// A dense near-black mark with no colour whose details are see-through:
	// they leave a tenth or more of the canvas empty (Intercom: 79% covered).
	// A tile with drawn details covers 95% or more and keeps its look.
	return ink.coverage < 0.9 && ink.neutralDark > 0.9 && ink.colourful < 0.05;
}

/** The colour with its HSL lightness mirrored (L → 1 − L), hue and saturation kept. */
function invertLightness(
	r: number,
	g: number,
	b: number,
): [number, number, number] {
	const [rn, gn, bn] = [r / 255, g / 255, b / 255];
	const max = Math.max(rn, gn, bn);
	const min = Math.min(rn, gn, bn);
	const l = (max + min) / 2;
	const d = max - min;
	if (d === 0) {
		const v = Math.round((1 - l) * 255);
		return [v, v, v];
	}
	const s = d / (1 - Math.abs(2 * l - 1));
	let h: number;
	if (max === rn) h = ((gn - bn) / d) % 6;
	else if (max === gn) h = (bn - rn) / d + 2;
	else h = (rn - gn) / d + 4;
	h *= 60;
	if (h < 0) h += 360;
	const l2 = 1 - l;
	const c = (1 - Math.abs(2 * l2 - 1)) * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l2 - c / 2;
	const [r1, g1, b1] =
		h < 60
			? [c, x, 0]
			: h < 120
				? [x, c, 0]
				: h < 180
					? [0, c, x]
					: h < 240
						? [0, x, c]
						: h < 300
							? [x, 0, c]
							: [c, 0, x];
	return [r1, g1, b1].map((v) => Math.round((v + m) * 255)) as [
		number,
		number,
		number,
	];
}

/**
 * The icon for dark surfaces: black and near-black become white and
 * near-white (dark navy turns light blue-grey, not cream), white details
 * inside a black mark become black, and coloured pixels keep their colour.
 * Alpha is unchanged.
 */
export async function darkVariantPng(png: Buffer): Promise<Buffer> {
	const { data, info } = await sharp(png)
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	for (let i = 0; i < data.length; i += 4) {
		const [r, g, b] = [data[i]!, data[i + 1]!, data[i + 2]!];
		if (!isNeutral(r, g, b)) continue;
		[data[i], data[i + 1], data[i + 2]] = invertLightness(r, g, b);
	}
	return sharp(data, { raw: info }).png().toBuffer();
}

export type TraceCheck = { traced: boolean; reasons: string[] };

/** All four viewBox numbers with two decimals, at least two of them `.00`. */
const TRACER_VIEWBOX =
	/viewBox="\s*(-?\d+\.\d\d)\s+(-?\d+\.\d\d)\s+(\d+\.\d\d)\s+(\d+\.\d\d)\s*"/;

/** Share of path commands that are rotated elliptical arcs, above which a file is a trace. */
const TRACER_ARC_SHARE = 0.2;

/**
 * Whether an SVG is an automatic raster-to-vector trace, or a raster wrapped
 * in SVG, rather than a drawn logo. Traces look fine at 26px but wobble at
 * full size: lines waver, corners round off, gradients collapse to one colour.
 *
 * The tracer behind most of them writes a viewBox like
 * `0.00 0.00 256.00 256.00`, coordinates with two decimals, hundreds of short
 * rotated arcs (`A 1.74 1.73 5.6 0 1 …`), and sometimes
 * `vector-effect="non-scaling-stroke"`. Drawn logos have none of these.
 * AI redraws (QuiverAI's comment) count too: they are vectorized guesses,
 * not the brand's artwork.
 */
export function detectTrace(svg: string): TraceCheck {
	const reasons: string[] = [];
	const viewBox = svg.match(TRACER_VIEWBOX);
	if (
		viewBox &&
		viewBox.slice(1).filter((n) => n.endsWith('.00')).length >= 2
	) {
		reasons.push(`tracer viewBox "${viewBox.slice(1).join(' ')}"`);
	}
	if (/non-scaling-stroke/.test(svg)) {
		reasons.push('vector-effect="non-scaling-stroke"');
	}
	const paths = [...svg.matchAll(/\sd="([^"]*)"/g)].map((m) => m[1]).join(' ');
	const commands = (paths.match(/[a-z]/gi) ?? []).length;
	const rotatedArcs = [
		...paths.matchAll(/A\s*[\d.]+[\s,]+[\d.]+[\s,]+(-?[\d.]+)/g),
	].filter((m) => Number(m[1]) !== 0).length;
	if (commands > 0 && rotatedArcs / commands > TRACER_ARC_SHARE) {
		reasons.push(
			`${Math.round((100 * rotatedArcs) / commands)}% of path commands are rotated arcs`,
		);
	}
	if (/<image[\s>]/i.test(svg)) {
		reasons.push('embeds a raster <image>');
	}
	if (/quiver\s*ai|quiver\.ai/i.test(svg)) {
		// Composio's logo-cdn has ~40 of these: an AI's vector redraw of a
		// raster logo, with shapes that drift from the brand's artwork.
		reasons.push('AI redraw (QuiverAI)');
	}
	return { traced: reasons.length > 0, reasons };
}

/**
 * Remove every match, repeating until none is left, so removing one match
 * can't join the text around it into a new one (`<!<!---->--` → `<!--`).
 */
function removeAll(text: string, pattern: RegExp): string {
	let previous: string;
	let current = text;
	do {
		previous = current;
		current = current.replace(pattern, '');
	} while (current !== previous);
	return current;
}

/** Up to three decimals, trailing zeros dropped (`12.5`, never `12.50`). */
const formatNumber = (n: number) => String(Number(n.toFixed(3)));

/**
 * Our cleaned copy of a sourced SVG: comments and editor leftovers gone, no
 * fixed width or height, and a square viewBox drawn tight around the visible
 * mark, so every icon fills its box the same way whatever padding the source
 * file had.
 */
export async function normalizeSvg(svg: string): Promise<string> {
	const open = svg.match(/<svg\b[^>]*>/);
	if (!open) throw new Error('no <svg> element');
	const attr = (name: string) =>
		open[0].match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
	const box = attr('viewBox')
		?.trim()
		.split(/[\s,]+/)
		.map(Number) ?? [
		0,
		0,
		Number.parseFloat(attr('width') ?? ''),
		Number.parseFloat(attr('height') ?? ''),
	];
	const [vx, vy, vw, vh] = box as [number, number, number, number];
	if (!(vw > 0 && vh > 0)) throw new Error('svg has no viewBox or size');

	// Measure on a copy sized exactly like its viewBox: a root width/height
	// with another aspect ratio would letterbox the drawing, and that padding
	// would be read as part of the mark.
	const measured = svg.replace(
		open[0],
		open[0]
			.replace(/\s(width|height)="[^"]*"/g, '')
			.replace(/^<svg/, `<svg width="${vw}" height="${vh}"`),
	);
	const size = 1024;
	const scale = size / Math.max(vw, vh);
	const { data, info } = await sharp(Buffer.from(measured), {
		density: clampDensity(72 * scale),
	})
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	let [minX, minY, maxX, maxY] = [info.width, info.height, -1, -1];
	for (let y = 0; y < info.height; y++) {
		for (let x = 0; x < info.width; x++) {
			if (data[(y * info.width + x) * 4 + 3]! <= 8) continue;
			if (x < minX) minX = x;
			if (x > maxX) maxX = x;
			if (y < minY) minY = y;
			if (y > maxY) maxY = y;
		}
	}
	if (maxX < 0) throw new Error('svg draws nothing visible');
	const unitsX = vw / info.width;
	const unitsY = vh / info.height;
	const x0 = vx + minX * unitsX;
	const y0 = vy + minY * unitsY;
	const w = (maxX + 1 - minX) * unitsX;
	const h = (maxY + 1 - minY) * unitsY;
	const side = Math.max(w, h);
	const viewBox = [x0 - (side - w) / 2, y0 - (side - h) / 2, side, side]
		.map(formatNumber)
		.join(' ');

	const rest = open[0]
		.replace(
			/\s(width|height|viewBox|version|x|y|class|id|xml:space|enable-background)="[^"]*"/g,
			'',
		)
		.replace(/^<svg/, '');
	return `${removeAll(svg, /<!--[\s\S]*?-->/g)
		.replace(open[0], `<svg viewBox="${viewBox}"${rest}`)
		.replace(/\n\s*\n/g, '\n')
		.trim()}\n`;
}

/** Presentation properties a class rule may set when it is inlined. */
const INLINABLE_PROPERTIES = new Set([
	'fill',
	'fill-opacity',
	'fill-rule',
	'clip-rule',
	'stroke',
	'stroke-width',
	'stroke-linecap',
	'stroke-linejoin',
	'stroke-miterlimit',
	'stroke-opacity',
	'opacity',
]);

/**
 * Turn an SVG's simple class stylesheet into presentation attributes, the way
 * Illustrator exports often look (`.st0 { fill: #3c247f; }` and
 * `class="st0"`). Returns the SVG unchanged when it has no `<style>`, and
 * null when the stylesheet holds anything but single-class rules setting the
 * properties above (media queries, imports, URLs, other selectors): those
 * need a person to look at.
 */
export function inlineClassStyles(svg: string): string | null {
	const styles = [...svg.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)];
	if (styles.length === 0) return svg;
	// Only double-quoted class and presentation attributes are rewritten
	// below; a file quoting them otherwise is left to a person.
	const attributeNames = ['class', ...INLINABLE_PROPERTIES].join('|');
	if (new RegExp(`\\s(${attributeNames})\\s*=\\s*'`, 'i').test(svg))
		return null;
	// Rules in stylesheet order: a later rule wins over an earlier one for the
	// same property, whatever order the element lists its classes in.
	const rules: Array<{ name: string; props: Array<[string, string]> }> = [];
	for (const [, css] of styles) {
		const body = removeAll(css!, /\/\*[\s\S]*?\*\//g).trim();
		if (/[@\\]|url\(/i.test(body)) return null;
		for (const rule of body.split('}')) {
			if (!rule.trim()) continue;
			const [selectors, declarations] = rule.split('{');
			if (declarations === undefined) return null;
			const props: Array<[string, string]> = [];
			for (const declaration of declarations.split(';')) {
				if (!declaration.trim()) continue;
				const [name, ...rest] = declaration.split(':');
				const prop = name!.trim().toLowerCase();
				const value = rest.join(':').trim();
				if (
					!INLINABLE_PROPERTIES.has(prop) ||
					!/^[#\w.%\s(),-]+$/.test(value)
				) {
					return null;
				}
				props.push([prop, value]);
			}
			for (const selector of selectors!.split(',')) {
				const name = selector.trim().match(/^\.([\w-]+)$/)?.[1];
				if (!name) return null;
				rules.push({ name, props });
			}
		}
	}
	return removeAll(svg, /<style\b[^>]*>[\s\S]*?<\/style>/gi)
		.replace(/<defs>\s*<\/defs>/g, '')
		.replace(
			/<([a-zA-Z]+)\b([^>]*?)\sclass="([^"]*)"([^>]*)>/g,
			(_m, tag, before, classes, after) => {
				const names = new Set(String(classes).trim().split(/\s+/));
				let attrs = `${before}${after}`;
				for (const rule of rules) {
					if (!names.has(rule.name)) continue;
					for (const [prop, value] of rule.props) {
						// A stylesheet rule beats a presentation attribute, so it replaces one.
						attrs = attrs.replace(new RegExp(`\\s${prop}="[^"]*"`), '');
						attrs = attrs.replace(/\s*(\/?)$/, ` ${prop}="${value}"$1`);
					}
				}
				return `<${tag}${attrs}>`;
			},
		);
}
