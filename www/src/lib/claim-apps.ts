import type { IntegrationCatalogEntry } from '@/lib/integrations-catalog.types';
import { POPULAR_INTEGRATION_IDS } from '@/lib/popular-integrations';

/** What the /start app picker needs of a catalog entry. `actions` is how many API operations the agent gets. */
export type ClaimApp = { id: string; name: string; actions: number };

type CatalogFields = Pick<IntegrationCatalogEntry, 'id' | 'displayName'> & {
	counts?: { api?: number };
};

const ID_RE = /^[a-z0-9]+$/;

/** The picker's slice of the catalog, sorted by name. Ids Hub can't take in a comma list are left out. */
export function toClaimApps(entries: readonly CatalogFields[]): ClaimApp[] {
	return entries
		.filter((e) => ID_RE.test(e.id) && e.displayName)
		.map((e) => ({
			id: e.id,
			name: e.displayName,
			actions: e.counts?.api ?? 0,
		}))
		.sort((a, b) => a.name.localeCompare(b.name, 'en'));
}

const SHELF_SIZE = 24;

export type AppCatalog = {
	ids: ReadonlySet<string>;
	byId: (id: string) => ClaimApp | undefined;
	/** Total API operations across the given apps; unknown ids count as none. */
	actionsOf: (ids: readonly string[]) => number;
	/** Apps whose name or id contains the query, case-insensitively, in catalog order. */
	search: (query: string, limit: number) => ClaimApp[];
	/** What the picker shows before a search: `lead` first, then the popular apps from /integrations. */
	shelf: (lead?: readonly string[]) => string[];
	/** e.g. "700+": rounded down so the claim stays true as the catalog moves. */
	countLabel: string;
};

export function appCatalog(apps: readonly ClaimApp[]): AppCatalog {
	const map = new Map(apps.map((a) => [a.id, a]));
	const popular = POPULAR_INTEGRATION_IDS.filter((id) => map.has(id)).slice(
		0,
		SHELF_SIZE,
	);
	return {
		ids: new Set(map.keys()),
		byId: (id) => map.get(id),
		actionsOf: (ids) =>
			ids.reduce((n, id) => n + (map.get(id)?.actions ?? 0), 0),
		search: (query, limit) => {
			const q = query.trim().toLowerCase();
			if (!q) return [];
			return apps
				.filter((a) => a.name.toLowerCase().includes(q) || a.id.includes(q))
				.slice(0, limit);
		},
		shelf: (lead = []) => {
			const known = lead.filter((id) => map.has(id));
			return [...known, ...popular.filter((id) => !known.includes(id))];
		},
		countLabel: `${Math.floor(apps.length / 100) * 100}+`,
	};
}
