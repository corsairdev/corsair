import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

import {
	analyzeInk,
	darkVariantPng,
	detectTrace,
	inlineClassStyles,
	needsDarkVariant,
	normalizeSvg,
	renderDifference,
	renderSvgToPng,
	sanitizeSvg,
} from './plugin-icon-svg.ts';

const svg = (body: string, attrs = '') =>
	`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"${attrs}>${body}</svg>`;

const BLACK_CIRCLE = svg('<circle cx="12" cy="12" r="8" fill="#111"/>');
const IMPLICIT_BLACK = svg('<path d="M4 4h16v4H4zM4 12h10v4H4z"/>');
const COLOURFUL = svg(
	'<rect x="2" y="2" width="10" height="10" fill="#e01e5a"/><rect x="12" y="12" width="10" height="10" fill="#2eb67d"/>',
);
const BLACK_TILE = svg(
	'<rect width="24" height="24" fill="#000"/><path d="M12 5l7 13H5z" fill="#fff"/>',
);

test('sanitizeSvg strips scripts, handlers, foreignObject and outside links', () => {
	const result = sanitizeSvg(
		svg(
			'<script>alert(1)</script><foreignObject><div>x</div></foreignObject>' +
				'<a href="javascript:alert(2)"><path d="M0 0h1v1z"/></a>' +
				'<image href="https://example.com/track.png"/>' +
				'<path d="M1 1h2v2z" style="fill:url(https://example.com/x)"/>',
			' onload="alert(3)"',
		),
	);
	assert.equal(result.ok, true);
	if (!result.ok) return;
	for (const bad of [
		'script',
		'onload',
		'foreignObject',
		'javascript:',
		'example.com',
	]) {
		assert.equal(result.svg.includes(bad), false, bad);
	}
	assert.ok(result.svg.includes('<path d="M0 0h1v1z"'));
});

test('sanitizeSvg keeps local references, gradients and embedded rasters', () => {
	const result = sanitizeSvg(
		svg(
			'<defs><linearGradient id="g"><stop offset="0" stop-color="#f00"/></linearGradient>' +
				'<path id="p" d="M0 0h4v4z"/></defs><use href="#p" fill="url(#g)"/>' +
				'<image href="data:image/png;base64,iVBORw0KGgo=" width="1" height="1"/>',
		),
	);
	assert.equal(result.ok, true);
	if (!result.ok) return;
	assert.ok(result.svg.includes('<use href="#p"'));
	assert.ok(result.svg.includes('fill="url(#g)"'));
	assert.ok(result.svg.includes('linearGradient'));
	assert.ok(result.svg.includes('data:image/png;base64'));
});

test('sanitizeSvg keeps local url() however it is spaced or quoted', () => {
	for (const style of [
		"fill:url('#g')",
		'fill:url( #g)',
		"fill:url(  '#g' )",
	]) {
		const result = sanitizeSvg(svg(`<path d="M0 0h4v4z" style="${style}"/>`));
		assert.equal(result.ok, true);
		if (result.ok) assert.ok(result.svg.includes('style='), style);
	}
});

test('sanitizeSvg drops outside URLs in any attribute, escaped or not', () => {
	for (const attr of [
		'fill="url(https://example.com/p.svg#g)"',
		'style="fill:url( https://example.com/p.svg#g)"',
		'style="fill:u\\72l(https://example.com/p.svg#g)"',
	]) {
		const result = sanitizeSvg(svg(`<path d="M0 0h4v4z" ${attr}/>`));
		assert.equal(result.ok, true);
		if (result.ok) assert.doesNotMatch(result.svg, /url\(\s*['"]?https/, attr);
	}
});

test('renderSvgToPng draws a very large viewBox', async () => {
	const png = await renderSvgToPng(
		'<svg xmlns="http://www.w3.org/2000/svg" width="20000" height="10000" viewBox="0 0 20000 10000"><rect width="20000" height="10000" fill="#e01e5a"/></svg>',
	);
	const meta = await sharp(png).metadata();
	assert.equal(meta.width, 256);
	assert.equal(meta.height, 256);
});

test('sanitizeSvg refuses stylesheets and oversized files', () => {
	assert.equal(sanitizeSvg(svg('<style>@import "x.css";</style>')).ok, false);
	assert.equal(
		sanitizeSvg(svg(`<path d="${'M0 0'.repeat(20000)}"/>`)).ok,
		false,
	);
});

const OUTLINED = svg(
	'<path d="M12 2L22 20H2z" fill="#000"/><path d="M12 9L16 16H8z" fill="#fff"/>',
);
const BLACK_WITH_ACCENT = svg(
	'<rect x="4" y="2" width="5" height="18" fill="#111"/><circle cx="17" cy="17" r="3" fill="#1d4ed8"/>',
);
const PURPLE_MARK = svg('<circle cx="12" cy="12" r="8" fill="#3b1a6b"/>');

/** RGBA of the pixel at (x, y) in a 24-unit viewBox rendered at 240px. */
async function pixelAt(png: Buffer, x: number, y: number): Promise<number[]> {
	const { data, info } = await sharp(png)
		.resize(240, 240)
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	const i = (Math.round(y * 10) * info.width + Math.round(x * 10)) * 4;
	return [data[i]!, data[i + 1]!, data[i + 2]!, data[i + 3]!];
}

// Intercom-style: a near-black tile whose details are transparent cutouts.
const CUTOUT_TILE = svg(
	'<path fill-rule="evenodd" fill="#0b1d2e" d="M0 0h24v24H0zM6 5h2v10H6zM11 5h2v10h-2zM16 5h2v10h-2z"/>',
);

test('black marks get a dark variant; dark brand colours and tiles do not', async () => {
	for (const mark of [
		BLACK_CIRCLE,
		IMPLICIT_BLACK,
		OUTLINED,
		BLACK_WITH_ACCENT,
		CUTOUT_TILE,
	]) {
		assert.equal(
			needsDarkVariant(await analyzeInk(await renderSvgToPng(mark))),
			true,
		);
	}
	for (const mark of [COLOURFUL, BLACK_TILE, PURPLE_MARK]) {
		assert.equal(
			needsDarkVariant(await analyzeInk(await renderSvgToPng(mark))),
			false,
		);
	}
});

test('the dark variant inverts black and white and keeps colour and alpha', async () => {
	const outlined = await darkVariantPng(await renderSvgToPng(OUTLINED));
	assert.deepEqual(await pixelAt(outlined, 12, 18.5), [255, 255, 255, 255]);
	assert.deepEqual(await pixelAt(outlined, 12, 14), [0, 0, 0, 255]);
	assert.equal((await pixelAt(outlined, 2, 2))[3], 0);

	const accent = await darkVariantPng(await renderSvgToPng(BLACK_WITH_ACCENT));
	assert.deepEqual(await pixelAt(accent, 6.5, 10), [238, 238, 238, 255]);
	assert.deepEqual(await pixelAt(accent, 17, 17), [29, 78, 216, 255]);

	// Near-black navy keeps its hue: light blue-grey, not the cream a plain
	// RGB inversion gives.
	const navy = await darkVariantPng(
		await renderSvgToPng(svg('<circle cx="12" cy="12" r="8" fill="#1b2a3a"/>')),
	);
	const [r, g, b] = await pixelAt(navy, 12, 12);
	assert.ok(b > g && g > r && r > 180, `${r},${g},${b}`);
});

test('renderDifference is zero for the same render and large for different ones', async () => {
	const a = await renderSvgToPng(BLACK_CIRCLE);
	assert.equal(await renderDifference(a, a), 0);
	assert.ok((await renderDifference(a, await renderSvgToPng(COLOURFUL))) > 10);
});

const TRACED = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0.00 0.00 256.00 256.00" width="128" height="128">
<path fill="#ff1906" d="M 137.40 41.35 A 1.74 1.73 5.6 0 1 139.28 39.81 L 145.09 40.30 A 1.84 1.80 -26.2 0 1 145.85 40.55 L 154.76 45.93 A 4.33 4.03 82.5 0 1 155.68 46.69 Z"/></svg>`;

test('detectTrace flags tracer output and wrapped rasters', () => {
	const traced = detectTrace(TRACED);
	assert.equal(traced.traced, true);
	assert.ok(traced.reasons.some((r) => r.includes('tracer viewBox')));
	assert.ok(traced.reasons.some((r) => r.includes('rotated arcs')));
	assert.equal(
		detectTrace(svg('<path vector-effect="non-scaling-stroke" d="M0 0L4 4"/>'))
			.traced,
		true,
	);
	assert.equal(
		detectTrace(svg('<image href="data:image/png;base64,iVBORw0KGgo="/>'))
			.traced,
		true,
	);
});

test('detectTrace flags AI redraws', () => {
	assert.equal(
		detectTrace(
			svg(
				'<!-- SVG created with Arrow, by QuiverAI (https://quiver.ai) --><circle r="4"/>',
			),
		).traced,
		true,
	);
});

test('detectTrace passes drawn marks', () => {
	for (const drawn of [BLACK_CIRCLE, IMPLICIT_BLACK, COLOURFUL, BLACK_TILE]) {
		assert.equal(detectTrace(drawn).traced, false);
	}
	// A drawn arc (no rotation) and a two-decimal viewBox without .00 are fine.
	assert.equal(
		detectTrace(
			'<svg viewBox="1.25 3.75 20.5 20.5"><path d="M2 12A10 10 0 0 1 22 12z"/></svg>',
		).traced,
		false,
	);
});

test('normalizeSvg fits a square viewBox tight around the mark', async () => {
	const out = await normalizeSvg(
		'<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50" viewBox="0 0 100 50"><!-- editor --><rect x="10" y="10" width="40" height="20" fill="#e01e5a"/></svg>',
	);
	const box = out
		.match(/viewBox="([^"]+)"/)![1]!
		.split(' ')
		.map(Number);
	assert.equal(/<svg[^>]*\swidth=/.test(out), false);
	assert.equal(out.includes('<!--'), false);
	assert.ok(Math.abs(box[2]! - 40) < 0.2, `width ${box[2]}`);
	assert.equal(box[2], box[3]);
	assert.ok(Math.abs(box[0]! - 10) < 0.2, `x ${box[0]}`);
	assert.ok(Math.abs(box[1]! - 0) < 0.2, `y ${box[1]}`);
	assert.equal(detectTrace(out).traced, false);
});

test('normalizeSvg is not fooled by a root size with another aspect ratio', async () => {
	// Rendered at 128x128, the 100x50 viewBox is letterboxed; the crop must
	// still land on the rect in viewBox units.
	const out = await normalizeSvg(
		'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 100 50"><rect x="10" y="10" width="40" height="20" fill="#e01e5a"/></svg>',
	);
	const box = out
		.match(/viewBox="([^"]+)"/)![1]!
		.split(' ')
		.map(Number);
	assert.ok(Math.abs(box[0]! - 10) < 0.2, `x ${box[0]}`);
	assert.ok(Math.abs(box[1]! - 0) < 0.2, `y ${box[1]}`);
	assert.ok(Math.abs(box[2]! - 40) < 0.2, `side ${box[2]}`);
});

test('inlineClassStyles turns simple class rules into attributes', () => {
	const out = inlineClassStyles(
		'<svg viewBox="0 0 4 4"><defs><style>.st0 { fill: #911180; }\n .st1, .st2 { fill: #3c247f; opacity: .5 }</style></defs>' +
			'<path class="st0" d="M0 0h1v1z"/><path class="st1" fill="#000" d="M1 1h1v1z"/></svg>',
	);
	assert.ok(out);
	assert.equal(out!.includes('<style'), false);
	assert.equal(out!.includes('class='), false);
	assert.ok(out!.includes('fill="#911180"'));
	// The rule replaces the element's own fill.
	assert.ok(
		out!.includes('opacity=".5" fill="#3c247f"') ||
			out!.includes('fill="#3c247f" opacity=".5"'),
	);
	assert.equal(out!.includes('fill="#000"'), false);
	assert.equal(sanitizeSvg(out!).ok, true);
});

test('inlineClassStyles leaves files without a stylesheet alone and refuses complex ones', () => {
	const plain = svg('<path d="M0 0h1v1z"/>');
	assert.equal(inlineClassStyles(plain), plain);
	for (const css of [
		'@media (prefers-color-scheme: dark) { .a { fill: #fff } }',
		'.a { fill: url(https://example.com/p.svg#g) }',
		'path { fill: red }',
		'.a { display: none }',
	]) {
		assert.equal(
			inlineClassStyles(
				svg(`<style>${css}</style><path class="a" d="M0 0h1v1z"/>`),
			),
			null,
			css,
		);
	}
});

test('inlineClassStyles follows stylesheet order and refuses single quotes', () => {
	const out = inlineClassStyles(
		'<svg viewBox="0 0 4 4"><style>.b { fill: blue } .a { fill: red }</style><path class="a b" d="M0 0h1v1z"/></svg>',
	);
	assert.ok(out?.includes('fill="red"'), out ?? 'null');
	assert.equal(out?.includes('fill="blue"'), false);
	assert.equal(
		inlineClassStyles(
			'<svg viewBox="0 0 4 4"><style>.a { fill: red }</style><path class=\'a\' d="M0 0h1v1z"/></svg>',
		),
		null,
	);
	assert.equal(
		inlineClassStyles(
			'<svg viewBox="0 0 4 4"><style>.a { fill: red }</style><path class="a" fill=\'blue\' d="M0 0h1v1z"/></svg>',
		),
		null,
	);
});

const CURATED_DIR = join(
	dirname(fileURLToPath(import.meta.url)),
	'plugin-icon-sources',
);

test('every curated icon is a clean, square, drawn SVG with a recorded source', () => {
	const sources = JSON.parse(
		readFileSync(join(CURATED_DIR, 'SOURCES.json'), 'utf8'),
	) as Record<string, { from: string }>;
	const files = readdirSync(CURATED_DIR).filter((f) => f.endsWith('.svg'));
	assert.ok(files.length > 0);
	for (const file of files) {
		const id = file.slice(0, -4);
		const raw = readFileSync(join(CURATED_DIR, file), 'utf8');
		const trace = detectTrace(raw);
		assert.equal(trace.traced, false, `${file}: ${trace.reasons.join('; ')}`);
		assert.equal(sanitizeSvg(raw).ok, true, file);
		const box = raw
			.match(/viewBox="([^"]+)"/)?.[1]
			?.split(/\s+/)
			.map(Number);
		assert.ok(box && box[2] === box[3], `${file}: viewBox is not square`);
		assert.ok(sources[id]?.from, `${file}: no entry in SOURCES.json`);
	}
	for (const id of Object.keys(sources)) {
		assert.ok(files.includes(`${id}.svg`), `SOURCES.json lists missing ${id}`);
	}
});
