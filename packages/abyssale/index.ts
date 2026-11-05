import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Auth, Designs, Fonts, Generation, Projects } from './endpoints';
import type {
	AbyssaleEndpointInputs,
	AbyssaleEndpointOutputs,
} from './endpoints/types';
import {
	AbyssaleEndpointInputSchemas,
	AbyssaleEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AbyssaleSchema } from './schema';
import type {
	AbyssaleWebhookOutputs,
	NewBannerBatchEvent,
	NewBannerEvent,
	NewExportEvent,
	TemplateStatusEvent,
} from './webhooks';
import {
	BannerWebhooks,
	DesignWebhooks,
	ExportWebhooks,
	matchAbyssalePluginWebhook,
	NewBannerBatchEventSchema,
	NewBannerEventSchema,
	NewExportEventSchema,
	TemplateStatusEventSchema,
} from './webhooks';

export type AbyssalePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalAbyssalePlugin['hooks'];
	webhookHooks?: InternalAbyssalePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof abyssaleEndpointsNested>;
};

export type AbyssaleContext = CorsairPluginContext<
	typeof AbyssaleSchema,
	AbyssalePluginOptions
>;

export type AbyssaleKeyBuilderContext =
	KeyBuilderContext<AbyssalePluginOptions>;

export type AbyssaleBoundEndpoints = BindEndpoints<
	typeof abyssaleEndpointsNested
>;

type AbyssaleEndpoint<K extends keyof AbyssaleEndpointOutputs> =
	CorsairEndpoint<
		AbyssaleContext,
		AbyssaleEndpointInputs[K],
		AbyssaleEndpointOutputs[K]
	>;

export type AbyssaleEndpoints = {
	createProject: AbyssaleEndpoint<'createProject'>;
	getDesigns: AbyssaleEndpoint<'getDesigns'>;
	getFonts: AbyssaleEndpoint<'getFonts'>;
	testAuth: AbyssaleEndpoint<'testAuth'>;
	generateImage: AbyssaleEndpoint<'generateImage'>;
	generateBatch: AbyssaleEndpoint<'generateBatch'>;
	getGenerationRequest: AbyssaleEndpoint<'getGenerationRequest'>;
};

type AbyssaleWebhook<
	K extends keyof AbyssaleWebhookOutputs,
	TEvent,
> = CorsairWebhook<AbyssaleContext, TEvent, AbyssaleWebhookOutputs[K]>;

export type AbyssaleWebhooks = {
	newBanner: AbyssaleWebhook<'newBanner', NewBannerEvent>;
	newBannerBatch: AbyssaleWebhook<'newBannerBatch', NewBannerBatchEvent>;
	newExport: AbyssaleWebhook<'newExport', NewExportEvent>;
	templateStatus: AbyssaleWebhook<'templateStatus', TemplateStatusEvent>;
};

const abyssaleEndpointsNested = {
	projects: {
		create: Projects.createProject,
	},
	designs: {
		list: Designs.getDesigns,
	},
	fonts: {
		list: Fonts.getFonts,
	},
	auth: {
		test: Auth.testAuth,
	},
	generation: {
		image: Generation.generateImage,
		batch: Generation.generateBatch,
		status: Generation.getGenerationRequest,
	},
} as const;

const abyssaleWebhooksNested = {
	banners: {
		created: BannerWebhooks.created,
		batchCompleted: BannerWebhooks.batchCompleted,
	},
	exports: {
		completed: ExportWebhooks.completed,
	},
	designs: {
		statusChanged: DesignWebhooks.statusChanged,
	},
} as const;

export const abyssaleEndpointSchemas = {
	'projects.create': {
		input: AbyssaleEndpointInputSchemas.createProject,
		output: AbyssaleEndpointOutputSchemas.createProject,
	},
	'designs.list': {
		input: AbyssaleEndpointInputSchemas.getDesigns,
		output: AbyssaleEndpointOutputSchemas.getDesigns,
	},
	'fonts.list': {
		input: AbyssaleEndpointInputSchemas.getFonts,
		output: AbyssaleEndpointOutputSchemas.getFonts,
	},
	'auth.test': {
		input: AbyssaleEndpointInputSchemas.testAuth,
		output: AbyssaleEndpointOutputSchemas.testAuth,
	},
	'generation.image': {
		input: AbyssaleEndpointInputSchemas.generateImage,
		output: AbyssaleEndpointOutputSchemas.generateImage,
	},
	'generation.batch': {
		input: AbyssaleEndpointInputSchemas.generateBatch,
		output: AbyssaleEndpointOutputSchemas.generateBatch,
	},
	'generation.status': {
		input: AbyssaleEndpointInputSchemas.getGenerationRequest,
		output: AbyssaleEndpointOutputSchemas.getGenerationRequest,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof abyssaleEndpointsNested
>;

export type AbyssaleBoundWebhooks = BindWebhooks<typeof abyssaleWebhooksNested>;

const abyssaleWebhookSchemas = {
	'banners.created': {
		description:
			'A visual was generated or saved in Abyssale (NEW_BANNER event)',
		payload: NewBannerEventSchema,
		response: NewBannerEventSchema,
	},
	'banners.batchCompleted': {
		description:
			'An asynchronous batch generation request completed (NEW_BANNER_BATCH event)',
		payload: NewBannerBatchEventSchema,
		response: NewBannerBatchEventSchema,
	},
	'exports.completed': {
		description:
			'A workspace export archive finished processing (NEW_EXPORT event)',
		payload: NewExportEventSchema,
		response: NewExportEventSchema,
	},
	'designs.statusChanged': {
		description:
			"A design's workflow status was updated (TEMPLATE_STATUS event)",
		payload: TemplateStatusEventSchema,
		response: TemplateStatusEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof abyssaleWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const abyssaleEndpointMeta = {
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a new project in Abyssale',
	},
	'designs.list': {
		riskLevel: 'read',
		description: 'Get a list of designs in Abyssale',
	},
	'fonts.list': {
		riskLevel: 'read',
		description: 'Get a list of available fonts in Abyssale',
	},
	'auth.test': {
		riskLevel: 'read',
		description: 'Test Abyssale API key authentication validity',
	},
	'generation.image': {
		riskLevel: 'write',
		description:
			'Synchronously generate a single image from an Abyssale design',
	},
	'generation.batch': {
		riskLevel: 'write',
		description:
			'Start an asynchronous multi-format generation from an Abyssale design',
	},
	'generation.status': {
		riskLevel: 'read',
		description: 'Poll the status of an asynchronous generation request',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof abyssaleEndpointsNested>;

export const abyssaleAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseAbyssalePlugin<T extends AbyssalePluginOptions> = CorsairPlugin<
	'abyssale',
	typeof AbyssaleSchema,
	typeof abyssaleEndpointsNested,
	typeof abyssaleWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAbyssalePlugin = BaseAbyssalePlugin<AbyssalePluginOptions>;

export type ExternalAbyssalePlugin<T extends AbyssalePluginOptions> =
	BaseAbyssalePlugin<T>;

export function abyssale<const T extends AbyssalePluginOptions>(
	incomingOptions: AbyssalePluginOptions & T = {} as AbyssalePluginOptions & T,
): ExternalAbyssalePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'abyssale',
		authConfig: abyssaleAuthConfig,
		schema: AbyssaleSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: abyssaleEndpointsNested,
		webhooks: abyssaleWebhooksNested,
		endpointMeta: abyssaleEndpointMeta,
		endpointSchemas: abyssaleEndpointSchemas,
		webhookSchemas: abyssaleWebhookSchemas,
		pluginWebhookMatcher: matchAbyssalePluginWebhook,
		pluginTenantWebhookMatcher: undefined,
		oauthWebhookTenantLinkResolver: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AbyssaleKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('abyssale', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('abyssale', 'api_key');
		},
	} satisfies InternalAbyssalePlugin;
}

export type {
	AbyssaleEndpointInputs,
	AbyssaleEndpointOutputs,
	CreateProjectInput,
	CreateProjectResponse,
	GenerateBatchInput,
	GenerateBatchResponse,
	GenerateImageInput,
	GenerateImageResponse,
	GetDesignsInput,
	GetDesignsResponse,
	GetFontsInput,
	GetFontsResponse,
	GetGenerationRequestInput,
	GetGenerationRequestResponse,
	TestAuthInput,
	TestAuthResponse,
} from './endpoints/types';
export type {
	AbyssaleWebhookOutputs,
	NewBannerBatchEvent,
	NewBannerEvent,
	NewExportEvent,
	TemplateStatusEvent,
} from './webhooks/types';
