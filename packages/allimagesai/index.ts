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
	ApiKeys,
	Credits,
	ImageGenerations,
	Images,
	Webhooks,
} from './endpoints';
import type {
	AllimagesaiEndpointInputs,
	AllimagesaiEndpointOutputs,
} from './endpoints/types';
import {
	AllimagesaiEndpointInputSchemas,
	AllimagesaiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AllimagesaiSchema } from './schema';

export type AllimagesaiPluginOptions = {
	// All-Images.ai issues personal access tokens only; there is no OAuth flow.
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAllimagesaiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof allimagesaiEndpointsNested>;
};

export type AllimagesaiContext = CorsairPluginContext<
	typeof AllimagesaiSchema,
	AllimagesaiPluginOptions
>;

export type AllimagesaiKeyBuilderContext =
	KeyBuilderContext<AllimagesaiPluginOptions>;

export type AllimagesaiBoundEndpoints = BindEndpoints<
	typeof allimagesaiEndpointsNested
>;

type AllimagesaiEndpoint<K extends keyof AllimagesaiEndpointOutputs> =
	CorsairEndpoint<
		AllimagesaiContext,
		AllimagesaiEndpointInputs[K],
		AllimagesaiEndpointOutputs[K]
	>;

export type AllimagesaiEndpoints = {
	apiKeysCheck: AllimagesaiEndpoint<'apiKeysCheck'>;
	creditsGet: AllimagesaiEndpoint<'creditsGet'>;
	webhooksCreate: AllimagesaiEndpoint<'webhooksCreate'>;
	webhooksGet: AllimagesaiEndpoint<'webhooksGet'>;
	imageGenerationsList: AllimagesaiEndpoint<'imageGenerationsList'>;
	imageGenerationsDelete: AllimagesaiEndpoint<'imageGenerationsDelete'>;
	imagesListDownloaded: AllimagesaiEndpoint<'imagesListDownloaded'>;
};

const allimagesaiEndpointsNested = {
	apiKeys: {
		check: ApiKeys.check,
	},
	credits: {
		get: Credits.get,
	},
	webhooks: {
		create: Webhooks.create,
		get: Webhooks.get,
	},
	imageGenerations: {
		list: ImageGenerations.list,
		delete: ImageGenerations.delete,
	},
	images: {
		listDownloaded: Images.listDownloaded,
	},
} as const;

const allimagesaiWebhooksNested = {} as const;

export const allimagesaiEndpointSchemas = {
	'apiKeys.check': {
		input: AllimagesaiEndpointInputSchemas.apiKeysCheck,
		output: AllimagesaiEndpointOutputSchemas.apiKeysCheck,
	},
	'credits.get': {
		input: AllimagesaiEndpointInputSchemas.creditsGet,
		output: AllimagesaiEndpointOutputSchemas.creditsGet,
	},
	'webhooks.create': {
		input: AllimagesaiEndpointInputSchemas.webhooksCreate,
		output: AllimagesaiEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.get': {
		input: AllimagesaiEndpointInputSchemas.webhooksGet,
		output: AllimagesaiEndpointOutputSchemas.webhooksGet,
	},
	'imageGenerations.list': {
		input: AllimagesaiEndpointInputSchemas.imageGenerationsList,
		output: AllimagesaiEndpointOutputSchemas.imageGenerationsList,
	},
	'imageGenerations.delete': {
		input: AllimagesaiEndpointInputSchemas.imageGenerationsDelete,
		output: AllimagesaiEndpointOutputSchemas.imageGenerationsDelete,
	},
	'images.listDownloaded': {
		input: AllimagesaiEndpointInputSchemas.imagesListDownloaded,
		output: AllimagesaiEndpointOutputSchemas.imagesListDownloaded,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof allimagesaiEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const allimagesaiEndpointMeta = {
	'apiKeys.check': {
		riskLevel: 'read',
		description:
			'Validate the configured API key and return the email address and optional name of the account it belongs to.',
	},
	'credits.get': {
		riskLevel: 'read',
		description:
			'Return the remaining and total credits for each quota bucket on the account.',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Register a webhook endpoint on the API key to receive print lifecycle callbacks. Defaults to print.failed and print.completed.',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description:
			'Retrieve a registered webhook by its id, returning its URL. The provider does not return the subscribed event list.',
	},
	'imageGenerations.list': {
		riskLevel: 'read',
		description:
			'List image generation batches created for bulk use, filterable by name and tag. Paginated with limit and offset.',
	},
	'imageGenerations.delete': {
		riskLevel: 'destructive',
		description:
			'Permanently delete one or more image generation batches by their print ids.',
	},
	'images.listDownloaded': {
		riskLevel: 'read',
		description:
			'List images previously downloaded on this account, optionally filtered by download date. Paginated with limit and offset.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof allimagesaiEndpointsNested
>;

export const allimagesaiAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAllimagesaiPlugin<T extends AllimagesaiPluginOptions> =
	CorsairPlugin<
		'allimagesai',
		typeof AllimagesaiSchema,
		typeof allimagesaiEndpointsNested,
		typeof allimagesaiWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalAllimagesaiPlugin =
	BaseAllimagesaiPlugin<AllimagesaiPluginOptions>;

export type ExternalAllimagesaiPlugin<T extends AllimagesaiPluginOptions> =
	BaseAllimagesaiPlugin<T>;

export function allimagesai<const T extends AllimagesaiPluginOptions>(
	incomingOptions: AllimagesaiPluginOptions &
		T = {} as AllimagesaiPluginOptions & T,
): ExternalAllimagesaiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'allimagesai',
		authConfig: allimagesaiAuthConfig,
		schema: AllimagesaiSchema,
		options: options,
		hooks: options.hooks,
		endpoints: allimagesaiEndpointsNested,
		endpointMeta: allimagesaiEndpointMeta,
		endpointSchemas: allimagesaiEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AllimagesaiKeyBuilderContext, source) => {
			// Fail closed. Returning an empty string here would send an empty
			// `api-key` header, which the provider answers with a generic 401
			// instead of Corsair surfacing its disconnected-auth flow.
			if (source !== 'endpoint') {
				throw new AuthMissingError('allimagesai', 'api_key');
			}

			if (options.key) return options.key;

			const res = await ctx.keys?.get_api_key();
			if (!res) {
				throw new AuthMissingError('allimagesai', 'api_key');
			}

			return res;
		},
	} satisfies InternalAllimagesaiPlugin;
}

export type {
	AllImagesAiCredit,
	AllImagesAiDownloadedImage,
	AllImagesAiPrint,
	AllImagesAiWebhookEvent,
	AllimagesaiEndpointInputs,
	AllimagesaiEndpointOutputs,
	ApiKeyCheckInput,
	ApiKeyCheckResponse,
	CreditsGetInput,
	CreditsGetResponse,
	DownloadedImagesListInput,
	DownloadedImagesListResponse,
	ImageGenerationsDeleteInput,
	ImageGenerationsDeleteResponse,
	ImageGenerationsListInput,
	ImageGenerationsListResponse,
	WebhookCreateInput,
	WebhookCreateResponse,
	WebhookGetInput,
	WebhookGetResponse,
} from './endpoints/types';
