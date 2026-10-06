import type { AdvancedIndex } from 'fumadocs-core/search/server';
import type { PluginCatalogEntry } from './plugin-catalog';
import { anchor, getPlugin, groupKey } from './plugin-catalog';
import { resourceTitle } from './plugin-type-format';

type StructuredData = AdvancedIndex['structuredData'];

const PLUGIN_PAGE =
	/^\/plugins\/([a-z0-9]+)\/(overview|api|database|webhooks)$/;

function overviewData(plugin: PluginCatalogEntry): StructuredData {
	const { counts, authTypes, npmPackageName } = plugin;
	return {
		headings: [],
		contents: [
			{ heading: undefined, content: plugin.description ?? '' },
			{
				heading: undefined,
				content: [
					npmPackageName,
					`${counts.api} API operations`,
					`${counts.db} synced entities`,
					`${counts.webhooks} webhook events`,
					authTypes.length ? `auth: ${authTypes.join(', ')}` : undefined,
				]
					.filter(Boolean)
					.join(' · '),
			},
		],
	};
}

/**
 * One block per operation — every extra block costs ~800 bytes of index.
 * Anchors mirror `app/(docs)/plugins/[plugin]/api/page.tsx`, which ids by shortPath.
 */
function apiData(plugin: PluginCatalogEntry): StructuredData {
	const headings: StructuredData['headings'] = [];
	const seen = new Set<string>();
	for (const op of plugin.api) {
		const id = anchor(groupKey(op.shortPath));
		if (seen.has(id)) continue;
		seen.add(id);
		headings.push({ id, content: resourceTitle(groupKey(op.shortPath)) });
	}
	return {
		headings,
		contents: plugin.api.map((op) => ({
			heading: anchor(op.shortPath),
			content: op.description
				? `${op.shortPath} — ${op.description}`
				: op.shortPath,
		})),
	};
}

/** Group-level anchors only: the generated MDX dedupes per-entry ids, groups are stable. */
function groupedData(
	entries: { shortPath: string; description?: string }[],
): StructuredData {
	const headings: StructuredData['headings'] = [];
	const contents: StructuredData['contents'] = [];
	const seen = new Set<string>();
	for (const entry of entries) {
		const id = anchor(resourceTitle(groupKey(entry.shortPath)));
		if (!seen.has(id)) {
			seen.add(id);
			headings.push({ id, content: resourceTitle(groupKey(entry.shortPath)) });
		}
		contents.push({
			heading: id,
			content: entry.description
				? `${entry.shortPath} — ${entry.description}`
				: entry.shortPath,
		});
	}
	return { headings, contents };
}

function pageData(
	plugin: PluginCatalogEntry,
	leaf: string,
): { title: string; data: StructuredData } | null {
	if (leaf === 'overview')
		return { title: plugin.displayName, data: overviewData(plugin) };
	if (leaf === 'api')
		return { title: `${plugin.displayName} API`, data: apiData(plugin) };
	if (leaf === 'database') {
		const entities = plugin.db ?? [];
		return {
			title: `${plugin.displayName} database`,
			data: {
				headings: entities.map((entity) => ({
					id: anchor(resourceTitle(entity.entityName)),
					content: entity.entityName,
				})),
				// Readers search for a filter name, so an entity heading on its own
				// cannot reach this page.
				contents: entities.map((entity) => ({
					heading: anchor(resourceTitle(entity.entityName)),
					content: (entity.filters ?? []).map((f) => f.field).join(' '),
				})),
			},
		};
	}
	const webhooks = plugin.webhooks ?? [];
	if (webhooks.length === 0) return null;
	return {
		title: `${plugin.displayName} webhooks`,
		data: groupedData(webhooks),
	};
}

/**
 * Lean index entry for a plugin page, built from the catalog instead of the
 * generated MDX — those bodies are per-parameter tables that drown real pages.
 * Returns null for anything else, so the caller falls back to page content.
 */
export function pluginSearchIndex(url: string): AdvancedIndex | null {
	const match = PLUGIN_PAGE.exec(url);
	if (!match) return null;
	const plugin = getPlugin(match[1]);
	if (!plugin) return null;
	const page = pageData(plugin, match[2]);
	if (!page) return null;

	return {
		// Results are grouped by id and dropped whole if it does not resolve to a page.
		id: url,
		url,
		title: page.title,
		description: plugin.description,
		breadcrumbs: ['Plugins', plugin.displayName],
		tag: 'plugin',
		structuredData: page.data,
	};
}
