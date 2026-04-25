import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
	DocsApiEndpoint,
	DocsDbEntity,
	DocsWebhook,
	PluginCatalog,
	PluginEntry,
	PluginSummary,
} from './types';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Default catalog location, relative to the compiled `dist/` directory (and
 * `src/` during `tsx` development — both sit one level under the package root).
 */
const DEFAULT_CATALOG_PATH = resolve(__dirname, '..', 'data', 'plugins.json');

export type LoadCatalogOptions = {
	/** Override path to `plugins.json`. Defaults to the bundled data file. */
	path?: string;
};

/**
 * Reads `plugins.json` from disk, builds two lookup maps keyed by plugin id,
 * and caches summaries (one small array, reused per request).
 */
export class Catalog {
	readonly path: string;
	readonly catalog: PluginCatalog;

	private readonly pluginsById: Map<string, PluginEntry>;
	private readonly summaries: PluginSummary[];

	constructor(data: PluginCatalog, path: string) {
		this.path = path;
		this.catalog = data;
		this.pluginsById = new Map(data.plugins.map((p) => [p.id, p]));
		this.summaries = data.plugins.map(toSummary);
	}

	get generatedAt(): string {
		return this.catalog.generatedAt;
	}

	get corsairVersion(): string {
		return this.catalog.corsairVersion;
	}

	get catalogVersion(): 1 {
		return this.catalog.catalogVersion;
	}

	listSummaries(): PluginSummary[] {
		return this.summaries;
	}

	getPlugin(id: string): PluginEntry | undefined {
		return this.pluginsById.get(id);
	}

	findApiEndpoint(
		pluginId: string,
		shortPath: string,
	): DocsApiEndpoint | undefined {
		return this.getPlugin(pluginId)?.api.find((e) => e.shortPath === shortPath);
	}

	findWebhook(pluginId: string, shortPath: string): DocsWebhook | undefined {
		return this.getPlugin(pluginId)?.webhooks.find(
			(w) => w.shortPath === shortPath,
		);
	}

	findDbEntity(pluginId: string, entityName: string): DocsDbEntity | undefined {
		return this.getPlugin(pluginId)?.db.find(
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
		for (const plugin of this.catalog.plugins) {
			for (const ep of plugin.api) {
				if (
					matchesQuery(q, [ep.shortPath, ep.path, ep.description, ep.riskLevel])
				) {
					endpoints.push({ pluginId: plugin.id, endpoint: ep });
				}
			}
			for (const wh of plugin.webhooks) {
				if (matchesQuery(q, [wh.shortPath, wh.path, wh.description])) {
					webhooks.push({ pluginId: plugin.id, webhook: wh });
				}
			}
		}

		return { plugins, endpoints, webhooks };
	}
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

export function loadCatalog(options: LoadCatalogOptions = {}): Catalog {
	const path = options.path ?? DEFAULT_CATALOG_PATH;
	let raw: string;
	try {
		raw = readFileSync(path, 'utf8');
	} catch (err) {
		throw new Error(
			`[corsair:explorer] Could not read catalog at ${path}: ${(err as Error).message}. ` +
				`Did you run \`pnpm build:explorer-catalog\`?`,
		);
	}
	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch (err) {
		throw new Error(
			`[corsair:explorer] Catalog at ${path} is not valid JSON: ${(err as Error).message}`,
		);
	}
	if (!isPluginCatalog(parsed)) {
		throw new Error(
			`[corsair:explorer] Catalog at ${path} does not match the expected shape.`,
		);
	}
	return new Catalog(parsed, path);
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
