import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Play, Query, Schema } from './endpoints';
import type {
	ClickhouseEndpointInputs,
	ClickhouseEndpointOutputs,
} from './endpoints/types';
import {
	ClickhouseEndpointInputSchemas,
	ClickhouseEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ClickhouseSchema } from './schema';

/**
 * Per-tenant ClickHouse HTTP endpoint (no trailing slash), e.g.
 * `https://ch.example.com:8443`. Each account stores this alongside its
 * basic-auth credential so different tenants can target different clusters.
 */
export type ClickhousePluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** HTTP endpoint of the ClickHouse server the plugin will query. */
	baseUrl?: string;
	key?: string;
	hooks?: InternalClickhousePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof clickhouseEndpointsNested>;
};

export type ClickhouseContext = CorsairPluginContext<
	typeof ClickhouseSchema,
	ClickhousePluginOptions,
	undefined,
	typeof clickhouseAuthConfig
>;

export type ClickhouseKeyBuilderContext =
	KeyBuilderContext<ClickhousePluginOptions>;

export type ClickhouseBoundEndpoints = BindEndpoints<
	typeof clickhouseEndpointsNested
>;

type ClickhouseEndpoint<K extends keyof ClickhouseEndpointOutputs> =
	CorsairEndpoint<
		ClickhouseContext,
		ClickhouseEndpointInputs[K],
		ClickhouseEndpointOutputs[K]
	>;

export type ClickhouseEndpoints = {
	executeQuery: ClickhouseEndpoint<'executeQuery'>;
	listDatabases: ClickhouseEndpoint<'listDatabases'>;
	listTables: ClickhouseEndpoint<'listTables'>;
	getDatabaseSchema: ClickhouseEndpoint<'getDatabaseSchema'>;
	getTableSchema: ClickhouseEndpoint<'getTableSchema'>;
	getPlayInterface: ClickhouseEndpoint<'getPlayInterface'>;
};

// ClickHouse has no inbound webhook surface — queries are pull-only.
const clickhouseWebhooksNested = {} as const;

const clickhouseEndpointsNested = {
	query: {
		execute: Query.execute,
		listDatabases: Query.listDatabases,
		listTables: Query.listTables,
	},
	schema: {
		getDatabase: Schema.getDatabase,
		getTable: Schema.getTable,
	},
	play: {
		get: Play.get,
	},
} as const;

export const clickhouseEndpointSchemas = {
	'query.execute': {
		input: ClickhouseEndpointInputSchemas.executeQuery,
		output: ClickhouseEndpointOutputSchemas.executeQuery,
	},
	'query.listDatabases': {
		input: ClickhouseEndpointInputSchemas.listDatabases,
		output: ClickhouseEndpointOutputSchemas.listDatabases,
	},
	'query.listTables': {
		input: ClickhouseEndpointInputSchemas.listTables,
		output: ClickhouseEndpointOutputSchemas.listTables,
	},
	'schema.getDatabase': {
		input: ClickhouseEndpointInputSchemas.getDatabaseSchema,
		output: ClickhouseEndpointOutputSchemas.getDatabaseSchema,
	},
	'schema.getTable': {
		input: ClickhouseEndpointInputSchemas.getTableSchema,
		output: ClickhouseEndpointOutputSchemas.getTableSchema,
	},
	'play.get': {
		input: ClickhouseEndpointInputSchemas.getPlayInterface,
		output: ClickhouseEndpointOutputSchemas.getPlayInterface,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof clickhouseEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const clickhouseEndpointMeta = {
	'query.execute': {
		// query.execute accepts arbitrary SQL, including statements that
		// mutate or destroy data (INSERT, UPDATE, DELETE, DROP, ALTER,
		// TRUNCATE, KILL QUERY, ...). Mark it as destructive and irreversible
		// so Corsair's permission guard prompts the user before an agent can
		// call it without explicit approval.
		riskLevel: 'destructive' as const,
		irreversible: true,
		description:
			'Execute a SQL query against the tenant ClickHouse instance and return the result rows. Arbitrary SQL is accepted — destructive statements require explicit permission.',
	},
	'query.listDatabases': {
		riskLevel: 'read' as const,
		description: 'List all databases on the tenant ClickHouse instance.',
	},
	'query.listTables': {
		riskLevel: 'read' as const,
		description:
			'List tables in a ClickHouse database with their engine and approximate size.',
	},
	'schema.getDatabase': {
		riskLevel: 'read' as const,
		description:
			'Get schema overview for a ClickHouse database; optionally include column definitions for each table.',
	},
	'schema.getTable': {
		riskLevel: 'read' as const,
		description:
			'Get column-level schema for a ClickHouse table, optionally with sample rows.',
	},
	'play.get': {
		riskLevel: 'read' as const,
		description:
			'Fetch the ClickHouse Play web UI HTML (Monaco editor + query UI).',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof clickhouseEndpointsNested
>;

export const clickhouseAuthConfig = {
	api_key: {
		// Each account stores its per-tenant ClickHouse HTTP endpoint here so
		// different tenants can target different clusters. Endpoints resolve
		// it via ctx.keys.get_tenant_external_id() when ctx.options.baseUrl
		// is not provided (multi-tenant mode).
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseClickhousePlugin<T extends ClickhousePluginOptions> =
	CorsairPlugin<
		'clickhouse',
		typeof ClickhouseSchema,
		typeof clickhouseEndpointsNested,
		typeof clickhouseWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalClickhousePlugin =
	BaseClickhousePlugin<ClickhousePluginOptions>;

export type ExternalClickhousePlugin<T extends ClickhousePluginOptions> =
	BaseClickhousePlugin<T>;

export function clickhouse<const T extends ClickhousePluginOptions>(
	incomingOptions: ClickhousePluginOptions & T = {} as ClickhousePluginOptions &
		T,
): ExternalClickhousePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'clickhouse',
		authConfig: clickhouseAuthConfig,
		schema: ClickhouseSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: clickhouseEndpointsNested,
		webhooks: clickhouseWebhooksNested,
		endpointMeta: clickhouseEndpointMeta,
		endpointSchemas: clickhouseEndpointSchemas,
		// No inbound webhook surface — ClickHouse HTTP is request/response only.
		pluginWebhookMatcher: (_request) => false,
		pluginTenantWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ClickhouseKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (ctx.authType === 'api_key') {
				const stored = await ctx.keys.get_api_key();
				if (!stored) {
					throw new AuthMissingError('clickhouse', 'api_key');
				}
				return stored.startsWith('Basic ') ? stored : `Basic ${stored}`;
			}
			throw new AuthMissingError('clickhouse', 'api_key');
		},
	} satisfies InternalClickhousePlugin;
}

export type {
	ClickhouseEndpointInputs,
	ClickhouseEndpointOutputs,
	ExecuteQueryInput,
	ExecuteQueryResponse,
	GetDatabaseSchemaInput,
	GetDatabaseSchemaResponse,
	GetPlayInterfaceInput,
	GetPlayInterfaceResponse,
	GetTableSchemaInput,
	GetTableSchemaResponse,
	ListDatabasesInput,
	ListDatabasesResponse,
	ListTablesInput,
	ListTablesResponse,
} from './endpoints/types';
export {
	ClickhouseEndpointInputSchemas,
	ClickhouseEndpointOutputSchemas,
} from './endpoints/types';
export { ClickhouseSchema } from './schema';
