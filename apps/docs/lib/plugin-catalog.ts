import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface SchemaField {
	key: string;
	optional: boolean;
	type: string;
	description?: string;
}

export type SchemaShape =
	| { kind: 'object'; fields: SchemaField[] }
	| { kind: 'inline'; type: string };

export interface ApiOperation {
	path: string;
	shortPath: string;
	description?: string;
	riskLevel?: string;
	irreversible?: boolean;
	input: SchemaShape;
	output: SchemaShape;
}

export interface DbFilter {
	field: string;
	type: string;
	operators: string[];
}

export interface DbEntity {
	path: string;
	entityName: string;
	filters?: DbFilter[];
}

export interface WebhookEvent {
	path: string;
	shortPath: string;
	description?: string;
}

export interface PluginCatalogEntry {
	id: string;
	displayName: string;
	description?: string;
	npmPackageName?: string;
	authTypes: string[];
	defaultAuthType?: string;
	counts: { api: number; webhooks: number; db: number };
	api: ApiOperation[];
	db?: DbEntity[];
	webhooks?: WebhookEvent[];
}

const PLUGIN_ID_PATTERN = /^[a-z0-9]+$/;
const cache = new Map<string, PluginCatalogEntry>();

function catalogDir(): string {
	return join(process.cwd(), '..', '..', 'explorer', 'data', 'plugins');
}

export function pluginIds(): string[] {
	return readdirSync(catalogDir())
		.filter((f) => f.endsWith('.json'))
		.map((f) => f.slice(0, -'.json'.length))
		.sort();
}

export interface PluginSummary {
	id: string;
	displayName: string;
	description?: string;
	counts: PluginCatalogEntry['counts'];
}

/** Recognizable plugins the index page leads with. */
export const POPULAR_PLUGIN_IDS = [
	'slack',
	'github',
	'gmail',
	'notion',
	'stripe',
	'linear',
	'jira',
	'hubspot',
	'salesforce',
	'googlecalendar',
	'googlesheets',
	'airtable',
];

/**
 * Reads every entry but keeps none: caching all 345 would hold ~20MB of
 * operation schemas resident to show four summary fields.
 */
export function listPlugins(): PluginSummary[] {
	const out: PluginSummary[] = [];
	for (const id of pluginIds()) {
		const file = join(catalogDir(), `${id}.json`);
		if (!existsSync(file)) continue;
		const { displayName, description, counts } = JSON.parse(
			readFileSync(file, 'utf8'),
		) as PluginCatalogEntry;
		out.push({ id, displayName, description, counts });
	}
	return out;
}

export function getPlugin(id: string): PluginCatalogEntry | null {
	if (!PLUGIN_ID_PATTERN.test(id)) return null;
	const cached = cache.get(id);
	if (cached) return cached;

	const file = join(catalogDir(), `${id}.json`);
	if (!existsSync(file)) return null;

	const entry = JSON.parse(readFileSync(file, 'utf8')) as PluginCatalogEntry;
	cache.set(id, entry);
	return entry;
}

/**
 * Heading ids on the plugin API page. Search builds deep links from the same
 * function — if the two disagree every result into an API page lands nowhere.
 */
export function anchor(s: string): string {
	return s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

/** `admin.conversationsGetTeams` groups under `admin`; a bare `send` is its own group. */
export function groupKey(shortPath: string): string {
	const i = shortPath.indexOf('.');
	return i === -1 ? shortPath : shortPath.slice(0, i);
}

export function methodKey(shortPath: string): string {
	const i = shortPath.indexOf('.');
	return i === -1 ? shortPath : shortPath.slice(i + 1);
}

export function groupOperations(
	ops: ApiOperation[],
): { group: string; operations: ApiOperation[] }[] {
	const byGroup = new Map<string, ApiOperation[]>();
	for (const op of ops) {
		const g = groupKey(op.shortPath);
		const list = byGroup.get(g);
		if (list) list.push(op);
		else byGroup.set(g, [op]);
	}
	return [...byGroup.entries()]
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([group, operations]) => ({
			group,
			operations: operations.sort((a, b) =>
				a.shortPath.localeCompare(b.shortPath),
			),
		}));
}
