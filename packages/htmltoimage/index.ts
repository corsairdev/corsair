import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';

import { HtmlToImage } from './endpoints';

import type {
	HtmlToImageEndpointInputs,
	HtmlToImageEndpointOutputs,
} from './endpoints/types';

import {
	HtmlToImageEndpointInputSchemas,
	HtmlToImageEndpointOutputSchemas,
} from './endpoints/types';

import { errorHandlers } from './error-handlers';
import { HtmlToImageSchema } from './schema';

export type HtmlToImagePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalHtmlToImagePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof htmlToImageEndpointsNested>;
};

export type HtmlToImageContext = CorsairPluginContext<
	typeof HtmlToImageSchema,
	HtmlToImagePluginOptions
>;

export type HtmlToImageKeyBuilderContext =
	KeyBuilderContext<HtmlToImagePluginOptions>;

export type HtmlToImageBoundEndpoints = BindEndpoints<
	typeof htmlToImageEndpointsNested
>;

type HtmlToImageEndpoint<K extends keyof HtmlToImageEndpointOutputs> =
	CorsairEndpoint<
		HtmlToImageContext,
		HtmlToImageEndpointInputs[K],
		HtmlToImageEndpointOutputs[K]
	>;

export type HtmlToImageEndpoints = {
	checkUsage: HtmlToImageEndpoint<'checkUsage'>;
	convertToImage: HtmlToImageEndpoint<'convertToImage'>;
	getImage: HtmlToImageEndpoint<'getImage'>;
};

export type HtmlToImageWebhooks = {};

export type HtmlToImageBoundWebhooks = BindWebhooks<HtmlToImageWebhooks>;

const htmlToImageEndpointsNested = {
	account: {
		checkUsage: HtmlToImage.checkUsage,
	},
	html: {
		convertToImage: HtmlToImage.convertToImage,
	},
	image: {
		getImage: HtmlToImage.getImage,
	},
} as const;

const htmlToImageWebhooksNested = {};

export const htmlToImageEndpointSchemas = {
	'account.checkUsage': {
		input: HtmlToImageEndpointInputSchemas.checkUsage,
		output: HtmlToImageEndpointOutputSchemas.checkUsage,
	},
	'html.convertToImage': {
		input: HtmlToImageEndpointInputSchemas.convertToImage,
		output: HtmlToImageEndpointOutputSchemas.convertToImage,
	},
	'image.getImage': {
		input: HtmlToImageEndpointInputSchemas.getImage,
		output: HtmlToImageEndpointOutputSchemas.getImage,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof htmlToImageEndpointsNested
>;

const htmlToImageWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof htmlToImageWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const htmlToImageEndpointMeta = {
	'account.checkUsage': {
		riskLevel: 'read',
		description: 'Check account usage and remaining credits',
	},
	'html.convertToImage': {
		riskLevel: 'write',
		description: 'Convert HTML or a public URL into an image',
	},
	'image.getImage': {
		riskLevel: 'read',
		description: 'Retrieve a generated image',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof htmlToImageEndpointsNested
>;

export const htmlToImageAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseHtmlToImagePlugin<T extends HtmlToImagePluginOptions> =
	CorsairPlugin<
		'htmltoimage',
		typeof HtmlToImageSchema,
		typeof htmlToImageEndpointsNested,
		typeof htmlToImageWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalHtmlToImagePlugin =
	BaseHtmlToImagePlugin<HtmlToImagePluginOptions>;

export type ExternalHtmlToImagePlugin<T extends HtmlToImagePluginOptions> =
	BaseHtmlToImagePlugin<T>;

export function htmltoimage<const T extends HtmlToImagePluginOptions>(
	incomingOptions: HtmlToImagePluginOptions &
		T = {} as HtmlToImagePluginOptions & T,
): ExternalHtmlToImagePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'htmltoimage',
		authConfig: htmlToImageAuthConfig,
		schema: HtmlToImageSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: htmlToImageEndpointsNested,
		webhooks: htmlToImageWebhooksNested,
		endpointMeta: htmlToImageEndpointMeta,
		endpointSchemas: htmlToImageEndpointSchemas,
		webhookSchemas: htmlToImageWebhookSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: (() => {
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: HtmlToImageKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('htmltoimage', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('htmltoimage', 'api_key');
		},
	} satisfies InternalHtmlToImagePlugin;
}

export type {
	CheckUsageInput,
	CheckUsageResponse,
	ConvertToImageInput,
	ConvertToImageResponse,
	GetImageInput,
	GetImageResponse,
	HtmlToImageEndpointInputs,
	HtmlToImageEndpointOutputs,
} from './endpoints/types';
