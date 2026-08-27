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
import {
	Backups,
	BulkImports,
	Collections,
	Indexes,
	Inference,
	Namespaces,
	Records,
	RestoreJobs,
	Vectors,
} from './endpoints';
import type {
	PineconeEndpointInputs,
	PineconeEndpointOutputs,
} from './endpoints/types';
import {
	PineconeEndpointInputSchemas,
	PineconeEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { PineconeSchema } from './schema';

export type PineconePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalPineconePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof pineconeEndpointsNested>;
};

export type PineconeContext = CorsairPluginContext<
	typeof PineconeSchema,
	PineconePluginOptions
>;

export type PineconeKeyBuilderContext =
	KeyBuilderContext<PineconePluginOptions>;
export type PineconeBoundEndpoints = BindEndpoints<
	typeof pineconeEndpointsNested
>;

type PineconeEndpoint<K extends keyof PineconeEndpointOutputs> =
	CorsairEndpoint<
		PineconeContext,
		PineconeEndpointInputs[K],
		PineconeEndpointOutputs[K]
	>;

export type PineconeEndpoints = {
	createIndex: PineconeEndpoint<'createIndex'>;
	createIndexForModel: PineconeEndpoint<'createIndexForModel'>;
	listIndexes: PineconeEndpoint<'listIndexes'>;
	describeIndex: PineconeEndpoint<'describeIndex'>;
	configureIndex: PineconeEndpoint<'configureIndex'>;
	deleteIndex: PineconeEndpoint<'deleteIndex'>;
	createBackup: PineconeEndpoint<'createBackup'>;
	listIndexBackups: PineconeEndpoint<'listIndexBackups'>;
	listCollections: PineconeEndpoint<'listCollections'>;
	listProjectBackups: PineconeEndpoint<'listProjectBackups'>;
	describeBackup: PineconeEndpoint<'describeBackup'>;
	deleteBackup: PineconeEndpoint<'deleteBackup'>;
	createIndexFromBackup: PineconeEndpoint<'createIndexFromBackup'>;
	listRestoreJobs: PineconeEndpoint<'listRestoreJobs'>;
	describeRestoreJob: PineconeEndpoint<'describeRestoreJob'>;
	embed: PineconeEndpoint<'embed'>;
	rerank: PineconeEndpoint<'rerank'>;
	listModels: PineconeEndpoint<'listModels'>;
	getModel: PineconeEndpoint<'getModel'>;
	upsertVectors: PineconeEndpoint<'upsertVectors'>;
	queryVectors: PineconeEndpoint<'queryVectors'>;
	fetchVectors: PineconeEndpoint<'fetchVectors'>;
	updateVector: PineconeEndpoint<'updateVector'>;
	deleteVectors: PineconeEndpoint<'deleteVectors'>;
	listVectors: PineconeEndpoint<'listVectors'>;
	describeIndexStats: PineconeEndpoint<'describeIndexStats'>;
	listNamespaces: PineconeEndpoint<'listNamespaces'>;
	createNamespace: PineconeEndpoint<'createNamespace'>;
	describeNamespace: PineconeEndpoint<'describeNamespace'>;
	deleteNamespace: PineconeEndpoint<'deleteNamespace'>;
	listBulkImports: PineconeEndpoint<'listBulkImports'>;
	startBulkImport: PineconeEndpoint<'startBulkImport'>;
	describeBulkImport: PineconeEndpoint<'describeBulkImport'>;
	cancelBulkImport: PineconeEndpoint<'cancelBulkImport'>;
	upsertRecords: PineconeEndpoint<'upsertRecords'>;
	searchRecords: PineconeEndpoint<'searchRecords'>;
};

const pineconeEndpointsNested = {
	indexes: Indexes,
	backups: Backups,
	restoreJobs: RestoreJobs,
	collections: Collections,
	inference: Inference,
	vectors: Vectors,
	namespaces: Namespaces,
	bulkImports: BulkImports,
	records: Records,
} as const;

const pineconeWebhooksNested = {} as const;

export const pineconeEndpointSchemas = {
	'indexes.create': {
		input: PineconeEndpointInputSchemas.createIndex,
		output: PineconeEndpointOutputSchemas.createIndex,
	},
	'indexes.createForModel': {
		input: PineconeEndpointInputSchemas.createIndexForModel,
		output: PineconeEndpointOutputSchemas.createIndexForModel,
	},
	'indexes.list': {
		input: PineconeEndpointInputSchemas.listIndexes,
		output: PineconeEndpointOutputSchemas.listIndexes,
	},
	'indexes.describe': {
		input: PineconeEndpointInputSchemas.describeIndex,
		output: PineconeEndpointOutputSchemas.describeIndex,
	},
	'indexes.configure': {
		input: PineconeEndpointInputSchemas.configureIndex,
		output: PineconeEndpointOutputSchemas.configureIndex,
	},
	'indexes.delete': {
		input: PineconeEndpointInputSchemas.deleteIndex,
		output: PineconeEndpointOutputSchemas.deleteIndex,
	},
	'backups.create': {
		input: PineconeEndpointInputSchemas.createBackup,
		output: PineconeEndpointOutputSchemas.createBackup,
	},
	'backups.listForIndex': {
		input: PineconeEndpointInputSchemas.listIndexBackups,
		output: PineconeEndpointOutputSchemas.listIndexBackups,
	},
	'backups.listForProject': {
		input: PineconeEndpointInputSchemas.listProjectBackups,
		output: PineconeEndpointOutputSchemas.listProjectBackups,
	},
	'backups.describe': {
		input: PineconeEndpointInputSchemas.describeBackup,
		output: PineconeEndpointOutputSchemas.describeBackup,
	},
	'backups.delete': {
		input: PineconeEndpointInputSchemas.deleteBackup,
		output: PineconeEndpointOutputSchemas.deleteBackup,
	},
	'backups.createIndex': {
		input: PineconeEndpointInputSchemas.createIndexFromBackup,
		output: PineconeEndpointOutputSchemas.createIndexFromBackup,
	},
	'restoreJobs.list': {
		input: PineconeEndpointInputSchemas.listRestoreJobs,
		output: PineconeEndpointOutputSchemas.listRestoreJobs,
	},
	'restoreJobs.describe': {
		input: PineconeEndpointInputSchemas.describeRestoreJob,
		output: PineconeEndpointOutputSchemas.describeRestoreJob,
	},
	'collections.list': {
		input: PineconeEndpointInputSchemas.listCollections,
		output: PineconeEndpointOutputSchemas.listCollections,
	},
	'inference.embed': {
		input: PineconeEndpointInputSchemas.embed,
		output: PineconeEndpointOutputSchemas.embed,
	},
	'inference.rerank': {
		input: PineconeEndpointInputSchemas.rerank,
		output: PineconeEndpointOutputSchemas.rerank,
	},
	'inference.listModels': {
		input: PineconeEndpointInputSchemas.listModels,
		output: PineconeEndpointOutputSchemas.listModels,
	},
	'inference.getModel': {
		input: PineconeEndpointInputSchemas.getModel,
		output: PineconeEndpointOutputSchemas.getModel,
	},
	'vectors.upsert': {
		input: PineconeEndpointInputSchemas.upsertVectors,
		output: PineconeEndpointOutputSchemas.upsertVectors,
	},
	'vectors.query': {
		input: PineconeEndpointInputSchemas.queryVectors,
		output: PineconeEndpointOutputSchemas.queryVectors,
	},
	'vectors.fetch': {
		input: PineconeEndpointInputSchemas.fetchVectors,
		output: PineconeEndpointOutputSchemas.fetchVectors,
	},
	'vectors.update': {
		input: PineconeEndpointInputSchemas.updateVector,
		output: PineconeEndpointOutputSchemas.updateVector,
	},
	'vectors.delete': {
		input: PineconeEndpointInputSchemas.deleteVectors,
		output: PineconeEndpointOutputSchemas.deleteVectors,
	},
	'vectors.list': {
		input: PineconeEndpointInputSchemas.listVectors,
		output: PineconeEndpointOutputSchemas.listVectors,
	},
	'vectors.describeIndexStats': {
		input: PineconeEndpointInputSchemas.describeIndexStats,
		output: PineconeEndpointOutputSchemas.describeIndexStats,
	},
	'namespaces.list': {
		input: PineconeEndpointInputSchemas.listNamespaces,
		output: PineconeEndpointOutputSchemas.listNamespaces,
	},
	'namespaces.create': {
		input: PineconeEndpointInputSchemas.createNamespace,
		output: PineconeEndpointOutputSchemas.createNamespace,
	},
	'namespaces.describe': {
		input: PineconeEndpointInputSchemas.describeNamespace,
		output: PineconeEndpointOutputSchemas.describeNamespace,
	},
	'namespaces.delete': {
		input: PineconeEndpointInputSchemas.deleteNamespace,
		output: PineconeEndpointOutputSchemas.deleteNamespace,
	},
	'bulkImports.list': {
		input: PineconeEndpointInputSchemas.listBulkImports,
		output: PineconeEndpointOutputSchemas.listBulkImports,
	},
	'bulkImports.start': {
		input: PineconeEndpointInputSchemas.startBulkImport,
		output: PineconeEndpointOutputSchemas.startBulkImport,
	},
	'bulkImports.describe': {
		input: PineconeEndpointInputSchemas.describeBulkImport,
		output: PineconeEndpointOutputSchemas.describeBulkImport,
	},
	'bulkImports.cancel': {
		input: PineconeEndpointInputSchemas.cancelBulkImport,
		output: PineconeEndpointOutputSchemas.cancelBulkImport,
	},
	'records.upsert': {
		input: PineconeEndpointInputSchemas.upsertRecords,
		output: PineconeEndpointOutputSchemas.upsertRecords,
	},
	'records.search': {
		input: PineconeEndpointInputSchemas.searchRecords,
		output: PineconeEndpointOutputSchemas.searchRecords,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof pineconeEndpointsNested
>;

const pineconeEndpointMeta = {
	'indexes.create': {
		riskLevel: 'write',
		description: 'Create a serverless Pinecone vector index.',
	},
	'indexes.createForModel': {
		riskLevel: 'write',
		description: 'Create an integrated-embedding index for a hosted model.',
	},
	'indexes.list': {
		riskLevel: 'read',
		description: 'List all Pinecone indexes available to the project.',
	},
	'indexes.describe': {
		riskLevel: 'read',
		description:
			'Describe an index, including its data-plane host and readiness.',
	},
	'indexes.configure': {
		riskLevel: 'write',
		description: 'Update index configuration, tags, or deletion protection.',
	},
	'indexes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a Pinecone index and its vector data.',
	},
	'backups.create': {
		riskLevel: 'write',
		description: 'Create a restorable backup of an existing Pinecone index.',
	},
	'backups.listForIndex': {
		riskLevel: 'read',
		description: 'List paginated backups created from one index.',
	},
	'backups.listForProject': {
		riskLevel: 'read',
		description: 'List paginated backups across the current Pinecone project.',
	},
	'backups.describe': {
		riskLevel: 'read',
		description: 'Describe backup status, source, size, and creation details.',
	},
	'backups.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a Pinecone index backup.',
	},
	'backups.createIndex': {
		riskLevel: 'write',
		description: 'Start restoring a backup into a new Pinecone index.',
	},
	'restoreJobs.list': {
		riskLevel: 'read',
		description: 'List paginated backup restore jobs for the project.',
	},
	'restoreJobs.describe': {
		riskLevel: 'read',
		description: 'Describe progress and status for a backup restore job.',
	},
	'collections.list': {
		riskLevel: 'read',
		description: 'List legacy Pinecone collections visible to the project.',
	},
	'inference.embed': {
		riskLevel: 'read',
		description:
			'Generate dense or sparse vectors with a hosted embedding model.',
	},
	'inference.rerank': {
		riskLevel: 'read',
		description:
			'Rerank documents against a query using a hosted reranking model.',
	},
	'inference.listModels': {
		riskLevel: 'read',
		description:
			'List hosted embedding and reranking models with optional filters.',
	},
	'inference.getModel': {
		riskLevel: 'read',
		description:
			'Describe capabilities and limits for one hosted inference model.',
	},
	'vectors.upsert': {
		riskLevel: 'write',
		description: 'Insert or replace a batch of vectors in an index namespace.',
	},
	'vectors.query': {
		riskLevel: 'read',
		description: 'Find the vectors most similar to an ID or query vector.',
	},
	'vectors.fetch': {
		riskLevel: 'read',
		description: 'Fetch vectors and metadata by their record identifiers.',
	},
	'vectors.update': {
		riskLevel: 'write',
		description: 'Update vector values or metadata for one existing record.',
	},
	'vectors.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete selected vectors or an entire namespace.',
	},
	'vectors.list': {
		riskLevel: 'read',
		description:
			'List paginated vector identifiers with optional prefix filtering.',
	},
	'vectors.describeIndexStats': {
		riskLevel: 'read',
		description:
			'Return index dimension, fullness, and per-namespace record counts.',
	},
	'namespaces.list': {
		riskLevel: 'read',
		description: 'List paginated namespaces in lexical order.',
	},
	'namespaces.create': {
		riskLevel: 'write',
		description: 'Create an empty namespace in a Pinecone index.',
	},
	'namespaces.describe': {
		riskLevel: 'read',
		description: 'Describe one namespace and its current record count.',
	},
	'namespaces.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a namespace and every record it contains.',
	},
	'bulkImports.list': {
		riskLevel: 'read',
		description: 'List paginated bulk-import jobs for an index.',
	},
	'bulkImports.start': {
		riskLevel: 'write',
		description:
			'Start importing vector data from object storage into an index.',
	},
	'bulkImports.describe': {
		riskLevel: 'read',
		description: 'Describe progress and errors for one bulk-import job.',
	},
	'bulkImports.cancel': {
		riskLevel: 'write',
		description: 'Cancel a running Pinecone bulk-import job.',
	},
	'records.upsert': {
		riskLevel: 'write',
		description:
			'Upsert text records as newline-delimited JSON for integrated embedding.',
	},
	'records.search': {
		riskLevel: 'read',
		description:
			'Search integrated records by text, vector, ID, or metadata filter.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof pineconeEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key';

export const pineconeAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasePineconePlugin<T extends PineconePluginOptions> = CorsairPlugin<
	'pinecone',
	typeof PineconeSchema,
	typeof pineconeEndpointsNested,
	typeof pineconeWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalPineconePlugin = BasePineconePlugin<PineconePluginOptions>;
export type ExternalPineconePlugin<T extends PineconePluginOptions> =
	BasePineconePlugin<T>;

export function pinecone<const T extends PineconePluginOptions>(
	incomingOptions: PineconePluginOptions & T = {} as PineconePluginOptions & T,
): ExternalPineconePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'pinecone',
		authConfig: pineconeAuthConfig,
		schema: PineconeSchema,
		options,
		hooks: options.hooks,
		endpoints: pineconeEndpointsNested,
		webhooks: pineconeWebhooksNested,
		endpointMeta: pineconeEndpointMeta,
		endpointSchemas: pineconeEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: PineconeKeyBuilderContext, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('pinecone', 'api_key');
			}
			if (options.key) return options.key;
			const key = await ctx.keys?.get_api_key();
			if (!key) throw new AuthMissingError('pinecone', 'api_key');
			return key;
		},
	} satisfies InternalPineconePlugin;
}

export type {
	CreateIndexInput,
	EmbeddingsResponse,
	EmbedInput,
	IndexModel,
	PineconeEndpointInputs,
	PineconeEndpointOutputs,
	RerankInput,
	RerankResponse,
} from './endpoints/types';
