import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Files, Integrations, Models, Predictions } from './endpoints';
import type {
	NanonetsEndpointInputs,
	NanonetsEndpointOutputs,
} from './endpoints/types';
import {
	NanonetsEndpointInputSchemas,
	NanonetsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { NanonetsSchema } from './schema';

export type NanonetsPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalNanonetsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof nanonetsEndpointsNested>;
};

export type NanonetsContext = CorsairPluginContext<
	typeof NanonetsSchema,
	NanonetsPluginOptions
>;

export type NanonetsKeyBuilderContext =
	KeyBuilderContext<NanonetsPluginOptions>;

export type NanonetsBoundEndpoints = BindEndpoints<
	typeof nanonetsEndpointsNested
>;

type NanonetsEndpoint<K extends keyof NanonetsEndpointOutputs> =
	CorsairEndpoint<
		NanonetsContext,
		NanonetsEndpointInputs[K],
		NanonetsEndpointOutputs[K]
	>;

export type NanonetsEndpoints = {
	predictionsCreateFromFile: NanonetsEndpoint<'predictionsCreateFromFile'>;
	predictionsCreateFromUrls: NanonetsEndpoint<'predictionsCreateFromUrls'>;
	predictionsListFiles: NanonetsEndpoint<'predictionsListFiles'>;
	predictionsGetFileByPageId: NanonetsEndpoint<'predictionsGetFileByPageId'>;
	predictionsGetFileByFileId: NanonetsEndpoint<'predictionsGetFileByFileId'>;
	modelsUploadTrainingUrls: NanonetsEndpoint<'modelsUploadTrainingUrls'>;
	modelsTrain: NanonetsEndpoint<'modelsTrain'>;
	modelsUpdateGuidelines: NanonetsEndpoint<'modelsUpdateGuidelines'>;
	filesApprove: NanonetsEndpoint<'filesApprove'>;
	filesUnapprove: NanonetsEndpoint<'filesUnapprove'>;
	filesDelete: NanonetsEndpoint<'filesDelete'>;
	filesUpdateFields: NanonetsEndpoint<'filesUpdateFields'>;
	filesAssign: NanonetsEndpoint<'filesAssign'>;
	filesRetryExports: NanonetsEndpoint<'filesRetryExports'>;
	filesRetryPredictions: NanonetsEndpoint<'filesRetryPredictions'>;
	integrationsList: NanonetsEndpoint<'integrationsList'>;
	integrationsExecuteQuery: NanonetsEndpoint<'integrationsExecuteQuery'>;
};

const nanonetsEndpointsNested = {
	predictions: {
		createFromFile: Predictions.createFromFile,
		createFromUrls: Predictions.createFromUrls,
		listFiles: Predictions.listFiles,
		getFileByPageId: Predictions.getFileByPageId,
		getFileByFileId: Predictions.getFileByFileId,
	},
	models: {
		uploadTrainingUrls: Models.uploadTrainingUrls,
		train: Models.train,
		updateGuidelines: Models.updateGuidelines,
	},
	files: {
		approve: Files.approve,
		unapprove: Files.unapprove,
		delete: Files.delete,
		updateFields: Files.updateFields,
		assign: Files.assign,
		retryExports: Files.retryExports,
		retryPredictions: Files.retryPredictions,
	},
	integrations: {
		list: Integrations.list,
		executeQuery: Integrations.executeQuery,
	},
} as const;

export const nanonetsEndpointSchemas = {
	'predictions.createFromFile': {
		input: NanonetsEndpointInputSchemas.predictionsCreateFromFile,
		output: NanonetsEndpointOutputSchemas.predictionsCreateFromFile,
	},
	'predictions.createFromUrls': {
		input: NanonetsEndpointInputSchemas.predictionsCreateFromUrls,
		output: NanonetsEndpointOutputSchemas.predictionsCreateFromUrls,
	},
	'predictions.listFiles': {
		input: NanonetsEndpointInputSchemas.predictionsListFiles,
		output: NanonetsEndpointOutputSchemas.predictionsListFiles,
	},
	'predictions.getFileByPageId': {
		input: NanonetsEndpointInputSchemas.predictionsGetFileByPageId,
		output: NanonetsEndpointOutputSchemas.predictionsGetFileByPageId,
	},
	'predictions.getFileByFileId': {
		input: NanonetsEndpointInputSchemas.predictionsGetFileByFileId,
		output: NanonetsEndpointOutputSchemas.predictionsGetFileByFileId,
	},
	'models.uploadTrainingUrls': {
		input: NanonetsEndpointInputSchemas.modelsUploadTrainingUrls,
		output: NanonetsEndpointOutputSchemas.modelsUploadTrainingUrls,
	},
	'models.train': {
		input: NanonetsEndpointInputSchemas.modelsTrain,
		output: NanonetsEndpointOutputSchemas.modelsTrain,
	},
	'models.updateGuidelines': {
		input: NanonetsEndpointInputSchemas.modelsUpdateGuidelines,
		output: NanonetsEndpointOutputSchemas.modelsUpdateGuidelines,
	},
	'files.approve': {
		input: NanonetsEndpointInputSchemas.filesApprove,
		output: NanonetsEndpointOutputSchemas.filesApprove,
	},
	'files.unapprove': {
		input: NanonetsEndpointInputSchemas.filesUnapprove,
		output: NanonetsEndpointOutputSchemas.filesUnapprove,
	},
	'files.delete': {
		input: NanonetsEndpointInputSchemas.filesDelete,
		output: NanonetsEndpointOutputSchemas.filesDelete,
	},
	'files.updateFields': {
		input: NanonetsEndpointInputSchemas.filesUpdateFields,
		output: NanonetsEndpointOutputSchemas.filesUpdateFields,
	},
	'files.assign': {
		input: NanonetsEndpointInputSchemas.filesAssign,
		output: NanonetsEndpointOutputSchemas.filesAssign,
	},
	'files.retryExports': {
		input: NanonetsEndpointInputSchemas.filesRetryExports,
		output: NanonetsEndpointOutputSchemas.filesRetryExports,
	},
	'files.retryPredictions': {
		input: NanonetsEndpointInputSchemas.filesRetryPredictions,
		output: NanonetsEndpointOutputSchemas.filesRetryPredictions,
	},
	'integrations.list': {
		input: NanonetsEndpointInputSchemas.integrationsList,
		output: NanonetsEndpointOutputSchemas.integrationsList,
	},
	'integrations.executeQuery': {
		input: NanonetsEndpointInputSchemas.integrationsExecuteQuery,
		output: NanonetsEndpointOutputSchemas.integrationsExecuteQuery,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof nanonetsEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const nanonetsEndpointMeta = {
	'predictions.createFromFile': {
		riskLevel: 'write',
		description:
			'Upload a base64 PNG or JPEG to an OCR model and extract fields synchronously or, with async, as a pollable request',
	},
	'predictions.createFromUrls': {
		riskLevel: 'write',
		description:
			'Extract fields from public image URLs with an OCR model, synchronously or as a pollable async request',
	},
	'predictions.listFiles': {
		riskLevel: 'read',
		description:
			'List a model prediction files in a day-since-epoch window, split into moderated and unmoderated',
	},
	'predictions.getFileByPageId': {
		riskLevel: 'read',
		description: 'Fetch one prediction page with its boxes and raw OCR output',
	},
	'predictions.getFileByFileId': {
		riskLevel: 'read',
		description:
			'Fetch a whole prediction file by request file ID, the poll target for async requests',
	},
	'models.uploadTrainingUrls': {
		riskLevel: 'write',
		description:
			'Add training images to a model by URL, with optional box annotations, before (re)training',
	},
	'models.train': {
		riskLevel: 'write',
		description:
			'Train or retrain a model from its uploaded images; the model state moves through the training queue',
	},
	'models.updateGuidelines': {
		riskLevel: 'write',
		description:
			'Add or update the natural-language field and table extraction guidelines of an Instant Learning model',
	},
	'files.approve': {
		riskLevel: 'write',
		description:
			'Approve a validated file from an approval stage, which can trigger exports',
	},
	'files.unapprove': {
		riskLevel: 'write',
		description:
			'Reopen a previously approved file; it cannot be rejected here',
	},
	'files.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a file and its predictions from a model',
	},
	'files.updateFields': {
		riskLevel: 'write',
		description:
			'Replace the field set of one page of a file: unchanged boxes stay, new boxes need is_new, and any omitted field is deleted',
	},
	'files.assign': {
		riskLevel: 'write',
		description: 'Assign files to a team member by email for review',
	},
	'files.retryExports': {
		riskLevel: 'write',
		description: 'Re-run the export integrations for the given files',
	},
	'files.retryPredictions': {
		riskLevel: 'write',
		description: 'Re-run OCR prediction for the given files',
	},
	'integrations.list': {
		riskLevel: 'read',
		description:
			'List external integrations with their IDs, types and masked connection info',
	},
	'integrations.executeQuery': {
		riskLevel: 'destructive',
		description:
			'Run arbitrary SQL against a connected store; documented examples include UPDATE, which cannot be undone',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof nanonetsEndpointsNested>;

export type BaseNanonetsPlugin<T extends NanonetsPluginOptions> = CorsairPlugin<
	'nanonets',
	typeof NanonetsSchema,
	typeof nanonetsEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalNanonetsPlugin = BaseNanonetsPlugin<NanonetsPluginOptions>;

export type ExternalNanonetsPlugin<T extends NanonetsPluginOptions> =
	BaseNanonetsPlugin<T>;

export function nanonets<const T extends NanonetsPluginOptions>(
	incomingOptions: NanonetsPluginOptions & T = {} as NanonetsPluginOptions & T,
): ExternalNanonetsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'nanonets',
		schema: NanonetsSchema,
		options: options,
		hooks: options.hooks,
		endpoints: nanonetsEndpointsNested,
		webhooks: {},
		endpointMeta: nanonetsEndpointMeta,
		endpointSchemas: nanonetsEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: NanonetsKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('nanonets', ctx.authType ?? 'api_key');
		},
	} satisfies InternalNanonetsPlugin;
}

export { NanonetsAPIError } from './client';

export type {
	FilesApproveInput,
	FilesApproveResponse,
	FilesAssignInput,
	FilesAssignResponse,
	FilesDeleteInput,
	FilesDeleteResponse,
	FilesRetryExportsInput,
	FilesRetryExportsResponse,
	FilesRetryPredictionsInput,
	FilesRetryPredictionsResponse,
	FilesUnapproveInput,
	FilesUnapproveResponse,
	FilesUpdateFieldsInput,
	FilesUpdateFieldsResponse,
	IntegrationsExecuteQueryInput,
	IntegrationsExecuteQueryResponse,
	IntegrationsListInput,
	IntegrationsListResponse,
	ModelsTrainInput,
	ModelsTrainResponse,
	ModelsUpdateGuidelinesInput,
	ModelsUpdateGuidelinesResponse,
	ModelsUploadTrainingUrlsInput,
	ModelsUploadTrainingUrlsResponse,
	NanonetsBox,
	NanonetsEndpointInputs,
	NanonetsEndpointOutputs,
	NanonetsIntegration,
	NanonetsPredictionPage,
	PredictionsCreateFromFileInput,
	PredictionsCreateFromFileResponse,
	PredictionsCreateFromUrlsInput,
	PredictionsCreateFromUrlsResponse,
	PredictionsGetFileByFileIdInput,
	PredictionsGetFileByFileIdResponse,
	PredictionsGetFileByPageIdInput,
	PredictionsGetFileByPageIdResponse,
	PredictionsListFilesInput,
	PredictionsListFilesResponse,
} from './endpoints/types';
