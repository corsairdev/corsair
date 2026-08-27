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
	Collections,
	Indexes,
	Inference,
	RestoreJobs,
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
};

const pineconeEndpointsNested = {
	indexes: Indexes,
	backups: Backups,
	restoreJobs: RestoreJobs,
	collections: Collections,
	inference: Inference,
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
