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
	documentsExists: ElasticsearchEndpoint<'documentsExists'>;
	documentsIndex: ElasticsearchEndpoint<'documentsIndex'>;
	documentsCreate: ElasticsearchEndpoint<'documentsCreate'>;
	documentsUpdate: ElasticsearchEndpoint<'documentsUpdate'>;
	documentsDelete: ElasticsearchEndpoint<'documentsDelete'>;
	documentsUpdateByQuery: ElasticsearchEndpoint<'documentsUpdateByQuery'>;
	documentsDeleteByQuery: ElasticsearchEndpoint<'documentsDeleteByQuery'>;
	documentsMget: ElasticsearchEndpoint<'documentsMget'>;
	documentsGetSource: ElasticsearchEndpoint<'documentsGetSource'>;
	documentsExistsSource: ElasticsearchEndpoint<'documentsExistsSource'>;
	documentsExplain: ElasticsearchEndpoint<'documentsExplain'>;
	documentsTermvectors: ElasticsearchEndpoint<'documentsTermvectors'>;
	documentsMtermvectors: ElasticsearchEndpoint<'documentsMtermvectors'>;
	documentsBulk: ElasticsearchEndpoint<'documentsBulk'>;
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
		exists: Documents.exists,
		index: Documents.index,
		create: Documents.create,
		update: Documents.update,
		delete: Documents.remove,
		updateByQuery: Documents.updateByQuery,
		deleteByQuery: Documents.deleteByQuery,
		mget: Documents.mget,
		getSource: Documents.getSource,
		existsSource: Documents.existsSource,
		explain: Documents.explain,
		termvectors: Documents.termvectors,
		mtermvectors: Documents.mtermvectors,
		bulk: Documents.bulk,
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
	'documents.exists': {
		input: ElasticsearchEndpointInputSchemas.documentsExists,
		output: ElasticsearchEndpointOutputSchemas.documentsExists,
	},
	'documents.index': {
		input: ElasticsearchEndpointInputSchemas.documentsIndex,
		output: ElasticsearchEndpointOutputSchemas.documentsIndex,
	},
	'documents.create': {
		input: ElasticsearchEndpointInputSchemas.documentsCreate,
		output: ElasticsearchEndpointOutputSchemas.documentsCreate,
	},
	'documents.update': {
		input: ElasticsearchEndpointInputSchemas.documentsUpdate,
		output: ElasticsearchEndpointOutputSchemas.documentsUpdate,
	},
	'documents.delete': {
		input: ElasticsearchEndpointInputSchemas.documentsDelete,
		output: ElasticsearchEndpointOutputSchemas.documentsDelete,
	},
	'documents.updateByQuery': {
		input: ElasticsearchEndpointInputSchemas.documentsUpdateByQuery,
		output: ElasticsearchEndpointOutputSchemas.documentsUpdateByQuery,
	},
	'documents.deleteByQuery': {
		input: ElasticsearchEndpointInputSchemas.documentsDeleteByQuery,
		output: ElasticsearchEndpointOutputSchemas.documentsDeleteByQuery,
	},
	'documents.mget': {
		input: ElasticsearchEndpointInputSchemas.documentsMget,
		output: ElasticsearchEndpointOutputSchemas.documentsMget,
	},
	'documents.getSource': {
		input: ElasticsearchEndpointInputSchemas.documentsGetSource,
		output: ElasticsearchEndpointOutputSchemas.documentsGetSource,
	},
	'documents.existsSource': {
		input: ElasticsearchEndpointInputSchemas.documentsExistsSource,
		output: ElasticsearchEndpointOutputSchemas.documentsExistsSource,
	},
	'documents.explain': {
		input: ElasticsearchEndpointInputSchemas.documentsExplain,
		output: ElasticsearchEndpointOutputSchemas.documentsExplain,
	},
	'documents.termvectors': {
		input: ElasticsearchEndpointInputSchemas.documentsTermvectors,
		output: ElasticsearchEndpointOutputSchemas.documentsTermvectors,
	},
	'documents.mtermvectors': {
		input: ElasticsearchEndpointInputSchemas.documentsMtermvectors,
		output: ElasticsearchEndpointOutputSchemas.documentsMtermvectors,
	},
	'documents.bulk': {
		input: ElasticsearchEndpointInputSchemas.documentsBulk,
		output: ElasticsearchEndpointOutputSchemas.documentsBulk,
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
	'documents.exists': {
		riskLevel: 'read',
		description:
			'Check whether a document exists (HEAD): resolves to { exists: boolean } instead of throwing on 404',
	},
	'documents.index': {
		riskLevel: 'write',
		description:
			'Create or replace a document by id (POST /{index}/_doc/{id}) with optional op_type, refresh and optimistic-concurrency controls',
	},
	'documents.create': {
		riskLevel: 'write',
		description:
			'Create a document only if no document with the id exists yet (POST /{index}/_create/{id}); a duplicate answers 409',
	},
	'documents.update': {
		riskLevel: 'write',
		description:
			'Update one document with a partial doc merge or a script (exactly one), with optional upsert and retry-on-conflict',
	},
	'documents.delete': {
		riskLevel: 'destructive',
		description:
			'Delete one document by id; a missing document answers 404 with result: not_found instead of an error',
	},
	'documents.updateByQuery': {
		riskLevel: 'write',
		description:
			'Update every document matching a query with a script, optionally throttled, sliced and run as a background task',
	},
	'documents.deleteByQuery': {
		riskLevel: 'destructive',
		description:
			'Delete every document matching a query (the query is mandatory so the deletion set is always explicit)',
	},
	'documents.mget': {
		riskLevel: 'read',
		description:
			'Fetch multiple documents in one request by ids (under the path index) or explicit { _index, _id } entries',
	},
	'documents.getSource': {
		riskLevel: 'read',
		description:
			"Get a document's _source JSON directly by index and id; a missing document is a 404 error (unlike documents.get)",
	},
	'documents.existsSource': {
		riskLevel: 'read',
		description:
			'Check whether a stored _source exists for a document (HEAD): resolves to { exists: boolean }',
	},
	'documents.explain': {
		riskLevel: 'read',
		description:
			'Explain whether and why a document matches a query: score computation and optional inline get back',
	},
	'documents.termvectors': {
		riskLevel: 'read',
		description:
			'Get term-vector statistics (terms, positions, offsets, payloads, frequencies) for one document',
	},
	'documents.mtermvectors': {
		riskLevel: 'read',
		description:
			'Get term vectors for multiple documents by ids or { _index, _id } entries in one request',
	},
	'documents.bulk': {
		riskLevel: 'write',
		description:
			'Bulk index, create, update or delete documents on one target (PUT /{index}/_bulk) from typed operations or raw NDJSON',
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
