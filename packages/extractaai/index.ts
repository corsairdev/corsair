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
import { Classification, Credits, Extraction } from './endpoints';
import type {
	ExtractaaiEndpointInputs,
	ExtractaaiEndpointOutputs,
} from './endpoints/types';
import {
	ExtractaaiEndpointInputSchemas,
	ExtractaaiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ExtractaaiSchema } from './schema';

export type ExtractaaiPluginOptions = {
	/** Authentication method. Only api_key is supported. */
	authType?: PickAuth<'api_key'>;
	/** Optional: pass the API key directly (bypasses key manager) */
	key?: string;
	/** Optional: lifecycle hooks for endpoints */
	hooks?: InternalExtractaaiPlugin['hooks'];
	/** Optional: custom error handlers (merged with defaults) */
	errorHandlers?: CorsairErrorHandler;
	/** Permission configuration for the Extracta.ai plugin. */
	permissions?: PluginPermissionsConfig<typeof extractaaiEndpointsNested>;
};

export type ExtractaaiContext = CorsairPluginContext<
	typeof ExtractaaiSchema,
	ExtractaaiPluginOptions
>;

export type ExtractaaiKeyBuilderContext =
	KeyBuilderContext<ExtractaaiPluginOptions>;

export type ExtractaaiBoundEndpoints = BindEndpoints<
	typeof extractaaiEndpointsNested
>;

type ExtractaaiEndpoint<K extends keyof ExtractaaiEndpointOutputs> =
	CorsairEndpoint<
		ExtractaaiContext,
		ExtractaaiEndpointInputs[K],
		ExtractaaiEndpointOutputs[K]
	>;

export type ExtractaaiEndpoints = {
	extractionCreate: ExtractaaiEndpoint<'extractionCreate'>;
	extractionView: ExtractaaiEndpoint<'extractionView'>;
	extractionUpdate: ExtractaaiEndpoint<'extractionUpdate'>;
	extractionDelete: ExtractaaiEndpoint<'extractionDelete'>;
	extractionGetBatchResults: ExtractaaiEndpoint<'extractionGetBatchResults'>;
	creditsGet: ExtractaaiEndpoint<'creditsGet'>;
	classificationCreate: ExtractaaiEndpoint<'classificationCreate'>;
	classificationView: ExtractaaiEndpoint<'classificationView'>;
	classificationUpdate: ExtractaaiEndpoint<'classificationUpdate'>;
	classificationDelete: ExtractaaiEndpoint<'classificationDelete'>;
};

const extractaaiEndpointsNested = {
	extraction: {
		create: Extraction.create,
		view: Extraction.view,
		update: Extraction.update,
		delete: Extraction.delete,
		getBatchResults: Extraction.getBatchResults,
	},
	classification: {
		create: Classification.create,
		view: Classification.view,
		update: Classification.update,
		delete: Classification.delete,
	},
	credits: {
		get: Credits.get,
	},
};

export const extractaaiEndpointSchemas = {
	'extraction.create': {
		input: ExtractaaiEndpointInputSchemas.extractionCreate,
		output: ExtractaaiEndpointOutputSchemas.extractionCreate,
	},
	'extraction.view': {
		input: ExtractaaiEndpointInputSchemas.extractionView,
		output: ExtractaaiEndpointOutputSchemas.extractionView,
	},
	'extraction.update': {
		input: ExtractaaiEndpointInputSchemas.extractionUpdate,
		output: ExtractaaiEndpointOutputSchemas.extractionUpdate,
	},
	'extraction.delete': {
		input: ExtractaaiEndpointInputSchemas.extractionDelete,
		output: ExtractaaiEndpointOutputSchemas.extractionDelete,
	},
	'extraction.getBatchResults': {
		input: ExtractaaiEndpointInputSchemas.extractionGetBatchResults,
		output: ExtractaaiEndpointOutputSchemas.extractionGetBatchResults,
	},
	'credits.get': {
		input: ExtractaaiEndpointInputSchemas.creditsGet,
		output: ExtractaaiEndpointOutputSchemas.creditsGet,
	},
	'classification.create': {
		input: ExtractaaiEndpointInputSchemas.classificationCreate,
		output: ExtractaaiEndpointOutputSchemas.classificationCreate,
	},
	'classification.view': {
		input: ExtractaaiEndpointInputSchemas.classificationView,
		output: ExtractaaiEndpointOutputSchemas.classificationView,
	},
	'classification.update': {
		input: ExtractaaiEndpointInputSchemas.classificationUpdate,
		output: ExtractaaiEndpointOutputSchemas.classificationUpdate,
	},
	'classification.delete': {
		input: ExtractaaiEndpointInputSchemas.classificationDelete,
		output: ExtractaaiEndpointOutputSchemas.classificationDelete,
	},
} satisfies RequiredPluginEndpointSchemas<typeof extractaaiEndpointsNested>;

const defaultAuthType: PickAuth<'api_key'> = 'api_key';

const extractaaiEndpointMeta = {
	'extraction.create': {
		riskLevel: 'write',
		description:
			'Create a document extraction template (EXTRACTA_AI_CREATE_EXTRACTION)',
	},
	'extraction.view': {
		riskLevel: 'read',
		description:
			'View a document extraction configuration (EXTRACTA_AI_VIEW_EXTRACTION)',
	},
	'extraction.update': {
		riskLevel: 'write',
		description:
			'Update a document extraction configuration (EXTRACTA_AI_UPDATE_EXTRACTION)',
	},
	'extraction.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an extraction, batch, or file (EXTRACTA_AI_DELETE_EXTRACTION) [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'extraction.getBatchResults': {
		riskLevel: 'read',
		description:
			'Get extraction results for a batch (EXTRACTA_AI_GET_BATCH_RESULTS)',
	},
	'credits.get': {
		riskLevel: 'read',
		description: 'Get the account credit balance (EXTRACTA_AI_GET_CREDITS)',
	},
	'classification.create': {
		riskLevel: 'write',
		description:
			'Create a document classification (EXTRACTA_AI_CREATE_CLASSIFICATION)',
	},
	'classification.view': {
		riskLevel: 'read',
		description:
			'View a document classification configuration (EXTRACTA_AI_VIEW_CLASSIFICATION)',
	},
	'classification.update': {
		riskLevel: 'write',
		description:
			'Update a document classification (EXTRACTA_AI_UPDATE_CLASSIFICATION)',
	},
	'classification.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a document classification (EXTRACTA_AI_DELETE_CLASSIFICATION) [DESTRUCTIVE · IRREVERSIBLE]',
	},
} satisfies RequiredPluginEndpointMeta<typeof extractaaiEndpointsNested>;

export const extractaaiAuthConfig = {
	api_key: {
		account: [],
	},
} satisfies PluginAuthConfig;

export type BaseExtractaaiPlugin<T extends ExtractaaiPluginOptions> =
	CorsairPlugin<
		'extractaai',
		typeof ExtractaaiSchema,
		typeof extractaaiEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalExtractaaiPlugin =
	BaseExtractaaiPlugin<ExtractaaiPluginOptions>;

export type ExternalExtractaaiPlugin<T extends ExtractaaiPluginOptions> =
	BaseExtractaaiPlugin<T>;

// Overloads keep the factory generic over hook/permission options without
// needing a type assertion on the default parameter.
export function extractaai(): ExternalExtractaaiPlugin<ExtractaaiPluginOptions>;
export function extractaai<const T extends ExtractaaiPluginOptions>(
	incomingOptions: ExtractaaiPluginOptions & T,
): ExternalExtractaaiPlugin<T>;
export function extractaai(
	incomingOptions?: ExtractaaiPluginOptions,
): InternalExtractaaiPlugin {
	const options: ExtractaaiPluginOptions = {
		...incomingOptions,
		authType: incomingOptions?.authType ?? defaultAuthType,
	};
	return {
		id: 'extractaai',
		authConfig: extractaaiAuthConfig,
		schema: ExtractaaiSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: extractaaiEndpointsNested,
		webhooks: {},
		endpointMeta: extractaaiEndpointMeta,
		endpointSchemas: extractaaiEndpointSchemas,
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: () => null,
		oauthWebhookTenantLinkResolver: () => null,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ExtractaaiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key !== undefined) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('extractaai', 'api_key');
		},
	} satisfies InternalExtractaaiPlugin;
}

export type {
	CreateClassificationInput,
	CreateClassificationResponse,
	CreateExtractionInput,
	CreateExtractionResponse,
	DeleteClassificationInput,
	DeleteClassificationResponse,
	DeleteExtractionInput,
	DeleteExtractionResponse,
	DocumentType,
	ExtractaaiEndpointInputs,
	ExtractaaiEndpointOutputs,
	ExtractaJsonObject,
	ExtractaJsonValue,
	ExtractionField,
	ExtractionFieldItems,
	ExtractionOptions,
	GetBatchResultsInput,
	GetBatchResultsResponse,
	GetCreditsInput,
	GetCreditsResponse,
	UpdateClassificationInput,
	UpdateClassificationResponse,
	UpdateExtractionInput,
	UpdateExtractionResponse,
	ViewClassificationInput,
	ViewClassificationResponse,
	ViewExtractionInput,
	ViewExtractionResponse,
} from './endpoints/types';
