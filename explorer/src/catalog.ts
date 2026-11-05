import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
	CatalogSearchEntry,
	DocsApiEndpoint,
	DocsDbEntity,
	DocsWebhook,
	PluginCatalog,
	PluginCatalogIndex,
	PluginEntry,
	PluginSummary,
} from './types';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Default catalog index location, relative to the compiled `dist/` directory (and
 * `src/` during `tsx` development — both sit one level under the package root).
 */
const DEFAULT_CATALOG_PATH = resolve(__dirname, '..', 'data', 'catalog.json');

export type LoadCatalogOptions = {
	/** Override path to `catalog.json`. Defaults to the bundled data file. */
	path?: string;
};

/**
 * Reads the catalog index from disk, lazy-loads per-plugin JSON files on
 * demand, and caches summaries for list/search.
 */
export class Catalog {
	readonly path: string;
	readonly index: PluginCatalogIndex;

	private readonly pluginsDir: string;
	private readonly pluginCache = new Map<string, PluginEntry>();
	private readonly preloadedPlugins: Map<string, PluginEntry> | null;
	private readonly summaries: PluginSummary[];

	constructor(
		index: PluginCatalogIndex,
		path: string,
		options: {
			pluginsDir: string;
			preloadedPlugins?: Map<string, PluginEntry>;
		},
	) {
		this.path = path;
		this.index = index;
		this.pluginsDir = options.pluginsDir;
		this.preloadedPlugins = options.preloadedPlugins ?? null;
		this.summaries = index.plugins;
	}

	get generatedAt(): string {
		return this.index.generatedAt;
	}

	get corsairVersion(): string {
		return this.index.corsairVersion;
	}

	get catalogVersion(): 1 | 2 {
		return this.index.catalogVersion;
	}

	listSummaries(): PluginSummary[] {
		return this.summaries;
	}

	getPlugin(id: string): PluginEntry | undefined {
		return this.loadPlugin(id);
	}

	findApiEndpoint(
		pluginId: string,
		shortPath: string,
	): DocsApiEndpoint | undefined {
		return this.loadPlugin(pluginId)?.api.find(
			(e) => e.shortPath === shortPath,
		);
	}

	findWebhook(pluginId: string, shortPath: string): DocsWebhook | undefined {
		return this.loadPlugin(pluginId)?.webhooks.find(
			(w) => w.shortPath === shortPath,
		);
	}

	findDbEntity(pluginId: string, entityName: string): DocsDbEntity | undefined {
		return this.loadPlugin(pluginId)?.db.find(
			(d) => d.entityName === entityName,
		);
	}

	search(query: string): {
		plugins: PluginSummary[];
		endpoints: { pluginId: string; endpoint: DocsApiEndpoint }[];
		webhooks: { pluginId: string; webhook: DocsWebhook }[];
	} {
		const q = query.trim().toLowerCase();
		if (q.length === 0) {
			return { plugins: [], endpoints: [], webhooks: [] };
		}

		const plugins = this.summaries.filter((p) =>
			matchesQuery(q, [p.id, p.displayName, p.description]),
		);

		const endpoints: { pluginId: string; endpoint: DocsApiEndpoint }[] = [];
		const webhooks: { pluginId: string; webhook: DocsWebhook }[] = [];

		for (const entry of this.index.search) {
			if (!entry.haystack.includes(q)) continue;

			const plugin = this.loadPlugin(entry.pluginId);
			if (!plugin) continue;

			if (entry.kind === 'api') {
				const endpoint = plugin.api.find(
					(e) => e.shortPath === entry.shortPath,
				);
				if (endpoint) {
					endpoints.push({ pluginId: entry.pluginId, endpoint });
				}
				continue;
			}

			const webhook = plugin.webhooks.find(
				(w) => w.shortPath === entry.shortPath,
			);
			if (webhook) {
				webhooks.push({ pluginId: entry.pluginId, webhook });
			}
		}

		return { plugins, endpoints, webhooks };
	}

	private loadPlugin(id: string): PluginEntry | undefined {
		const cached = this.pluginCache.get(id);
		if (cached) return cached;

		const preloaded = this.preloadedPlugins?.get(id);
		if (preloaded) {
			this.pluginCache.set(id, preloaded);
			return preloaded;
		}

		const filePath = join(this.pluginsDir, `${id}.json`);
		if (!existsSync(filePath)) return undefined;

		let parsed: unknown;
		try {
			parsed = JSON.parse(readFileSync(filePath, 'utf8'));
		} catch (err) {
			throw new Error(
				`[corsair:explorer] Could not parse plugin file at ${filePath}: ${(err as Error).message}`,
			);
		}

		if (!isPluginEntry(parsed)) {
			throw new Error(
				`[corsair:explorer] Plugin file at ${filePath} does not match the expected shape.`,
			);
		}

		this.pluginCache.set(id, parsed);
		return parsed;
	}
}

export function loadCatalog(options: LoadCatalogOptions = {}): Catalog {
	const requestedPath = options.path ?? DEFAULT_CATALOG_PATH;
	const catalogPath = resolveCatalogPath(requestedPath);
	const raw = readJsonFile(catalogPath);
	const parsed: unknown = JSON.parse(raw);

	if (isPluginCatalogIndex(parsed)) {
		return new Catalog(parsed, catalogPath, {
			pluginsDir: join(dirname(catalogPath), 'plugins'),
		});
	}

	if (isPluginCatalog(parsed)) {
		return catalogFromLegacyMonolith(parsed, catalogPath);
	}

	throw new Error(
		`[corsair:explorer] Catalog at ${catalogPath} does not match the expected shape.`,
	);
}

function resolveCatalogPath(requestedPath: string): string {
	const resolved = resolve(requestedPath);
	if (existsSync(resolved)) return resolved;

	const legacyPath = join(dirname(resolved), 'plugins.json');
	if (existsSync(legacyPath)) return legacyPath;

	return resolved;
}

function catalogFromLegacyMonolith(data: PluginCatalog, path: string): Catalog {
	const index: PluginCatalogIndex = {
		generatedAt: data.generatedAt,
		corsairVersion: data.corsairVersion,
		catalogVersion: 2,
		plugins: data.plugins.map(toSummary),
		search: buildSearchIndex(data.plugins),
	};

	return new Catalog(index, path, {
		pluginsDir: join(dirname(path), 'plugins'),
		preloadedPlugins: new Map(data.plugins.map((p) => [p.id, p])),
	});
}

function readJsonFile(path: string): string {
	try {
		return readFileSync(path, 'utf8');
	} catch (err) {
		throw new Error(
			`[corsair:explorer] Could not read catalog at ${path}: ${(err as Error).message}. ` +
				`Did you run \`pnpm build:explorer-catalog\`?`,
		);
	}
}

function toSummary(entry: PluginEntry): PluginSummary {
	const {
		id,
		displayName,
		description,
		npmPackageName,
		authTypes,
		defaultAuthType,
		counts,
	} = entry;
	return {
		id,
		displayName,
		description,
		npmPackageName,
		authTypes,
		defaultAuthType,
		counts,
	};
}

export function buildSearchIndex(
	plugins: readonly PluginEntry[],
): CatalogSearchEntry[] {
	const search: CatalogSearchEntry[] = [];
	for (const plugin of plugins) {
		for (const ep of plugin.api) {
			search.push({
				pluginId: plugin.id,
				kind: 'api',
				shortPath: ep.shortPath,
				haystack: buildHaystack([
					ep.shortPath,
					ep.path,
					ep.description,
					ep.riskLevel,
				]),
			});
		}
		for (const wh of plugin.webhooks) {
			search.push({
				pluginId: plugin.id,
				kind: 'webhook',
				shortPath: wh.shortPath,
				haystack: buildHaystack([wh.shortPath, wh.path, wh.description]),
			});
		}
	}
	return search;
}

function buildHaystack(fields: readonly (string | undefined)[]): string {
	return fields
		.filter((f): f is string => Boolean(f))
		.join(' ')
		.toLowerCase();
}

function matchesQuery(
	q: string,
	fields: readonly (string | undefined)[],
): boolean {
	for (const f of fields) {
		if (f && f.toLowerCase().includes(q)) return true;
	}
	return false;
}

function isPluginCatalogIndex(value: unknown): value is PluginCatalogIndex {
	if (!value || typeof value !== 'object') return false;
	const v = value as Record<string, unknown>;
	return (
		typeof v.generatedAt === 'string' &&
		typeof v.corsairVersion === 'string' &&
		v.catalogVersion === 2 &&
		Array.isArray(v.plugins) &&
		Array.isArray(v.search)
	);
}

function isPluginCatalog(value: unknown): value is PluginCatalog {
	if (!value || typeof value !== 'object') return false;
	const v = value as Record<string, unknown>;
	return (
		typeof v.generatedAt === 'string' &&
		typeof v.corsairVersion === 'string' &&
		v.catalogVersion === 1 &&
		Array.isArray(v.plugins)
	);
}

function isPluginEntry(value: unknown): value is PluginEntry {
	if (!value || typeof value !== 'object') return false;
	const v = value as Record<string, unknown>;
	return (
		typeof v.id === 'string' &&
		typeof v.displayName === 'string' &&
		typeof v.npmPackageName === 'string' &&
		Array.isArray(v.authTypes) &&
		Array.isArray(v.auth) &&
		Array.isArray(v.api) &&
		Array.isArray(v.webhooks) &&
		Array.isArray(v.db) &&
		v.counts !== null &&
		typeof v.counts === 'object'
	);
}
