/**
 * Turns a third-party SVG (a brand press kit, svgl, Composio's logo-cdn, Simple
 * Icons, Wikimedia) into our own copy in `scripts/plugin-icon-sources/`, which
 * `pnpm fetch:plugin-icons` then serves. Sourced files are inputs, never the
 * output: each is sanitized, refused if it is a trace, cleaned up (square
 * viewBox tight around the mark, no fixed size, no comments) and recorded in
 * SOURCES.json with where it came from.
 *
 *   pnpm import:plugin-icon -- <id> <url-or-file> [--note="why this file"]
 *   pnpm import:plugin-icon -- --batch=<file.json>   # { "<id>": "<url-or-file>" }
 *
 * Review every result at full size and at 26px before committing it.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { detectTrace, normalizeSvg, sanitizeSvg } from './plugin-icon-svg.ts';

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

async function importIcon(id: string, from: string): Promise<void> {
	if (!/^[a-z0-9]+$/.test(id)) throw new Error(`bad plugin id "${id}"`);
	const raw = await load(from);
	const trace = detectTrace(raw);
	if (trace.traced) {
		throw new Error(`looks traced (${trace.reasons.join('; ')})`);
	}
	const first = sanitizeSvg(raw);
	if (!first.ok) throw new Error(first.error);
	const clean = sanitizeSvg(await normalizeSvg(first.svg));
	if (!clean.ok) throw new Error(clean.error);
	writeFileSync(join(SOURCES_DIR, `${id}.svg`), clean.svg);
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
			await importIcon(id, from);
			records[id] = note ? { from, note } : { from };
			console.log(`[import-plugin-icon] ${id} <- ${from}`);
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
