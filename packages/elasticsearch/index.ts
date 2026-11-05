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
import { Ccr, Cluster, Documents, Fleet, Indices, Search } from './endpoints';
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
	indicesCreate: ElasticsearchEndpoint<'indicesCreate'>;
	indicesExists: ElasticsearchEndpoint<'indicesExists'>;
	indicesDelete: ElasticsearchEndpoint<'indicesDelete'>;
	indicesOpen: ElasticsearchEndpoint<'indicesOpen'>;
	indicesClose: ElasticsearchEndpoint<'indicesClose'>;
	indicesAddBlock: ElasticsearchEndpoint<'indicesAddBlock'>;
	indicesRemoveBlock: ElasticsearchEndpoint<'indicesRemoveBlock'>;
	indicesGetMapping: ElasticsearchEndpoint<'indicesGetMapping'>;
	indicesPutMapping: ElasticsearchEndpoint<'indicesPutMapping'>;
	indicesGetFieldMapping: ElasticsearchEndpoint<'indicesGetFieldMapping'>;
	indicesGetSettings: ElasticsearchEndpoint<'indicesGetSettings'>;
	indicesPutSettings: ElasticsearchEndpoint<'indicesPutSettings'>;
	indicesGetAlias: ElasticsearchEndpoint<'indicesGetAlias'>;
	indicesExistsAlias: ElasticsearchEndpoint<'indicesExistsAlias'>;
	indicesPutAlias: ElasticsearchEndpoint<'indicesPutAlias'>;
	indicesDeleteAlias: ElasticsearchEndpoint<'indicesDeleteAlias'>;
	indicesRollover: ElasticsearchEndpoint<'indicesRollover'>;
	indicesClone: ElasticsearchEndpoint<'indicesClone'>;
	indicesSplit: ElasticsearchEndpoint<'indicesSplit'>;
	indicesShrink: ElasticsearchEndpoint<'indicesShrink'>;
	indicesDownsample: ElasticsearchEndpoint<'indicesDownsample'>;
	indicesAnalyze: ElasticsearchEndpoint<'indicesAnalyze'>;
	indicesStats: ElasticsearchEndpoint<'indicesStats'>;
	indicesSegments: ElasticsearchEndpoint<'indicesSegments'>;
	indicesRecovery: ElasticsearchEndpoint<'indicesRecovery'>;
	indicesShardStores: ElasticsearchEndpoint<'indicesShardStores'>;
	indicesRefresh: ElasticsearchEndpoint<'indicesRefresh'>;
	indicesFlush: ElasticsearchEndpoint<'indicesFlush'>;
	indicesForceMerge: ElasticsearchEndpoint<'indicesForceMerge'>;
	indicesCacheClear: ElasticsearchEndpoint<'indicesCacheClear'>;
	indicesReloadSearchAnalyzers: ElasticsearchEndpoint<'indicesReloadSearchAnalyzers'>;
	indicesDiskUsage: ElasticsearchEndpoint<'indicesDiskUsage'>;
	indicesFieldUsageStats: ElasticsearchEndpoint<'indicesFieldUsageStats'>;
	indicesDeprecations: ElasticsearchEndpoint<'indicesDeprecations'>;
	indicesExplainDataLifecycle: ElasticsearchEndpoint<'indicesExplainDataLifecycle'>;
	indicesIlmExplain: ElasticsearchEndpoint<'indicesIlmExplain'>;
	indicesIlmRemove: ElasticsearchEndpoint<'indicesIlmRemove'>;
	indicesIlmRetry: ElasticsearchEndpoint<'indicesIlmRetry'>;
	indicesClearSearchableSnapshotCache: ElasticsearchEndpoint<'indicesClearSearchableSnapshotCache'>;
	indicesSearchableSnapshotStats: ElasticsearchEndpoint<'indicesSearchableSnapshotStats'>;
	searchCount: ElasticsearchEndpoint<'searchCount'>;
	searchMsearch: ElasticsearchEndpoint<'searchMsearch'>;
	searchMsearchTemplate: ElasticsearchEndpoint<'searchMsearchTemplate'>;
	searchTemplate: ElasticsearchEndpoint<'searchTemplate'>;
	searchTermsEnum: ElasticsearchEndpoint<'searchTermsEnum'>;
	searchFieldCaps: ElasticsearchEndpoint<'searchFieldCaps'>;
	searchShards: ElasticsearchEndpoint<'searchShards'>;
	searchOpenPointInTime: ElasticsearchEndpoint<'searchOpenPointInTime'>;
	searchRankEval: ElasticsearchEndpoint<'searchRankEval'>;
	searchVectorTile: ElasticsearchEndpoint<'searchVectorTile'>;
	searchEql: ElasticsearchEndpoint<'searchEql'>;
	searchAsyncSubmit: ElasticsearchEndpoint<'searchAsyncSubmit'>;
	searchGraphExplore: ElasticsearchEndpoint<'searchGraphExplore'>;
	searchValidateQuery: ElasticsearchEndpoint<'searchValidateQuery'>;
	fleetSearch: ElasticsearchEndpoint<'fleetSearch'>;
	fleetMsearch: ElasticsearchEndpoint<'fleetMsearch'>;
	fleetGlobalCheckpoints: ElasticsearchEndpoint<'fleetGlobalCheckpoints'>;
	ccrFollow: ElasticsearchEndpoint<'ccrFollow'>;
	ccrFollowInfo: ElasticsearchEndpoint<'ccrFollowInfo'>;
	ccrFollowStats: ElasticsearchEndpoint<'ccrFollowStats'>;
	ccrForgetFollower: ElasticsearchEndpoint<'ccrForgetFollower'>;
	ccrPauseFollow: ElasticsearchEndpoint<'ccrPauseFollow'>;
	ccrResumeFollow: ElasticsearchEndpoint<'ccrResumeFollow'>;
	ccrUnfollow: ElasticsearchEndpoint<'ccrUnfollow'>;
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
		create: Indices.create,
		exists: Indices.exists,
		delete: Indices.remove,
		open: Indices.open,
		close: Indices.close,
		addBlock: Indices.addBlock,
		removeBlock: Indices.removeBlock,
		getMapping: Indices.getMapping,
		putMapping: Indices.putMapping,
		getFieldMapping: Indices.getFieldMapping,
		getSettings: Indices.getSettings,
		putSettings: Indices.putSettings,
		getAlias: Indices.getAlias,
		existsAlias: Indices.existsAlias,
		putAlias: Indices.putAlias,
		deleteAlias: Indices.deleteAlias,
		rollover: Indices.rollover,
		clone: Indices.clone,
		split: Indices.split,
		shrink: Indices.shrink,
		downsample: Indices.downsample,
		analyze: Indices.analyze,
		stats: Indices.stats,
		segments: Indices.segments,
		recovery: Indices.recovery,
		shardStores: Indices.shardStores,
		refresh: Indices.refresh,
		flush: Indices.flush,
		forceMerge: Indices.forceMerge,
		cacheClear: Indices.cacheClear,
		reloadSearchAnalyzers: Indices.reloadSearchAnalyzers,
		diskUsage: Indices.diskUsage,
		fieldUsageStats: Indices.fieldUsageStats,
		deprecations: Indices.deprecations,
		explainDataLifecycle: Indices.explainDataLifecycle,
		ilmExplain: Indices.ilmExplain,
		ilmRemove: Indices.ilmRemove,
		ilmRetry: Indices.ilmRetry,
		clearSearchableSnapshotCache: Indices.clearSearchableSnapshotCache,
		searchableSnapshotStats: Indices.searchableSnapshotStats,
	},
	search: {
		run: Search.run,
		count: Search.count,
		msearch: Search.msearch,
		msearchTemplate: Search.msearchTemplate,
		template: Search.template,
		termsEnum: Search.termsEnum,
		fieldCaps: Search.fieldCaps,
		shards: Search.shards,
		openPointInTime: Search.openPointInTime,
		rankEval: Search.rankEval,
		vectorTile: Search.vectorTile,
		eql: Search.eql,
		asyncSubmit: Search.asyncSubmit,
		graphExplore: Search.graphExplore,
		validateQuery: Search.validateQuery,
	},
	fleet: {
		search: Fleet.search,
		msearch: Fleet.msearch,
		globalCheckpoints: Fleet.globalCheckpoints,
	},
	ccr: {
		follow: Ccr.follow,
		followInfo: Ccr.followInfo,
		followStats: Ccr.followStats,
		forgetFollower: Ccr.forgetFollower,
		pauseFollow: Ccr.pauseFollow,
		resumeFollow: Ccr.resumeFollow,
		unfollow: Ccr.unfollow,
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
	'indices.create': {
		input: ElasticsearchEndpointInputSchemas.indicesCreate,
		output: ElasticsearchEndpointOutputSchemas.indicesCreate,
	},
	'indices.exists': {
		input: ElasticsearchEndpointInputSchemas.indicesExists,
		output: ElasticsearchEndpointOutputSchemas.indicesExists,
	},
	'indices.delete': {
		input: ElasticsearchEndpointInputSchemas.indicesDelete,
		output: ElasticsearchEndpointOutputSchemas.indicesDelete,
	},
	'indices.open': {
		input: ElasticsearchEndpointInputSchemas.indicesOpen,
		output: ElasticsearchEndpointOutputSchemas.indicesOpen,
	},
	'indices.close': {
		input: ElasticsearchEndpointInputSchemas.indicesClose,
		output: ElasticsearchEndpointOutputSchemas.indicesClose,
	},
	'indices.addBlock': {
		input: ElasticsearchEndpointInputSchemas.indicesAddBlock,
		output: ElasticsearchEndpointOutputSchemas.indicesAddBlock,
	},
	'indices.removeBlock': {
		input: ElasticsearchEndpointInputSchemas.indicesRemoveBlock,
		output: ElasticsearchEndpointOutputSchemas.indicesRemoveBlock,
	},
	'indices.getMapping': {
		input: ElasticsearchEndpointInputSchemas.indicesGetMapping,
		output: ElasticsearchEndpointOutputSchemas.indicesGetMapping,
	},
	'indices.putMapping': {
		input: ElasticsearchEndpointInputSchemas.indicesPutMapping,
		output: ElasticsearchEndpointOutputSchemas.indicesPutMapping,
	},
	'indices.getFieldMapping': {
		input: ElasticsearchEndpointInputSchemas.indicesGetFieldMapping,
		output: ElasticsearchEndpointOutputSchemas.indicesGetFieldMapping,
	},
	'indices.getSettings': {
		input: ElasticsearchEndpointInputSchemas.indicesGetSettings,
		output: ElasticsearchEndpointOutputSchemas.indicesGetSettings,
	},
	'indices.putSettings': {
		input: ElasticsearchEndpointInputSchemas.indicesPutSettings,
		output: ElasticsearchEndpointOutputSchemas.indicesPutSettings,
	},
	'indices.getAlias': {
		input: ElasticsearchEndpointInputSchemas.indicesGetAlias,
		output: ElasticsearchEndpointOutputSchemas.indicesGetAlias,
	},
	'indices.existsAlias': {
		input: ElasticsearchEndpointInputSchemas.indicesExistsAlias,
		output: ElasticsearchEndpointOutputSchemas.indicesExistsAlias,
	},
	'indices.putAlias': {
		input: ElasticsearchEndpointInputSchemas.indicesPutAlias,
		output: ElasticsearchEndpointOutputSchemas.indicesPutAlias,
	},
	'indices.deleteAlias': {
		input: ElasticsearchEndpointInputSchemas.indicesDeleteAlias,
		output: ElasticsearchEndpointOutputSchemas.indicesDeleteAlias,
	},
	'indices.rollover': {
		input: ElasticsearchEndpointInputSchemas.indicesRollover,
		output: ElasticsearchEndpointOutputSchemas.indicesRollover,
	},
	'indices.clone': {
		input: ElasticsearchEndpointInputSchemas.indicesClone,
		output: ElasticsearchEndpointOutputSchemas.indicesClone,
	},
	'indices.split': {
		input: ElasticsearchEndpointInputSchemas.indicesSplit,
		output: ElasticsearchEndpointOutputSchemas.indicesSplit,
	},
	'indices.shrink': {
		input: ElasticsearchEndpointInputSchemas.indicesShrink,
		output: ElasticsearchEndpointOutputSchemas.indicesShrink,
	},
	'indices.downsample': {
		input: ElasticsearchEndpointInputSchemas.indicesDownsample,
		output: ElasticsearchEndpointOutputSchemas.indicesDownsample,
	},
	'indices.analyze': {
		input: ElasticsearchEndpointInputSchemas.indicesAnalyze,
		output: ElasticsearchEndpointOutputSchemas.indicesAnalyze,
	},
	'indices.stats': {
		input: ElasticsearchEndpointInputSchemas.indicesStats,
		output: ElasticsearchEndpointOutputSchemas.indicesStats,
	},
	'indices.segments': {
		input: ElasticsearchEndpointInputSchemas.indicesSegments,
		output: ElasticsearchEndpointOutputSchemas.indicesSegments,
	},
	'indices.recovery': {
		input: ElasticsearchEndpointInputSchemas.indicesRecovery,
		output: ElasticsearchEndpointOutputSchemas.indicesRecovery,
	},
	'indices.shardStores': {
		input: ElasticsearchEndpointInputSchemas.indicesShardStores,
		output: ElasticsearchEndpointOutputSchemas.indicesShardStores,
	},
	'indices.refresh': {
		input: ElasticsearchEndpointInputSchemas.indicesRefresh,
		output: ElasticsearchEndpointOutputSchemas.indicesRefresh,
	},
	'indices.flush': {
		input: ElasticsearchEndpointInputSchemas.indicesFlush,
		output: ElasticsearchEndpointOutputSchemas.indicesFlush,
	},
	'indices.forceMerge': {
		input: ElasticsearchEndpointInputSchemas.indicesForceMerge,
		output: ElasticsearchEndpointOutputSchemas.indicesForceMerge,
	},
	'indices.cacheClear': {
		input: ElasticsearchEndpointInputSchemas.indicesCacheClear,
		output: ElasticsearchEndpointOutputSchemas.indicesCacheClear,
	},
	'indices.reloadSearchAnalyzers': {
		input: ElasticsearchEndpointInputSchemas.indicesReloadSearchAnalyzers,
		output: ElasticsearchEndpointOutputSchemas.indicesReloadSearchAnalyzers,
	},
	'indices.diskUsage': {
		input: ElasticsearchEndpointInputSchemas.indicesDiskUsage,
		output: ElasticsearchEndpointOutputSchemas.indicesDiskUsage,
	},
	'indices.fieldUsageStats': {
		input: ElasticsearchEndpointInputSchemas.indicesFieldUsageStats,
		output: ElasticsearchEndpointOutputSchemas.indicesFieldUsageStats,
	},
	'indices.deprecations': {
		input: ElasticsearchEndpointInputSchemas.indicesDeprecations,
		output: ElasticsearchEndpointOutputSchemas.indicesDeprecations,
	},
	'indices.explainDataLifecycle': {
		input: ElasticsearchEndpointInputSchemas.indicesExplainDataLifecycle,
		output: ElasticsearchEndpointOutputSchemas.indicesExplainDataLifecycle,
	},
	'indices.ilmExplain': {
		input: ElasticsearchEndpointInputSchemas.indicesIlmExplain,
		output: ElasticsearchEndpointOutputSchemas.indicesIlmExplain,
	},
	'indices.ilmRemove': {
		input: ElasticsearchEndpointInputSchemas.indicesIlmRemove,
		output: ElasticsearchEndpointOutputSchemas.indicesIlmRemove,
	},
	'indices.ilmRetry': {
		input: ElasticsearchEndpointInputSchemas.indicesIlmRetry,
		output: ElasticsearchEndpointOutputSchemas.indicesIlmRetry,
	},
	'indices.clearSearchableSnapshotCache': {
		input:
			ElasticsearchEndpointInputSchemas.indicesClearSearchableSnapshotCache,
		output:
			ElasticsearchEndpointOutputSchemas.indicesClearSearchableSnapshotCache,
	},
	'indices.searchableSnapshotStats': {
		input: ElasticsearchEndpointInputSchemas.indicesSearchableSnapshotStats,
		output: ElasticsearchEndpointOutputSchemas.indicesSearchableSnapshotStats,
	},
	'search.count': {
		input: ElasticsearchEndpointInputSchemas.searchCount,
		output: ElasticsearchEndpointOutputSchemas.searchCount,
	},
	'search.msearch': {
		input: ElasticsearchEndpointInputSchemas.searchMsearch,
		output: ElasticsearchEndpointOutputSchemas.searchMsearch,
	},
	'search.msearchTemplate': {
		input: ElasticsearchEndpointInputSchemas.searchMsearchTemplate,
		output: ElasticsearchEndpointOutputSchemas.searchMsearchTemplate,
	},
	'search.template': {
		input: ElasticsearchEndpointInputSchemas.searchTemplate,
		output: ElasticsearchEndpointOutputSchemas.searchTemplate,
	},
	'search.termsEnum': {
		input: ElasticsearchEndpointInputSchemas.searchTermsEnum,
		output: ElasticsearchEndpointOutputSchemas.searchTermsEnum,
	},
	'search.fieldCaps': {
		input: ElasticsearchEndpointInputSchemas.searchFieldCaps,
		output: ElasticsearchEndpointOutputSchemas.searchFieldCaps,
	},
	'search.shards': {
		input: ElasticsearchEndpointInputSchemas.searchShards,
		output: ElasticsearchEndpointOutputSchemas.searchShards,
	},
	'search.openPointInTime': {
		input: ElasticsearchEndpointInputSchemas.searchOpenPointInTime,
		output: ElasticsearchEndpointOutputSchemas.searchOpenPointInTime,
	},
	'search.rankEval': {
		input: ElasticsearchEndpointInputSchemas.searchRankEval,
		output: ElasticsearchEndpointOutputSchemas.searchRankEval,
	},
	'search.vectorTile': {
		input: ElasticsearchEndpointInputSchemas.searchVectorTile,
		output: ElasticsearchEndpointOutputSchemas.searchVectorTile,
	},
	'search.eql': {
		input: ElasticsearchEndpointInputSchemas.searchEql,
		output: ElasticsearchEndpointOutputSchemas.searchEql,
	},
	'search.asyncSubmit': {
		input: ElasticsearchEndpointInputSchemas.searchAsyncSubmit,
		output: ElasticsearchEndpointOutputSchemas.searchAsyncSubmit,
	},
	'search.graphExplore': {
		input: ElasticsearchEndpointInputSchemas.searchGraphExplore,
		output: ElasticsearchEndpointOutputSchemas.searchGraphExplore,
	},
	'search.validateQuery': {
		input: ElasticsearchEndpointInputSchemas.searchValidateQuery,
		output: ElasticsearchEndpointOutputSchemas.searchValidateQuery,
	},
	'fleet.search': {
		input: ElasticsearchEndpointInputSchemas.fleetSearch,
		output: ElasticsearchEndpointOutputSchemas.fleetSearch,
	},
	'fleet.msearch': {
		input: ElasticsearchEndpointInputSchemas.fleetMsearch,
		output: ElasticsearchEndpointOutputSchemas.fleetMsearch,
	},
	'fleet.globalCheckpoints': {
		input: ElasticsearchEndpointInputSchemas.fleetGlobalCheckpoints,
		output: ElasticsearchEndpointOutputSchemas.fleetGlobalCheckpoints,
	},
	'ccr.follow': {
		input: ElasticsearchEndpointInputSchemas.ccrFollow,
		output: ElasticsearchEndpointOutputSchemas.ccrFollow,
	},
	'ccr.followInfo': {
		input: ElasticsearchEndpointInputSchemas.ccrFollowInfo,
		output: ElasticsearchEndpointOutputSchemas.ccrFollowInfo,
	},
	'ccr.followStats': {
		input: ElasticsearchEndpointInputSchemas.ccrFollowStats,
		output: ElasticsearchEndpointOutputSchemas.ccrFollowStats,
	},
	'ccr.forgetFollower': {
		input: ElasticsearchEndpointInputSchemas.ccrForgetFollower,
		output: ElasticsearchEndpointOutputSchemas.ccrForgetFollower,
	},
	'ccr.pauseFollow': {
		input: ElasticsearchEndpointInputSchemas.ccrPauseFollow,
		output: ElasticsearchEndpointOutputSchemas.ccrPauseFollow,
	},
	'ccr.resumeFollow': {
		input: ElasticsearchEndpointInputSchemas.ccrResumeFollow,
		output: ElasticsearchEndpointOutputSchemas.ccrResumeFollow,
	},
	'ccr.unfollow': {
		input: ElasticsearchEndpointInputSchemas.ccrUnfollow,
		output: ElasticsearchEndpointOutputSchemas.ccrUnfollow,
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
	'indices.create': {
		riskLevel: 'write',
		description:
			'Create an index (PUT /{index}) with optional mappings, aliases, settings and shard-readiness wait',
	},
	'indices.exists': {
		riskLevel: 'read',
		description:
			'Check whether an index or data stream exists (HEAD): resolves to { exists: boolean } instead of throwing on 404',
	},
	'indices.delete': {
		riskLevel: 'destructive',
		description:
			'Delete one or more indices and all their data (alias names are not valid targets)',
	},
	'indices.open': {
		riskLevel: 'write',
		description: 'Open a closed index so searches and indexing resume on it',
	},
	'indices.close': {
		riskLevel: 'write',
		description:
			'Close an index: blocks searches and writes while keeping its data on disk',
	},
	'indices.addBlock': {
		riskLevel: 'write',
		description:
			'Add an index block (metadata, read, read_only or write) limiting what operations the index accepts',
	},
	'indices.removeBlock': {
		riskLevel: 'write',
		description:
			'Remove a previously added index block (metadata, read, read_only or write)',
	},
	'indices.getMapping': {
		riskLevel: 'read',
		description:
			'Get mapping definitions for one or more indices or data streams, keyed by index name',
	},
	'indices.putMapping': {
		riskLevel: 'write',
		description:
			'Add or update field mappings on existing indices (new fields only; existing fields cannot change type)',
	},
	'indices.getFieldMapping': {
		riskLevel: 'read',
		description:
			'Get mapping definitions for specific fields (comma-separated list or wildcards) across indices',
	},
	'indices.getSettings': {
		riskLevel: 'read',
		description:
			'Get index settings by name or wildcard, keyed by index name, optionally including defaults',
	},
	'indices.putSettings': {
		riskLevel: 'write',
		description:
			'Update index settings (PUT /{index}/_settings), optionally preserving existing values or reopening closed indices',
	},
	'indices.getAlias': {
		riskLevel: 'read',
		description:
			'Get the aliases attached to indices, keyed by index name; a missing alias answers 404',
	},
	'indices.existsAlias': {
		riskLevel: 'read',
		description:
			'Check whether an alias exists on a target (HEAD): resolves to { exists: boolean }',
	},
	'indices.putAlias': {
		riskLevel: 'write',
		description:
			'Create or update an alias on indices with optional filter query, routing and write-index designation',
	},
	'indices.deleteAlias': {
		riskLevel: 'destructive',
		description:
			'Delete aliases from indices (comma-separated names or wildcards); producers writing through the alias lose their target',
	},
	'indices.rollover': {
		riskLevel: 'write',
		description:
			'Roll an alias or data stream over to a new index when conditions (max_age, max_size, max_docs...) are met, with dry-run support',
	},
	'indices.clone': {
		riskLevel: 'write',
		description:
			'Clone an index into a new index with the same settings, mappings and aliases (source must be read-only)',
	},
	'indices.split': {
		riskLevel: 'write',
		description:
			'Split an index into a new index with more primary shards (split count must be a multiple of the source)',
	},
	'indices.shrink': {
		riskLevel: 'write',
		description:
			'Shrink an index into a new index with fewer primary shards (factor of the source count)',
	},
	'indices.downsample': {
		riskLevel: 'write',
		description:
			'Downsample a time series index into a coarser fixed-interval index (aggregate or last-value sampling)',
	},
	'indices.analyze': {
		riskLevel: 'read',
		description:
			'Run text analysis with an index analyzer or field and get the resulting tokens back with offsets and positions',
	},
	'indices.stats': {
		riskLevel: 'read',
		description:
			'Get index statistics for chosen metrics (store, indexing, search, merge, segments, docs...), aggregated at cluster, index or shard level',
	},
	'indices.segments': {
		riskLevel: 'read',
		description:
			'Get low-level Lucene segment information per shard of the target indices',
	},
	'indices.recovery': {
		riskLevel: 'read',
		description:
			'View shard recovery status for indices (replication, recovery from snapshot, relocation), keyed by index name',
	},
	'indices.shardStores': {
		riskLevel: 'read',
		description:
			'Get information about shard stores (copy status, allocation, flush stats) filtered by health status',
	},
	'indices.refresh': {
		riskLevel: 'write',
		description:
			'Refresh indices (GET /{index}/_refresh) so pending indexed documents become searchable immediately',
	},
	'indices.flush': {
		riskLevel: 'write',
		description:
			'Flush indices (GET /{index}/_flush) to persist in-memory transaction-log entries to storage',
	},
	'indices.forceMerge': {
		riskLevel: 'write',
		description:
			'Force a Lucene segment merge on indices, optionally to a target segment count; resource-heavy on large indices',
	},
	'indices.cacheClear': {
		riskLevel: 'write',
		description:
			'Clear index caches (fielddata, query, request, or specific fields) for the target indices',
	},
	'indices.reloadSearchAnalyzers': {
		riskLevel: 'write',
		description:
			'Reload search analyzers on indices whose analyzer resources changed (for example after a synonym file update)',
	},
	'indices.diskUsage': {
		riskLevel: 'read',
		description:
			'Analyze disk usage per field of an index; requires the explicit run_expensive_tasks: true opt-in because the analysis is resource-intensive',
	},
	'indices.fieldUsageStats': {
		riskLevel: 'read',
		description:
			'Get field usage statistics (how often each field was read by searches) for the target indices',
	},
	'indices.deprecations': {
		riskLevel: 'read',
		description:
			'Get deprecation warnings about the target index configuration that the next major Elasticsearch upgrade will remove',
	},
	'indices.explainDataLifecycle': {
		riskLevel: 'read',
		description:
			'Get the data stream lifecycle management status for the target indices, keyed by index name',
	},
	'indices.ilmExplain': {
		riskLevel: 'read',
		description:
			'Get the Index Lifecycle Management state for the target indices, including the current step and any failures',
	},
	'indices.ilmRemove': {
		riskLevel: 'write',
		description:
			'Remove the ILM policy association from an index; lifecycle management stops managing it',
	},
	'indices.ilmRetry': {
		riskLevel: 'write',
		description:
			'Retry a failed Index Lifecycle Management step for the target indices',
	},
	'indices.clearSearchableSnapshotCache': {
		riskLevel: 'write',
		description:
			'Clear the searchable snapshots shared cache for fully-mounted indices',
	},
	'indices.searchableSnapshotStats': {
		riskLevel: 'read',
		description:
			'Get searchable snapshot statistics (cache usage, IO) for mounted indices at cluster, index or shard level',
	},
	'search.count': {
		riskLevel: 'read',
		description:
			'Count documents matching a typed query (or every document) across indices, data streams and aliases without fetching hits',
	},
	'search.msearch': {
		riskLevel: 'read',
		description:
			'Run multiple searches in one request from typed sub-searches (query/from/size) or raw NDJSON; each response item carries its own error',
	},
	'search.msearchTemplate': {
		riskLevel: 'read',
		description:
			'Run multiple templated searches in one request, each using a stored template id and params',
	},
	'search.template': {
		riskLevel: 'read',
		description:
			'Run a search with a stored template id or an inline mustache source plus params; same response shape as search.run',
	},
	'search.termsEnum': {
		riskLevel: 'read',
		description:
			'Enumerate terms in a field that match a string prefix, for autocomplete-style lookups',
	},
	'search.fieldCaps': {
		riskLevel: 'read',
		description:
			'Get field capabilities (types, searchable, aggregatable, per-index overrides) across indices',
	},
	'search.shards': {
		riskLevel: 'read',
		description:
			'Get the shards a search would execute on: node list, shard routing copies and index names',
	},
	'search.openPointInTime': {
		riskLevel: 'write',
		description:
			'Open a point in time (PIT) over indices with a keep-alive; the returned id pins a consistent view and holds cluster resources',
	},
	'search.rankEval': {
		riskLevel: 'read',
		description:
			'Evaluate ranked search results against rated documents with a metric (precision, recall, DCG...) and get per-request details',
	},
	'search.vectorTile': {
		riskLevel: 'read',
		description:
			'Search a geospatial field as a Mapbox vector tile for a zoom/x/y grid; returns the protobuf tile base64-encoded',
	},
	'search.eql': {
		riskLevel: 'read',
		description:
			'Run an Event Query Language search (event and sequence matching) over log/event indices',
	},
	'search.asyncSubmit': {
		riskLevel: 'read',
		description:
			'Submit an async search: returns partial results immediately with an id for polling while the search keeps running',
	},
	'search.graphExplore': {
		riskLevel: 'read',
		description:
			'Explore graph analytics: find vertices and connections between terms that co-occur in documents',
	},
	'search.validateQuery': {
		riskLevel: 'read',
		description:
			'Validate a typed query (or Lucene q string) without running it, with optional per-shard explanations',
	},
	'fleet.search': {
		riskLevel: 'read',
		description:
			'Run a Fleet search on one index or alias, optionally waiting for global checkpoints before executing',
	},
	'fleet.msearch': {
		riskLevel: 'read',
		description:
			'Run multiple Fleet searches in one request with optional checkpoint waits; each item carries its own error',
	},
	'fleet.globalCheckpoints': {
		riskLevel: 'read',
		description:
			'Get the global checkpoints of an index, optionally waiting for them to advance past given values',
	},
	'ccr.follow': {
		riskLevel: 'write',
		description:
			'Create a follower index that replicates a leader index from a remote cluster (cross-cluster replication)',
	},
	'ccr.followInfo': {
		riskLevel: 'read',
		description:
			'Get follower information (leader index, remote cluster, status) for follower index patterns',
	},
	'ccr.followStats': {
		riskLevel: 'read',
		description:
			'Get cross-cluster replication statistics (shard-level following stats) for follower indices',
	},
	'ccr.forgetFollower': {
		riskLevel: 'write',
		description:
			'Remove a follower retention lease from a leader index by follower identifiers, letting its data be trimmed',
	},
	'ccr.pauseFollow': {
		riskLevel: 'write',
		description:
			'Pause replication of a follower index; the leader stops streaming operations until resumed',
	},
	'ccr.resumeFollow': {
		riskLevel: 'write',
		description: 'Resume replication on a paused follower index',
	},
	'ccr.unfollow': {
		riskLevel: 'write',
		description:
			'Convert a follower index into a regular index, detaching it from its leader for good',
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
