import type {
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
import { buildAuthorizationHeader } from './client';
import { Cluster, Documents, Indices, Search } from './endpoints';
import type {
	ElasticsearchEndpointInputs,
	ElasticsearchEndpointOutputs,
} from './endpoints/types';
import {
	ElasticsearchEndpointInputSchemas,
	ElasticsearchEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ElasticsearchSchema } from './schema';

/**
 * Elasticsearch is self-hosted: each account stores its own cluster endpoint
 * in `baseUrl` (for example `https://es.internal.example:9200`) next to the
 * credential, so different tenants target different clusters. The `baseUrl`
 * option overrides it in solo mode.
 */
export type ElasticsearchPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Cluster endpoint for solo mode (per-account `baseUrl` otherwise). */
	baseUrl?: string;
	key?: string;
	hooks?: InternalElasticsearchPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof elasticsearchEndpointsNested>;
};

export const elasticsearchAuthConfig = {
	api_key: {
		account: ['baseUrl'] as const,
	},
} as const satisfies PluginAuthConfig;

export type ElasticsearchContext = CorsairPluginContext<
	typeof ElasticsearchSchema,
	ElasticsearchPluginOptions,
	undefined,
	typeof elasticsearchAuthConfig
>;

export type ElasticsearchKeyBuilderContext = KeyBuilderContext<
	ElasticsearchPluginOptions,
	typeof elasticsearchAuthConfig
>;

export type ElasticsearchBoundEndpoints = BindEndpoints<
	typeof elasticsearchEndpointsNested
>;

type ElasticsearchEndpoint<K extends keyof ElasticsearchEndpointOutputs> =
	CorsairEndpoint<
		ElasticsearchContext,
		ElasticsearchEndpointInputs[K],
		ElasticsearchEndpointOutputs[K]
	>;

export type ElasticsearchEndpoints = {
	clusterGetHealth: ElasticsearchEndpoint<'clusterGetHealth'>;
	indicesList: ElasticsearchEndpoint<'indicesList'>;
	indicesGet: ElasticsearchEndpoint<'indicesGet'>;
	searchRun: ElasticsearchEndpoint<'searchRun'>;
	documentsGet: ElasticsearchEndpoint<'documentsGet'>;
};

// Elasticsearch has no inbound webhook surface — the REST API is
// request/response only.
const elasticsearchWebhooksNested = {} as const;

const elasticsearchEndpointsNested = {
	cluster: {
		getHealth: Cluster.getHealth,
	},
	indices: {
		list: Indices.list,
		get: Indices.get,
	},
	search: {
		run: Search.run,
	},
	documents: {
		get: Documents.get,
	},
} as const;

export const elasticsearchEndpointSchemas = {
	'cluster.getHealth': {
		input: ElasticsearchEndpointInputSchemas.clusterGetHealth,
		output: ElasticsearchEndpointOutputSchemas.clusterGetHealth,
	},
	'indices.list': {
		input: ElasticsearchEndpointInputSchemas.indicesList,
		output: ElasticsearchEndpointOutputSchemas.indicesList,
	},
	'indices.get': {
		input: ElasticsearchEndpointInputSchemas.indicesGet,
		output: ElasticsearchEndpointOutputSchemas.indicesGet,
	},
	'search.run': {
		input: ElasticsearchEndpointInputSchemas.searchRun,
		output: ElasticsearchEndpointOutputSchemas.searchRun,
	},
	'documents.get': {
		input: ElasticsearchEndpointInputSchemas.documentsGet,
		output: ElasticsearchEndpointOutputSchemas.documentsGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof elasticsearchEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const elasticsearchEndpointMeta = {
	'cluster.getHealth': {
		riskLevel: 'read',
		description:
			"Get the cluster's health status (green/yellow/red) with shard, node and pending-task counts",
	},
	'indices.list': {
		riskLevel: 'read',
		description:
			'List the indices (or data stream backing indices) matching a target, with health, shards, doc counts and store size',
	},
	'indices.get': {
		riskLevel: 'read',
		description:
			'Get mapping, settings and alias information for one or more indices or data streams',
	},
	'search.run': {
		riskLevel: 'read',
		description:
			'Search indices, data streams or aliases with a typed subset of the Query DSL (match, match_phrase, term, terms, ids, match_all, bool) with from/size paging',
	},
	'documents.get': {
		riskLevel: 'read',
		description:
			'Get one JSON document by index and id; a missing document returns found: false rather than an error',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof elasticsearchEndpointsNested
>;

export type BaseElasticsearchPlugin<T extends ElasticsearchPluginOptions> =
	CorsairPlugin<
		'elasticsearch',
		typeof ElasticsearchSchema,
		typeof elasticsearchEndpointsNested,
		typeof elasticsearchWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof elasticsearchAuthConfig
	>;

export type InternalElasticsearchPlugin =
	BaseElasticsearchPlugin<ElasticsearchPluginOptions>;

export type ExternalElasticsearchPlugin<T extends ElasticsearchPluginOptions> =
	BaseElasticsearchPlugin<T>;

// Handlers match in key order and DEFAULT matches everything, so it stays
// last even when the caller adds or overrides handlers.
function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const fallback = userDefault ?? builtinDefault;
	return fallback
		? { ...builtinRest, ...userRest, DEFAULT: fallback }
		: { ...builtinRest, ...userRest };
}

export function elasticsearch<const T extends ElasticsearchPluginOptions>(
	incomingOptions: ElasticsearchPluginOptions &
		T = {} as ElasticsearchPluginOptions & T,
): ExternalElasticsearchPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'elasticsearch',
		authConfig: elasticsearchAuthConfig,
		schema: ElasticsearchSchema,
		options: options,
		hooks: options.hooks,
		endpoints: elasticsearchEndpointsNested,
		webhooks: elasticsearchWebhooksNested,
		endpointMeta: elasticsearchEndpointMeta,
		endpointSchemas: elasticsearchEndpointSchemas,
		// No inbound webhook surface — Elasticsearch HTTP is pull-only.
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: ElasticsearchKeyBuilderContext, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('elasticsearch', ctx.authType ?? 'api_key');
			}
			if (options.key) return buildAuthorizationHeader(options.key);
			if (ctx.authType === 'api_key') {
				const stored = await ctx.keys.get_api_key();
				if (stored) return buildAuthorizationHeader(stored);
			}
			throw new AuthMissingError('elasticsearch', ctx.authType ?? 'api_key');
		},
	} satisfies InternalElasticsearchPlugin;
}

export {
	buildAuthorizationHeader,
	ElasticsearchAPIError,
	encodeIndexTarget,
} from './client';
export type {
	CatIndexRow,
	ClusterGetHealthInput,
	ClusterGetHealthResponse,
	DocumentsGetInput,
	DocumentsGetResponse,
	ElasticsearchEndpointInputs,
	ElasticsearchEndpointOutputs,
	IndicesGetInput,
	IndicesGetResponse,
	IndicesListInput,
	IndicesListResponse,
	SearchHit,
	SearchQuery,
	SearchRunInput,
	SearchRunResponse,
} from './endpoints/types';
export { ElasticsearchSchema } from './schema';
