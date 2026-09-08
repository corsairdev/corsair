/**
 * Builds `explorer/data/catalog.json` plus one JSON file per plugin under
 * `explorer/data/plugins/` by scanning every `@corsair-dev/*` plugin package
 * under `packages/*`, importing its factory, running `introspectPluginForDocs`,
 * and serialising the result.
 *
 * The `explorer/` app itself lives outside the monorepo's workspace (it has
 * its own `pnpm-workspace.yaml` and lockfile) — this script is the only link
 * between the two: it reads plugin source from the monorepo and writes static
 * JSON artifacts into `explorer/data/`.
 *
 * Run manually whenever plugins change:
 *   pnpm build:explorer-catalog
 *   pnpm build:integration-pages
 *
 * Discovery logic mirrors `scripts/generate-plugin-docs.ts` but we intentionally
 * keep a small, self-contained copy here so the two scripts can evolve
 * independently. Display copy (`displayName`, `description`) is read from
 * `packages/<plugin>/plugin-docs.yaml` when present, with package.json fallbacks.
 */
import {
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	rmSync,
	unlinkSync,
	writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { buildSearchIndex } from '../explorer/src/catalog.ts';
import type {
	DocsApiEndpoint,
	DocsWebhook,
	PluginAuthFields,
	PluginAuthType,
	PluginCatalogIndex,
	PluginEntry,
} from '../explorer/src/types.ts';
import { BASE_AUTH_FIELDS } from '../packages/corsair/core/auth/types.ts';
import type {
	DocsApiEndpoint as CoreApiEndpoint,
	DocsWebhook as CoreWebhook,
} from '../packages/corsair/core/inspect/index.ts';
import { introspectPluginForDocs } from '../packages/corsair/core/inspect/index.ts';
import type { CorsairPlugin } from '../packages/corsair/core/plugins/index.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Workspace folders under `packages/` that are not Corsair integration plugins. */
const PLUGIN_DISCOVERY_SKIP_DIRS = new Set([
	'corsair',
	'cli',
	'mcp',
	'ui',
	'studio',
]);

const KNOWN_AUTH_TYPES: readonly PluginAuthType[] = [
	'oauth_2',
	'api_key',
	'bot_token',
];

const PLUGIN_DOCS_FILE = 'plugin-docs.yaml';

type PluginDocsFile = {
	displayName?: string;
	description?: string;
};

type PackageJson = { name?: string; description?: string; version?: string };

function repoRoot(): string {
	return resolve(join(__dirname, '..'));
}

function readJson<T>(path: string): T | null {
	if (!existsSync(path)) return null;
	try {
		return JSON.parse(readFileSync(path, 'utf8')) as T;
	} catch {
		return null;
	}
}

function discoverPluginPackageDirs(root: string): string[] {
	const packagesDir = join(root, 'packages');
	if (!existsSync(packagesDir)) return [];

	const names = readdirSync(packagesDir, { withFileTypes: true })
		.filter((d) => d.isDirectory())
		.map((d) => d.name)
		.filter((name) => !PLUGIN_DISCOVERY_SKIP_DIRS.has(name));

	const out: string[] = [];
	for (const name of names) {
		const pkgPath = join(packagesDir, name, 'package.json');
		const idxPath = join(packagesDir, name, 'index.ts');
		if (!existsSync(pkgPath) || !existsSync(idxPath)) continue;
		const pkg = readJson<PackageJson>(pkgPath);
		if (!pkg?.name?.startsWith('@corsair-dev/')) continue;
		if (
			pkg.name === '@corsair-dev/cli' ||
			pkg.name === '@corsair-dev/mcp' ||
			pkg.name === '@corsair-dev/ui' ||
			pkg.name === '@corsair-dev/studio'
		) {
			continue;
		}
		out.push(name);
	}
	return out.sort((a, b) =>
		a.localeCompare(b, undefined, { sensitivity: 'base' }),
	);
}

function titleCaseSegment(s: string): string {
	if (s.length === 0) return s;
	return s.charAt(0).toUpperCase() + s.slice(1);
}

function humanizePluginId(pluginId: string): string {
	return pluginId
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/([0-9])([A-Za-z])/g, '$1 $2')
		.replace(/([A-Za-z])([0-9])/g, '$1 $2')
		.replace(/[_-]+/g, ' ')
		.split(/\s+/)
		.filter(Boolean)
		.map((w) => titleCaseSegment(w.toLowerCase()))
		.join(' ');
}

function titleFromPackageDescription(desc: string | undefined): string | null {
	if (!desc) return null;
	const trimmed = desc.trim();
	const lower = trimmed.toLowerCase();
	const idx = lower.indexOf(' plugin');
	let raw = idx !== -1 ? trimmed.slice(0, idx).trim() : trimmed;
	if (/^[a-z][a-z0-9]*$/.test(raw)) {
		raw = titleCaseSegment(raw);
	}
	return raw;
}

function readPluginDocsConfig(packageDir: string): PluginDocsFile {
	const p = join(packageDir, PLUGIN_DOCS_FILE);
	if (!existsSync(p)) return {};
	try {
		const doc = parseYaml(readFileSync(p, 'utf8')) as unknown;
		if (doc && typeof doc === 'object' && !Array.isArray(doc)) {
			return doc as PluginDocsFile;
		}
	} catch {
		// ignore invalid yaml
	}
	return {};
}

function inferAuthTypesFromSource(source: string): PluginAuthType[] {
	const re = /PickAuth<\s*([^>]+)\s*>/g;
	let best: PluginAuthType[] = [];
	let m: RegExpExecArray | null;
	while ((m = re.exec(source)) !== null) {
		const inner = m[1]!.replace(/\s+/g, ' ').trim();
		const types = inner
			.split('|')
			.map((s) => s.trim().replace(/['"]/g, ''))
			.filter((s): s is PluginAuthType =>
				(KNOWN_AUTH_TYPES as readonly string[]).includes(s),
			);
		if (types.length > best.length) {
			best = types;
		}
	}
	return best;
}

function inferDefaultAuthTypeFromSource(
	source: string,
): PluginAuthType | undefined {
	const match = source.match(
		/const\s+defaultAuthType\b\s*[^=]*=\s*['"](oauth_2|api_key|bot_token)['"]\s*(?:as\s+const)?/,
	);
	return match?.[1] as PluginAuthType | undefined;
}

function shortPathFromFullPath(fullPath: string, prefix: string): string {
	return fullPath.startsWith(prefix) ? fullPath.slice(prefix.length) : fullPath;
}

function toApiEndpoint(ep: CoreApiEndpoint, pluginId: string): DocsApiEndpoint {
	return {
		path: ep.path,
		shortPath: shortPathFromFullPath(ep.path, `${pluginId}.api.`),
		...(ep.description !== undefined ? { description: ep.description } : {}),
		...(ep.riskLevel !== undefined ? { riskLevel: ep.riskLevel } : {}),
		...(ep.irreversible !== undefined ? { irreversible: ep.irreversible } : {}),
		input: ep.input,
		output: ep.output,
	};
}

function toWebhook(wh: CoreWebhook, pluginId: string): DocsWebhook {
	return {
		path: wh.path,
		shortPath: shortPathFromFullPath(wh.path, `${pluginId}.webhooks.`),
		...(wh.description !== undefined ? { description: wh.description } : {}),
		payload: wh.payload,
		...(wh.responseType !== undefined ? { responseType: wh.responseType } : {}),
		usageExample: wh.usageExample,
	};
}

/**
 * Scaffold plugins ship a single nested `example` / `example.example` webhook
 * — the `generate-plugin-docs.ts` script hides it, and so do we.
 */
function hidesPlaceholderWebhooks(
	webhooks: readonly CoreWebhook[],
	pluginId: string,
): boolean {
	if (webhooks.length !== 1) return false;
	const needle = `${pluginId}.webhooks.`;
	const p = webhooks[0]!.path;
	if (!p.startsWith(needle)) return false;
	const short = p.slice(needle.length);
	return short === 'example' || short === 'example.example';
}

async function buildPluginEntry(
	packagesDir: string,
	dirName: string,
): Promise<PluginEntry | { error: string }> {
	const packageDir = join(packagesDir, dirName);
	const entryPath = join(packageDir, 'index.ts');
	const pkg = readJson<PackageJson>(join(packageDir, 'package.json')) ?? {};
	const npmPackageName = pkg.name ?? `@corsair-dev/${dirName}`;

	let mod: Record<string, unknown>;
	try {
		mod = (await import(pathToFileURL(entryPath).href)) as Record<
			string,
			unknown
		>;
	} catch (e) {
		return { error: `Failed to import ${entryPath}: ${(e as Error).message}` };
	}

	// Convention: factory export name matches the package dir name.
	const factory = mod[dirName];
	if (typeof factory !== 'function') {
		return { error: `No export "${dirName}" in ${entryPath}` };
	}

	let plugin: CorsairPlugin;
	try {
		plugin = (factory as () => CorsairPlugin)();
	} catch (e) {
		return {
			error: `Calling ${dirName}() threw: ${(e as Error).message}`,
		};
	}

	const pluginId = plugin.id;
	const introspection = introspectPluginForDocs([plugin], pluginId);
	if (!introspection.ok) {
		return { error: introspection.error };
	}

	const { data } = introspection;
	const entrySource = readFileSync(entryPath, 'utf8');
	const authTypes = inferAuthTypesFromSource(entrySource);
	const defaultAuthType = inferDefaultAuthTypeFromSource(entrySource);
	const docsConfig = readPluginDocsConfig(packageDir);

	const displayName =
		docsConfig.displayName?.trim() ??
		titleFromPackageDescription(pkg.description) ??
		humanizePluginId(pluginId);
	const description =
		docsConfig.description?.trim() ?? pkg.description?.trim() ?? undefined;

	const webhooks = hidesPlaceholderWebhooks(data.webhooks, pluginId)
		? []
		: data.webhooks.map((w) => toWebhook(w, pluginId));
	const api = data.api.map((e) => toApiEndpoint(e, pluginId));
	const db = data.db.map((d) => ({ ...d }));

	const pluginAuthConfig =
		(
			plugin as {
				authConfig?: Record<
					string,
					{ integration?: readonly string[]; account?: readonly string[] }
				>;
			}
		).authConfig ?? {};

	const auth: PluginAuthFields[] = authTypes.map((authType) => {
		const base = BASE_AUTH_FIELDS[authType];
		const extra = pluginAuthConfig[authType] ?? {};
		return {
			authType,
			integrationFields: [...base.integration, ...(extra.integration ?? [])],
			accountFields: [...base.account, ...(extra.account ?? [])],
		};
	});

	return {
		id: pluginId,
		displayName,
		...(description ? { description } : {}),
		npmPackageName,
		authTypes,
		...(defaultAuthType ? { defaultAuthType } : {}),
		counts: { api: api.length, webhooks: webhooks.length, db: db.length },
		auth,
		api,
		webhooks,
		db,
	};
}

function toSummary(entry: PluginEntry) {
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

async function main(): Promise<void> {
	const root = repoRoot();
	const packagesDir = join(root, 'packages');
	const dirs = discoverPluginPackageDirs(root);
	if (dirs.length === 0) {
		console.error('[explorer:catalog] No plugin packages found.');
		process.exit(1);
	}

	console.log(`[explorer:catalog] Found ${dirs.length} plugin packages.`);

	const plugins: PluginEntry[] = [];
	const failures: { dir: string; error: string }[] = [];

	for (const dirName of dirs) {
		process.stdout.write(`  - ${dirName} ... `);
		const result = await buildPluginEntry(packagesDir, dirName);
		if ('error' in result) {
			failures.push({ dir: dirName, error: result.error });
			console.log(`FAILED (${result.error})`);
			continue;
		}
		plugins.push(result);
		console.log(
			`ok (${result.counts.api} api, ${result.counts.webhooks} wh, ${result.counts.db} db)`,
		);
	}

	plugins.sort((a, b) => a.id.localeCompare(b.id));

	const corsairPkg =
		readJson<PackageJson>(join(packagesDir, 'corsair', 'package.json')) ?? {};

	const outDir = join(root, 'explorer', 'data');
	const pluginsDir = join(outDir, 'plugins');
	mkdirSync(pluginsDir, { recursive: true });

	const activePluginIds = new Set(plugins.map((p) => p.id));
	for (const fileName of readdirSync(pluginsDir)) {
		if (!fileName.endsWith('.json')) continue;
		const pluginId = fileName.slice(0, -'.json'.length);
		if (!activePluginIds.has(pluginId)) {
			unlinkSync(join(pluginsDir, fileName));
		}
	}

	for (const plugin of plugins) {
		const pluginPath = join(pluginsDir, `${plugin.id}.json`);
		writeFileSync(pluginPath, `${JSON.stringify(plugin, null, 2)}\n`, 'utf8');
	}

	const catalog: PluginCatalogIndex = {
		generatedAt: new Date().toISOString(),
		corsairVersion: corsairPkg.version ?? '0.0.0',
		catalogVersion: 2,
		plugins: plugins.map(toSummary),
		search: buildSearchIndex(plugins),
	};

	const catalogPath = join(outDir, 'catalog.json');
	writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');

	const legacyCatalogPath = join(outDir, 'plugins.json');
	if (existsSync(legacyCatalogPath)) {
		rmSync(legacyCatalogPath);
	}

	console.log(
		`\n[explorer:catalog] Wrote ${catalogPath} and ${plugins.length} files under ${pluginsDir}/`,
	);
	if (failures.length > 0) {
		console.error(`[explorer:catalog] ${failures.length} plugin(s) failed:`);
		for (const f of failures) {
			console.error(`  - ${f.dir}: ${f.error}`);
		}
		process.exit(1);
	}
}

main().catch((err) => {
	console.error('[explorer:catalog] fatal:', err);
	process.exit(1);
});
