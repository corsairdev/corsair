/**
 * Turns a third-party SVG (a brand press kit, svgl, Composio's logo-cdn, Simple
 * Icons, Wikimedia) into our own copy in `scripts/plugin-icon-sources/`, which
 * `pnpm fetch:plugin-icons` then serves. Sourced files are inputs, never the
 * output: each is sanitized, refused if it is a trace, cleaned up (square
 * viewBox tight around the mark, no fixed size, no comments) and recorded in
 * SOURCES.json with where it came from.
 *
 *   pnpm import:plugin-icon -- <id> <url-or-file> [--note="why this file"]
 *   pnpm import:plugin-icon -- <id> contextdev:<domain>
 *   pnpm import:plugin-icon -- --batch=<file.json>   # { "<id>": "<source>" }
 *
 * `contextdev:<domain>` asks the context.dev Brand API (CONTEXT_DEV_API_KEY)
 * for the brand's logos and takes its best square SVG icon; it lists the
 * raster ones it skipped, so a better PNG can still go in as a URL override.
 *
 * Review every result at full size and at 26px before committing it.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
	detectTrace,
	inlineClassStyles,
	normalizeSvg,
	sanitizeSvg,
} from './plugin-icon-svg.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCES_DIR = join(__dirname, 'plugin-icon-sources');
const SOURCES_JSON = join(SOURCES_DIR, 'SOURCES.json');

type SourceRecord = { from: string; note?: string };

async function load(from: string): Promise<string> {
	if (!/^https?:\/\//.test(from)) return readFileSync(from, 'utf8');
	const response = await fetch(from, {
		headers: { 'User-Agent': 'corsair-plugin-icon-import/1.0' },
	});
	if (!response.ok) throw new Error(`HTTP ${response.status}`);
	return response.text();
}

type BrandLogo = {
	url: string;
	type: 'icon' | 'logo';
	mode?: 'light' | 'dark' | 'has_opaque_background';
	resolution?: { width: number; height: number; aspect_ratio: number };
};

const CONTEXT_DEV_BRAND = 'https://api.context.dev/v1/brand/retrieve';

/**
 * The brand's square icon as an SVG URL, from the context.dev Brand API.
 * Light-mode icons come first: our icons are drawn for light surfaces and the
 * fetch script derives the dark variant.
 */
async function contextDevIcon(domain: string): Promise<string> {
	const key = process.env.CONTEXT_DEV_API_KEY;
	if (!key) throw new Error('CONTEXT_DEV_API_KEY is not set');
	const response = await fetch(CONTEXT_DEV_BRAND, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${key}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ type: 'by_domain', domain }),
	});
	if (!response.ok) throw new Error(`context.dev HTTP ${response.status}`);
	const { brand } = (await response.json()) as {
		brand?: { logos?: BrandLogo[] };
	};
	const icons = (brand?.logos ?? []).filter(
		(logo) =>
			logo.type === 'icon' &&
			Math.abs((logo.resolution?.aspect_ratio ?? 1) - 1) < 0.05,
	);
	const isSvg = (logo: BrandLogo) => /\.svg(\?|$)/i.test(logo.url);
	const svg = icons
		.filter(isSvg)
		.sort((a, b) => Number(b.mode === 'light') - Number(a.mode === 'light'))[0];
	const skipped = icons
		.filter((logo) => !isSvg(logo))
		.map((l) => `${l.resolution?.width ?? '?'}px ${l.mode ?? ''} ${l.url}`);
	if (skipped.length > 0) {
		console.log(
			`[import-plugin-icon] ${domain} rasters: ${skipped.join(' | ')}`,
		);
	}
	if (!svg) throw new Error(`context.dev has no square SVG icon for ${domain}`);
	return svg.url;
}

async function importIcon(id: string, source: string): Promise<string> {
	if (!/^[a-z0-9][a-z0-9_-]*$/.test(id))
		throw new Error(`bad plugin id "${id}"`);
	const from = source.startsWith('contextdev:')
		? await contextDevIcon(source.slice('contextdev:'.length))
		: source;
	const loaded = await load(from);
	const raw = inlineClassStyles(loaded);
	if (raw === null) {
		throw new Error(
			'its stylesheet is more than simple class rules; inline it by hand',
		);
	}
	const trace = detectTrace(raw);
	if (trace.traced) {
		throw new Error(`looks traced (${trace.reasons.join('; ')})`);
	}
	const first = sanitizeSvg(raw);
	if (!first.ok) throw new Error(first.error);
	const clean = sanitizeSvg(await normalizeSvg(first.svg));
	if (!clean.ok) throw new Error(clean.error);
	writeFileSync(join(SOURCES_DIR, `${id}.svg`), clean.svg);
	return from;
}

async function main(): Promise<void> {
	const args = process.argv.slice(2).filter((a) => a !== '--');
	const flag = (name: string) =>
		args.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
	const positional = args.filter((a) => !a.startsWith('--'));
	const note = flag('note');
	const batch = flag('batch');

	const jobs: Array<[string, string]> = batch
		? Object.entries(JSON.parse(readFileSync(batch, 'utf8')))
		: positional.length === 2
			? [[positional[0]!, positional[1]!]]
			: [];
	if (jobs.length === 0) {
		console.error(
			'usage: import-plugin-icon <id> <url-or-file> [--note=…] | --batch=<file.json>',
		);
		process.exit(2);
	}

	const records: Record<string, SourceRecord> = existsSync(SOURCES_JSON)
		? JSON.parse(readFileSync(SOURCES_JSON, 'utf8'))
		: {};
	let failed = 0;
	for (const [id, from] of jobs) {
		try {
			const url = await importIcon(id, from);
			const found = from.startsWith('contextdev:')
				? `found with the context.dev Brand API for ${from.slice('contextdev:'.length)}`
				: undefined;
			const text = [found, note].filter(Boolean).join('; ');
			records[id] = text ? { from: url, note: text } : { from: url };
			console.log(`[import-plugin-icon] ${id} <- ${url}`);
		} catch (error) {
			failed++;
			const message = error instanceof Error ? error.message : String(error);
			console.warn(`[import-plugin-icon] ${id}: ${message}`);
		}
	}
	const sorted = Object.fromEntries(
		Object.entries(records).sort(([a], [b]) => a.localeCompare(b)),
	);
	writeFileSync(SOURCES_JSON, `${JSON.stringify(sorted, null, '\t')}\n`);
	if (failed > 0) process.exitCode = 1;
}

// A rejection can carry any value, not only an Error, so it is typed unknown
// and printed as is.
main().catch((error: unknown) => {
	console.error(error);
	process.exit(1);
});
