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
import { Account, Images } from './endpoints';
import type {
	AltTextAiEndpointInputs,
	AltTextAiEndpointOutputs,
} from './endpoints/types';
import {
	AltTextAiEndpointInputSchemas,
	AltTextAiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AltTextAiSchema } from './schema';

export type AltTextAiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAltTextAiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof alttextaiEndpointsNested>;
};

export type AltTextAiContext = CorsairPluginContext<
	typeof AltTextAiSchema,
	AltTextAiPluginOptions
>;

export type AltTextAiKeyBuilderContext =
	KeyBuilderContext<AltTextAiPluginOptions>;

export type AltTextAiBoundEndpoints = BindEndpoints<
	typeof alttextaiEndpointsNested
>;

type AltTextAiEndpoint<K extends keyof AltTextAiEndpointOutputs> =
	CorsairEndpoint<
		AltTextAiContext,
		AltTextAiEndpointInputs[K],
		AltTextAiEndpointOutputs[K]
	>;

export type AltTextAiEndpoints = {
	list: AltTextAiEndpoint<'list'>;
	create: AltTextAiEndpoint<'create'>;
	get: AltTextAiEndpoint<'get'>;
	update: AltTextAiEndpoint<'update'>;
	delete: AltTextAiEndpoint<'delete'>;
	search: AltTextAiEndpoint<'search'>;
	bulkCreate: AltTextAiEndpoint<'bulkCreate'>;
	pageScrape: AltTextAiEndpoint<'pageScrape'>;
	getAccount: AltTextAiEndpoint<'getAccount'>;
	updateAccount: AltTextAiEndpoint<'updateAccount'>;
};

const alttextaiEndpointsNested = {
	images: {
		list: Images.list,
		create: Images.create,
		get: Images.get,
		update: Images.update,
		delete: Images.deleteImage,
		search: Images.search,
		bulkCreate: Images.bulkCreate,
		pageScrape: Images.pageScrape,
	},
	account: {
		get: Account.get,
		update: Account.update,
	},
} as const;

const alttextaiWebhooksNested = {} as const;

export const alttextaiEndpointSchemas = {
	'images.list': {
		input: AltTextAiEndpointInputSchemas.list,
		output: AltTextAiEndpointOutputSchemas.list,
	},
	'images.create': {
		input: AltTextAiEndpointInputSchemas.create,
		output: AltTextAiEndpointOutputSchemas.create,
	},
	'images.get': {
		input: AltTextAiEndpointInputSchemas.get,
		output: AltTextAiEndpointOutputSchemas.get,
	},
	'images.update': {
		input: AltTextAiEndpointInputSchemas.update,
		output: AltTextAiEndpointOutputSchemas.update,
	},
	'images.delete': {
		input: AltTextAiEndpointInputSchemas.delete,
		output: AltTextAiEndpointOutputSchemas.delete,
	},
	'images.search': {
		input: AltTextAiEndpointInputSchemas.search,
		output: AltTextAiEndpointOutputSchemas.search,
	},
	'images.bulkCreate': {
		input: AltTextAiEndpointInputSchemas.bulkCreate,
		output: AltTextAiEndpointOutputSchemas.bulkCreate,
	},
	'images.pageScrape': {
		input: AltTextAiEndpointInputSchemas.pageScrape,
		output: AltTextAiEndpointOutputSchemas.pageScrape,
	},
	'account.get': {
		input: AltTextAiEndpointInputSchemas.getAccount,
		output: AltTextAiEndpointOutputSchemas.getAccount,
	},
	'account.update': {
		input: AltTextAiEndpointInputSchemas.updateAccount,
		output: AltTextAiEndpointOutputSchemas.updateAccount,
	},
} satisfies RequiredPluginEndpointSchemas<typeof alttextaiEndpointsNested>;

const alttextaiEndpointMeta = {
	'images.list': {
		riskLevel: 'read',
		description: 'List images in the AltText.ai library with pagination',
	},
	'images.create': {
		riskLevel: 'write',
		description:
			'Add an image and generate AI alt text from URL or base64 data',
	},
	'images.get': {
		riskLevel: 'read',
		description: 'Retrieve image metadata and alt text by asset ID',
	},
	'images.update': {
		riskLevel: 'write',
		description: 'Update alt text or metadata for an existing image',
	},
	'images.delete': {
		riskLevel: 'destructive',
		description: 'Delete an image from the AltText.ai library',
	},
	'images.search': {
		riskLevel: 'read',
		description: 'Search images by alt text, asset ID, or URL substring',
	},
	'images.bulkCreate': {
		riskLevel: 'write',
		description: 'Upload a CSV of image URLs for batch alt text generation',
	},
	'images.pageScrape': {
		riskLevel: 'write',
		description: 'Scrape a web page and queue alt text for all images found',
	},
	'account.get': {
		riskLevel: 'read',
		description: 'Get AltText.ai account settings and usage',
	},
	'account.update': {
		riskLevel: 'write',
		description: 'Update AltText.ai account settings',
	},
} satisfies RequiredPluginEndpointMeta<typeof alttextaiEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const alttextaiAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseAltTextAiPlugin<T extends AltTextAiPluginOptions> =
	CorsairPlugin<
		'alttextai',
		typeof AltTextAiSchema,
		typeof alttextaiEndpointsNested,
		typeof alttextaiWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalAltTextAiPlugin =
	BaseAltTextAiPlugin<AltTextAiPluginOptions>;

export type ExternalAltTextAiPlugin<T extends AltTextAiPluginOptions> =
	BaseAltTextAiPlugin<T>;

export function alttextai<const T extends AltTextAiPluginOptions>(
	incomingOptions: AltTextAiPluginOptions & T = {} as AltTextAiPluginOptions &
		T,
): ExternalAltTextAiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'alttextai',
		authConfig: alttextaiAuthConfig,
		schema: AltTextAiSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: alttextaiEndpointsNested,
		webhooks: alttextaiWebhooksNested,
		endpointMeta: alttextaiEndpointMeta,
		endpointSchemas: alttextaiEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AltTextAiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('alttextai', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('alttextai', 'api_key');
		},
	} satisfies InternalAltTextAiPlugin;
}

export type {
	AltTextAiAccount,
	AltTextAiEndpointInputs,
	AltTextAiEndpointOutputs,
	AltTextAiImage,
	BulkCreateInput,
	BulkCreateResponse,
	CreateImageInput,
	CreateImageResponse,
	GetAccountResponse,
	ListImagesInput,
	ListImagesResponse,
	PageScrapeInput,
	PageScrapeResponse,
	SearchImagesInput,
	SearchImagesResponse,
	UpdateAccountInput,
	UpdateAccountResponse,
} from './endpoints/types';

export {
	AltTextAiEndpointInputSchemas,
	AltTextAiEndpointOutputSchemas,
	BulkCreateInputSchema,
	CreateImageInputSchema,
	ListImagesInputSchema,
	PageScrapeInputSchema,
	SearchImagesInputSchema,
} from './endpoints/types';
