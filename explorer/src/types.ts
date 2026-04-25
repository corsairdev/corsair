/**
 * Types for the explorer catalog.
 *
 * These mirror the doc-introspection types from `corsair/core/inspect` but are
 * defined locally so the explorer server has no runtime dependency on
 * `corsair`. The catalog builder script (scripts/build-explorer-catalog.ts)
 * produces a JSON that conforms to {@link PluginCatalog} and the server just
 * reads it.
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
	api: DocsApiEndpoint[];
	webhooks: DocsWebhook[];
	db: DocsDbEntity[];
};

export type PluginCatalog = {
	/** ISO timestamp for when the catalog was built. */
	generatedAt: string;
	/** `corsair` package version at build time. */
	corsairVersion: string;
	/** Schema version for consumers that want to guard against breaking changes. */
	catalogVersion: 1;
	plugins: PluginEntry[];
};
