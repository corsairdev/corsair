/**
 * Downloads plugin brand icons into `explorer/icons/` and writes
 * `explorer/data/icon-manifest.json`.
 *
 * Run after adding plugins or when icons look stale:
 *   pnpm fetch:plugin-icons
 *   pnpm fetch:plugin-icons -- --force
 *   pnpm fetch:plugin-icons -- --only slack,github
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { PluginCatalogIndex } from '../explorer/src/types.ts';
import {
	buildPluginDomainMap,
	resolvePluginDomain,
} from './plugin-icon-domains.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PRIMARY_SOURCE = 'https://twenty-icons.com';
const FALLBACK_SOURCE = 'https://www.google.com/s2/favicons';
const ICON_SIZE = 128;
const ICON_FORMAT = 'png';
const CONCURRENCY = 12;

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

type IconSource = 'twenty-icons' | 'google-favicon';

type FetchResult =
	| { ok: true; bytes: Buffer; source: IconSource }
	| { ok: false; error: string };

type Manifest = {
	generatedAt: string;
	primarySource: string;
	fallbackSource: string;
	size: number;
	format: string;
	total: number;
	succeeded: number;
	failed: number;
	domains: Record<string, string>;
	sources: Record<string, IconSource>;
	failures: Array<{ id: string; domain: string; error: string }>;
};

function repoRoot(): string {
	return resolve(join(__dirname, '..'));
}

function parseArgs(argv: string[]) {
	const force = argv.includes('--force');
	const onlyArg = argv.find((arg) => arg.startsWith('--only='));
	const only = onlyArg
		? onlyArg
				.slice('--only='.length)
				.split(',')
				.map((value) => value.trim())
				.filter(Boolean)
		: [];

	return { force, only };
}

function isPng(bytes: Buffer): boolean {
	return (
		bytes.length >= PNG_MAGIC.length && bytes.subarray(0, 8).equals(PNG_MAGIC)
	);
}

async function fetchIcon(domain: string): Promise<FetchResult> {
	const primaryUrl = `${PRIMARY_SOURCE}/${domain}`;

	try {
		const response = await fetch(primaryUrl, {
			headers: { 'User-Agent': 'corsair-plugin-icon-fetch/1.0' },
		});
		if (response.ok) {
			const bytes = Buffer.from(await response.arrayBuffer());
			if (bytes.length > 0 && isPng(bytes)) {
				return { ok: true, bytes, source: 'twenty-icons' };
			}
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return fetchGoogleFavicon(domain, `twenty-icons failed: ${message}`);
	}

	return fetchGoogleFavicon(domain, 'twenty-icons returned no PNG');
}

async function fetchGoogleFavicon(
	domain: string,
	reason: string,
): Promise<FetchResult> {
	const fallbackUrl = `${FALLBACK_SOURCE}?domain=${encodeURIComponent(domain)}&sz=${ICON_SIZE}`;

	try {
		const response = await fetch(fallbackUrl, {
			headers: { 'User-Agent': 'corsair-plugin-icon-fetch/1.0' },
		});
		if (!response.ok) {
			return {
				ok: false,
				error: `${reason}; google-favicon HTTP ${response.status}`,
			};
		}

		const bytes = Buffer.from(await response.arrayBuffer());
		if (bytes.length === 0 || !isPng(bytes)) {
			return {
				ok: false,
				error: `${reason}; google-favicon returned no PNG`,
			};
		}

		return { ok: true, bytes, source: 'google-favicon' };
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return {
			ok: false,
			error: `${reason}; google-favicon failed: ${message}`,
		};
	}
}

async function mapWithConcurrency<T, R>(
	items: T[],
	concurrency: number,
	fn: (item: T) => Promise<R>,
): Promise<R[]> {
	const results: R[] = new Array(items.length);
	let index = 0;

	async function worker(): Promise<void> {
		while (index < items.length) {
			const current = index++;
			results[current] = await fn(items[current]!);
		}
	}

	await Promise.all(
		Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
	);

	return results;
}

async function main(): Promise<void> {
	const { force, only } = parseArgs(process.argv.slice(2));
	const root = repoRoot();
	const catalogPath = join(root, 'explorer/data/catalog.json');
	const iconsDir = join(root, 'explorer/icons');
	const manifestPath = join(root, 'explorer/data/icon-manifest.json');

	if (!existsSync(catalogPath)) {
		console.error(`[plugin-icons] Missing catalog: ${catalogPath}`);
		process.exit(1);
	}

	const catalog = JSON.parse(
		readFileSync(catalogPath, 'utf8'),
	) as PluginCatalogIndex;
	let pluginIds = catalog.plugins.map((plugin) => plugin.id).sort();

	if (only.length > 0) {
		const allowed = new Set(only);
		pluginIds = pluginIds.filter((id) => allowed.has(id));
	}

	mkdirSync(iconsDir, { recursive: true });

	const domains = buildPluginDomainMap(pluginIds);
	const sources: Record<string, IconSource> = {};
	const failures: Manifest['failures'] = [];

	const targets = pluginIds.filter((id) => {
		if (force) return true;
		return !existsSync(join(iconsDir, `${id}.png`));
	});

	if (targets.length === 0) {
		console.log(
			'[plugin-icons] All icons already present. Use --force to re-fetch.',
		);
	} else {
		console.log(`[plugin-icons] Fetching ${targets.length} icon(s)...`);

		await mapWithConcurrency(targets, CONCURRENCY, async (pluginId) => {
			const domain = domains[pluginId] ?? resolvePluginDomain(pluginId);
			const result = await fetchIcon(domain);

			if (!result.ok) {
				failures.push({ id: pluginId, domain, error: result.error });
				console.warn(`[plugin-icons] ${pluginId}: ${result.error}`);
				return;
			}

			writeFileSync(join(iconsDir, `${pluginId}.png`), result.bytes);
			sources[pluginId] = result.source;
			console.log(`[plugin-icons] ${pluginId} (${result.source})`);
		});
	}

	let existingSources: Record<string, IconSource> = {};
	if (existsSync(manifestPath)) {
		const existing = JSON.parse(readFileSync(manifestPath, 'utf8')) as Manifest;
		existingSources = existing.sources ?? {};
	}

	for (const pluginId of pluginIds) {
		if (sources[pluginId]) continue;
		if (existsSync(join(iconsDir, `${pluginId}.png`))) {
			sources[pluginId] = existingSources[pluginId] ?? 'twenty-icons';
		}
	}

	const manifest: Manifest = {
		generatedAt: new Date().toISOString(),
		primarySource: PRIMARY_SOURCE,
		fallbackSource: FALLBACK_SOURCE,
		size: ICON_SIZE,
		format: ICON_FORMAT,
		total: pluginIds.length,
		succeeded: pluginIds.filter((id) => existsSync(join(iconsDir, `${id}.png`)))
			.length,
		failed: failures.length,
		domains,
		sources,
		failures,
	};

	writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

	console.log(
		[
			'[plugin-icons] Done.',
			`${manifest.succeeded}/${manifest.total} icons on disk`,
			failures.length > 0 ? `${failures.length} failed` : '0 failed',
		].join(' '),
	);

	if (failures.length > 0) {
		process.exitCode = 1;
	}
}

main().catch((error: unknown) => {
	console.error(error);
	process.exit(1);
});
