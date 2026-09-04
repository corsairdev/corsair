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
	Account,
	Collections,
	Deployments,
	Files,
	Hardware,
	Models,
	Predictions,
	Search,
	Trainings,
	Webhooks,
} from './endpoints';
import type {
	ReplicateEndpointInputs,
	ReplicateEndpointOutputs,
} from './endpoints/types';
import {
	ReplicateEndpointInputSchemas,
	ReplicateEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ReplicateSchema } from './schema';

const replicateEndpointsNested = {
	account: {
		get: Account.get,
	},
	collections: {
		list: Collections.list,
		get: Collections.get,
	},
	deployments: {
		list: Deployments.list,
		create: Deployments.create,
		delete: Deployments.delete,
		get: Deployments.get,
		predictionsCreate: Deployments.predictionsCreate,
	},
	files: {
		list: Files.list,
		create: Files.create,
		delete: Files.delete,
		get: Files.get,
	},
	hardware: {
		list: Hardware.list,
	},
	models: {
		list: Models.list,
		get: Models.get,
		update: Models.update,
		examplesList: Models.examplesList,
		predictionsCreate: Models.predictionsCreate,
		readmeGet: Models.readmeGet,
		versionsGet: Models.versionsGet,
		versionsList: Models.versionsList,
	},
	predictions: {
		list: Predictions.list,
		create: Predictions.create,
		get: Predictions.get,
		cancel: Predictions.cancel,
	},
	search: {
		search: Search.search,
	},
	trainings: {
		create: Trainings.create,
		get: Trainings.get,
		list: Trainings.list,
		cancel: Trainings.cancel,
	},
	webhooks: {
		defaultSecretGet: Webhooks.defaultSecretGet,
	},
} as const;

const replicateWebhooksNested = {} as const;

export type ReplicatePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalReplicatePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof replicateEndpointsNested>;
};

export type ReplicateContext = CorsairPluginContext<
	typeof ReplicateSchema,
	ReplicatePluginOptions
>;

export type ReplicateKeyBuilderContext =
	KeyBuilderContext<ReplicatePluginOptions>;

export type ReplicateBoundEndpoints = BindEndpoints<
	typeof replicateEndpointsNested
>;

type ReplicateEndpoint<K extends keyof ReplicateEndpointOutputs> =
	CorsairEndpoint<
		ReplicateContext,
		ReplicateEndpointInputs[K],
		ReplicateEndpointOutputs[K]
	>;

export type ReplicateEndpoints = {
	accountGet: ReplicateEndpoint<'accountGet'>;
	collectionsList: ReplicateEndpoint<'collectionsList'>;
	collectionsGet: ReplicateEndpoint<'collectionsGet'>;
	deploymentsList: ReplicateEndpoint<'deploymentsList'>;
	deploymentsCreate: ReplicateEndpoint<'deploymentsCreate'>;
	deploymentsDelete: ReplicateEndpoint<'deploymentsDelete'>;
	deploymentsGet: ReplicateEndpoint<'deploymentsGet'>;
	deploymentsPredictionsCreate: ReplicateEndpoint<'deploymentsPredictionsCreate'>;
	filesList: ReplicateEndpoint<'filesList'>;
	filesCreate: ReplicateEndpoint<'filesCreate'>;
	filesDelete: ReplicateEndpoint<'filesDelete'>;
	filesGet: ReplicateEndpoint<'filesGet'>;
	hardwareList: ReplicateEndpoint<'hardwareList'>;
	modelsList: ReplicateEndpoint<'modelsList'>;
	modelsGet: ReplicateEndpoint<'modelsGet'>;
	modelsUpdate: ReplicateEndpoint<'modelsUpdate'>;
	modelsExamplesList: ReplicateEndpoint<'modelsExamplesList'>;
	modelsPredictionsCreate: ReplicateEndpoint<'modelsPredictionsCreate'>;
	modelsReadmeGet: ReplicateEndpoint<'modelsReadmeGet'>;
	modelsVersionsGet: ReplicateEndpoint<'modelsVersionsGet'>;
	modelsVersionsList: ReplicateEndpoint<'modelsVersionsList'>;
	predictionsList: ReplicateEndpoint<'predictionsList'>;
	predictionsCreate: ReplicateEndpoint<'predictionsCreate'>;
	predictionsGet: ReplicateEndpoint<'predictionsGet'>;
	predictionsCancel: ReplicateEndpoint<'predictionsCancel'>;
	search: ReplicateEndpoint<'search'>;
	trainingsCreate: ReplicateEndpoint<'trainingsCreate'>;
	trainingsGet: ReplicateEndpoint<'trainingsGet'>;
	trainingsList: ReplicateEndpoint<'trainingsList'>;
	trainingsCancel: ReplicateEndpoint<'trainingsCancel'>;
	webhooksDefaultSecretGet: ReplicateEndpoint<'webhooksDefaultSecretGet'>;
};

export const replicateEndpointSchemas = {
	'account.get': {
		input: ReplicateEndpointInputSchemas.accountGet,
		output: ReplicateEndpointOutputSchemas.accountGet,
	},
	'collections.list': {
		input: ReplicateEndpointInputSchemas.collectionsList,
		output: ReplicateEndpointOutputSchemas.collectionsList,
	},
	'collections.get': {
		input: ReplicateEndpointInputSchemas.collectionsGet,
		output: ReplicateEndpointOutputSchemas.collectionsGet,
	},
	'deployments.list': {
		input: ReplicateEndpointInputSchemas.deploymentsList,
		output: ReplicateEndpointOutputSchemas.deploymentsList,
	},
	'deployments.create': {
		input: ReplicateEndpointInputSchemas.deploymentsCreate,
		output: ReplicateEndpointOutputSchemas.deploymentsCreate,
	},
	'deployments.delete': {
		input: ReplicateEndpointInputSchemas.deploymentsDelete,
		output: ReplicateEndpointOutputSchemas.deploymentsDelete,
	},
	'deployments.get': {
		input: ReplicateEndpointInputSchemas.deploymentsGet,
		output: ReplicateEndpointOutputSchemas.deploymentsGet,
	},
	'deployments.predictionsCreate': {
		input: ReplicateEndpointInputSchemas.deploymentsPredictionsCreate,
		output: ReplicateEndpointOutputSchemas.deploymentsPredictionsCreate,
	},
	'files.list': {
		input: ReplicateEndpointInputSchemas.filesList,
		output: ReplicateEndpointOutputSchemas.filesList,
	},
	'files.create': {
		input: ReplicateEndpointInputSchemas.filesCreate,
		output: ReplicateEndpointOutputSchemas.filesCreate,
	},
	'files.delete': {
		input: ReplicateEndpointInputSchemas.filesDelete,
		output: ReplicateEndpointOutputSchemas.filesDelete,
	},
	'files.get': {
		input: ReplicateEndpointInputSchemas.filesGet,
		output: ReplicateEndpointOutputSchemas.filesGet,
	},
	'hardware.list': {
		input: ReplicateEndpointInputSchemas.hardwareList,
		output: ReplicateEndpointOutputSchemas.hardwareList,
	},
	'models.list': {
		input: ReplicateEndpointInputSchemas.modelsList,
		output: ReplicateEndpointOutputSchemas.modelsList,
	},
	'models.get': {
		input: ReplicateEndpointInputSchemas.modelsGet,
		output: ReplicateEndpointOutputSchemas.modelsGet,
	},
	'models.update': {
		input: ReplicateEndpointInputSchemas.modelsUpdate,
		output: ReplicateEndpointOutputSchemas.modelsUpdate,
	},
	'models.examplesList': {
		input: ReplicateEndpointInputSchemas.modelsExamplesList,
		output: ReplicateEndpointOutputSchemas.modelsExamplesList,
	},
	'models.predictionsCreate': {
		input: ReplicateEndpointInputSchemas.modelsPredictionsCreate,
		output: ReplicateEndpointOutputSchemas.modelsPredictionsCreate,
	},
	'models.readmeGet': {
		input: ReplicateEndpointInputSchemas.modelsReadmeGet,
		output: ReplicateEndpointOutputSchemas.modelsReadmeGet,
	},
	'models.versionsGet': {
		input: ReplicateEndpointInputSchemas.modelsVersionsGet,
		output: ReplicateEndpointOutputSchemas.modelsVersionsGet,
	},
	'models.versionsList': {
		input: ReplicateEndpointInputSchemas.modelsVersionsList,
		output: ReplicateEndpointOutputSchemas.modelsVersionsList,
	},
	'predictions.list': {
		input: ReplicateEndpointInputSchemas.predictionsList,
		output: ReplicateEndpointOutputSchemas.predictionsList,
	},
	'predictions.create': {
		input: ReplicateEndpointInputSchemas.predictionsCreate,
		output: ReplicateEndpointOutputSchemas.predictionsCreate,
	},
	'predictions.get': {
		input: ReplicateEndpointInputSchemas.predictionsGet,
		output: ReplicateEndpointOutputSchemas.predictionsGet,
	},
	'predictions.cancel': {
		input: ReplicateEndpointInputSchemas.predictionsCancel,
		output: ReplicateEndpointOutputSchemas.predictionsCancel,
	},
	'search.search': {
		input: ReplicateEndpointInputSchemas.search,
		output: ReplicateEndpointOutputSchemas.search,
	},
	'trainings.create': {
		input: ReplicateEndpointInputSchemas.trainingsCreate,
		output: ReplicateEndpointOutputSchemas.trainingsCreate,
	},
	'trainings.get': {
		input: ReplicateEndpointInputSchemas.trainingsGet,
		output: ReplicateEndpointOutputSchemas.trainingsGet,
	},
	'trainings.list': {
		input: ReplicateEndpointInputSchemas.trainingsList,
		output: ReplicateEndpointOutputSchemas.trainingsList,
	},
	'trainings.cancel': {
		input: ReplicateEndpointInputSchemas.trainingsCancel,
		output: ReplicateEndpointOutputSchemas.trainingsCancel,
	},
	'webhooks.defaultSecretGet': {
		input: ReplicateEndpointInputSchemas.webhooksDefaultSecretGet,
		output: ReplicateEndpointOutputSchemas.webhooksDefaultSecretGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof replicateEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const replicateEndpointMeta = {
	'account.get': {
		riskLevel: 'read',
		description: 'Get authenticated account information',
	},
	'collections.list': {
		riskLevel: 'read',
		description: 'List model collections',
	},
	'collections.get': {
		riskLevel: 'read',
		description: 'Get model collection details by slug',
	},
	'deployments.list': {
		riskLevel: 'read',
		description: 'List deployments',
	},
	'deployments.create': {
		riskLevel: 'write',
		description: 'Create a deployment',
	},
	'deployments.delete': {
		riskLevel: 'destructive',
		description: 'Delete a deployment',
	},
	'deployments.get': {
		riskLevel: 'read',
		description: 'Get deployment details',
	},
	'deployments.predictionsCreate': {
		riskLevel: 'write',
		description: 'Create a prediction from deployment',
	},
	'files.list': {
		riskLevel: 'read',
		description: 'List uploaded files',
	},
	'files.create': {
		riskLevel: 'write',
		description: 'Upload a file',
	},
	'files.delete': {
		riskLevel: 'destructive',
		description: 'Delete a file',
	},
	'files.get': {
		riskLevel: 'read',
		description: 'Get file details',
	},
	'hardware.list': {
		riskLevel: 'read',
		description: 'List available hardware SKUs',
	},
	'models.list': {
		riskLevel: 'read',
		description: 'List public models',
	},
	'models.get': {
		riskLevel: 'read',
		description: 'Get model details',
	},
	'models.update': {
		riskLevel: 'write',
		description: 'Update model metadata',
	},
	'models.examplesList': {
		riskLevel: 'read',
		description: 'List model examples',
	},
	'models.predictionsCreate': {
		riskLevel: 'write',
		description: 'Create official model prediction',
	},
	'models.readmeGet': {
		riskLevel: 'read',
		description: 'Get model README',
	},
	'models.versionsGet': {
		riskLevel: 'read',
		description: 'Get model version',
	},
	'models.versionsList': {
		riskLevel: 'read',
		description: 'List model versions',
	},
	'predictions.list': {
		riskLevel: 'read',
		description: 'List predictions',
	},
	'predictions.create': {
		riskLevel: 'write',
		description: 'Create prediction by version',
	},
	'predictions.get': {
		riskLevel: 'read',
		description: 'Get prediction status',
	},
	'predictions.cancel': {
		riskLevel: 'write',
		description: 'Cancel prediction',
	},
	'search.search': {
		riskLevel: 'read',
		description: 'Search models, collections, and docs',
	},
	'trainings.create': {
		riskLevel: 'write',
		description: 'Create training job',
	},
	'trainings.get': {
		riskLevel: 'read',
		description: 'Get training job details',
	},
	'trainings.list': {
		riskLevel: 'read',
		description: 'List training jobs',
	},
	'trainings.cancel': {
		riskLevel: 'write',
		description: 'Cancel training job',
	},
	'webhooks.defaultSecretGet': {
		riskLevel: 'read',
		description: 'Get default webhook signing secret',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof replicateEndpointsNested
>;

export const replicateAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseReplicatePlugin<T extends ReplicatePluginOptions> =
	CorsairPlugin<
		'replicate',
		typeof ReplicateSchema,
		typeof replicateEndpointsNested,
		typeof replicateWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalReplicatePlugin =
	BaseReplicatePlugin<ReplicatePluginOptions>;

export type ExternalReplicatePlugin<T extends ReplicatePluginOptions> =
	BaseReplicatePlugin<T>;

export function replicate<const T extends ReplicatePluginOptions>(
	incomingOptions: ReplicatePluginOptions & T = {} as ReplicatePluginOptions &
		T,
): ExternalReplicatePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'replicate',
		authConfig: replicateAuthConfig,
		schema: ReplicateSchema,
		options,
		hooks: options.hooks,
		endpoints: replicateEndpointsNested,
		webhooks: replicateWebhooksNested,
		endpointMeta: replicateEndpointMeta,
		endpointSchemas: replicateEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ReplicateKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) {
					throw new AuthMissingError('replicate', 'api_key');
				}
				return key;
			}

			throw new AuthMissingError('replicate', 'api_key');
		},
	} satisfies InternalReplicatePlugin;
}

export type {
	ReplicateEndpointInputs,
	ReplicateEndpointOutputs,
} from './endpoints/types';
