/**
 * Types for the explorer catalog.
 *
 * These mirror the doc-introspection types from `corsair/core/inspect` but are
 * defined locally so the explorer server has no runtime dependency on
 * `corsair`. The catalog builder script (scripts/build-explorer-catalog.ts)
 * produces a {@link PluginCatalogIndex} at `data/catalog.json` and one
 * {@link PluginEntry} per plugin under `data/plugins/`. The server reads the
 * index at startup and lazy-loads plugin files on demand.
 */

export type DocSchemaFieldRow = {
	key: string;
	optional: boolean;
	type: string;
	description?: string;
};

export type DocSchemaShape =
	| { kind: 'object'; fields: DocSchemaFieldRow[] }
	| { kind: 'inline'; type: string };

export type EndpointRiskLevel = 'read' | 'write' | 'destructive';

export type DocsApiEndpoint = {
	path: string;
	/** Dot path after `plugin.api.` (e.g. `messages.post`). */
	shortPath: string;
	description?: string;
	riskLevel?: EndpointRiskLevel;
	irreversible?: boolean;
	input: DocSchemaShape;
	output: DocSchemaShape;
};

export type DocsWebhook = {
	path: string;
	/** Dot path after `plugin.webhooks.` (e.g. `messages.created`). */
	shortPath: string;
	description?: string;
	payload: DocSchemaShape;
	responseType?: string;
	usageExample: string;
};

export type DocsDbFilterField = {
	field: string;
	type: 'string' | 'number' | 'boolean' | 'date';
	operators: readonly string[];
};

export type DocsDbEntity = {
	path: string;
	entityName: string;
	filters: DocsDbFilterField[];
};

export type PluginAuthType = 'oauth_2' | 'api_key' | 'bot_token';

export type PluginCounts = {
	api: number;
	webhooks: number;
	db: number;
};

/**
 * Auth field metadata for a single auth type supported by a plugin.
 * Merges BASE_AUTH_FIELDS with any plugin-specific authConfig extensions.
 */
export type PluginAuthFields = {
	authType: PluginAuthType;
	/** Fields stored at the integration (shared/provider) level. */
	integrationFields: string[];
	/** Fields stored at the account (per-tenant) level. */
	accountFields: string[];
};

export type PluginSummary = {
	id: string;
	displayName: string;
	description?: string;
	npmPackageName: string;
	authTypes: PluginAuthType[];
	defaultAuthType?: PluginAuthType;
	counts: PluginCounts;
};

export type PluginEntry = PluginSummary & {
	/** Auth field metadata — one entry per supported auth type. */
	auth: PluginAuthFields[];
	api: DocsApiEndpoint[];
	webhooks: DocsWebhook[];
	db: DocsDbEntity[];
};

/** Lightweight row used by {@link PluginCatalogIndex.search}. */
export type CatalogSearchEntry = {
	pluginId: string;
	kind: 'api' | 'webhook';
	shortPath: string;
	/** Lowercase, space-joined searchable fields for substring matching. */
	haystack: string;
};

/** Small index file — one row per plugin plus a flat search index. */
export type PluginCatalogIndex = {
	/** ISO timestamp for when the catalog was built. */
	generatedAt: string;
	/** `corsair` package version at build time. */
	corsairVersion: string;
	/** Schema version for consumers that want to guard against breaking changes. */
	catalogVersion: 2;
	plugins: PluginSummary[];
	search: CatalogSearchEntry[];
};

export type IntegrationFaqId =
	| 'setup'
	| 'permissions'
	| 'combine'
	| 'use-cases'
	| 'pricing'
	| 'api-changes'
	| 'data-privacy';

export type IntegrationFaq = {
	id: IntegrationFaqId;
	question: string;
	answer: string;
};

export type IntegrationPage = {
	faqs: IntegrationFaq[];
};

/** FAQ copy for explorer integration pages — one entry per plugin id. */
export type IntegrationPagesIndex = {
	/** ISO timestamp for when the pages file was built. */
	generatedAt: string;
	/** Schema version for consumers that want to guard against breaking changes. */
	catalogVersion: 1;
	pages: Record<string, IntegrationPage>;
};

/**
 * Legacy monolithic catalog (v1). Prefer {@link PluginCatalogIndex} plus
 * per-plugin JSON files under `data/plugins/`.
 */
export type PluginCatalog = {
	/** ISO timestamp for when the catalog was built. */
	generatedAt: string;
	/** `corsair` package version at build time. */
	corsairVersion: string;
	/** Schema version for consumers that want to guard against breaking changes. */
	catalogVersion: 1;
	plugins: PluginEntry[];
};
