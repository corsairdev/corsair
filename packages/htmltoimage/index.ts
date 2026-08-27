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

const htmlToImageEndpointsNested = {
	checkUsage: {
		get: HtmlToImage.checkUsage,
	},
	convertToImage: {
		post: HtmlToImage.convertToImage,
	},
	getImage: {
		get: HtmlToImage.getImage,
	},
} as const;

export const htmlToImageEndpointSchemas = {
	'checkUsage.get': {
		input: HtmlToImageEndpointInputSchemas.checkUsage,
		output: HtmlToImageEndpointOutputSchemas.checkUsage,
	},
	'convertToImage.post': {
		input: HtmlToImageEndpointInputSchemas.convertToImage,
		output: HtmlToImageEndpointOutputSchemas.convertToImage,
	},
	'getImage.get': {
		input: HtmlToImageEndpointInputSchemas.getImage,
		output: HtmlToImageEndpointOutputSchemas.getImage,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof htmlToImageEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key';

const htmlToImageEndpointMeta = {
	'checkUsage.get': {
		riskLevel: 'read',
		description: 'Check HTML-to-Image account usage',
	},
	'convertToImage.post': {
		riskLevel: 'write',
		description: 'Convert HTML content to an image',
	},
	'getImage.get': {
		riskLevel: 'read',
		description: 'Get an HTML-to-Image result',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof htmlToImageEndpointsNested
>;

export const htmlToImageAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseHtmlToImagePlugin<T extends HtmlToImagePluginOptions> =
	CorsairPlugin<
		'htmltoimage',
		typeof HtmlToImageSchema,
		typeof htmlToImageEndpointsNested,
		{},
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
		endpoints: htmlToImageEndpointsNested,
		webhooks: {},
		endpointMeta: htmlToImageEndpointMeta,
		endpointSchemas: htmlToImageEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: HtmlToImageKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalHtmlToImagePlugin;
}

export type {
	HtmlToImageEndpointInputs,
	HtmlToImageEndpointOutputs,
} from './endpoints/types';
