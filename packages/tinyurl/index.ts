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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Urls } from './endpoints';
import type {
	TinyurlEndpointInputs,
	TinyurlEndpointOutputs,
} from './endpoints/types';
import {
	TinyurlEndpointInputSchemas,
	TinyurlEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TinyurlSchema } from './schema';

export type TinyurlPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTinyurlPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof tinyurlEndpointsNested>;
};

export type TinyurlContext = CorsairPluginContext<
	typeof TinyurlSchema,
	TinyurlPluginOptions
>;

export type TinyurlKeyBuilderContext = KeyBuilderContext<TinyurlPluginOptions>;

export type TinyurlBoundEndpoints = BindEndpoints<
	typeof tinyurlEndpointsNested
>;

type TinyurlEndpoint<K extends keyof TinyurlEndpointOutputs> = CorsairEndpoint<
	TinyurlContext,
	TinyurlEndpointInputs[K],
	TinyurlEndpointOutputs[K]
>;

export type TinyurlEndpoints = {
	createUrl: TinyurlEndpoint<'createUrl'>;
	listUrls: TinyurlEndpoint<'listUrls'>;
};

export type TinyurlWebhooks = {};

const tinyurlEndpointsNested = {
	urls: {
		create: Urls.create,
		list: Urls.list,
	},
} as const;

const tinyurlWebhooksNested = {} as const;

export const tinyurlEndpointSchemas = {
	'urls.create': {
		input: TinyurlEndpointInputSchemas.createUrl,
		output: TinyurlEndpointOutputSchemas.createUrl,
	},
	'urls.list': {
		input: TinyurlEndpointInputSchemas.listUrls,
		output: TinyurlEndpointOutputSchemas.listUrls,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof tinyurlEndpointsNested
>;

const tinyurlWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof tinyurlWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const tinyurlEndpointMeta = {
	'urls.create': {
		riskLevel: 'write',
		description: 'Shorten a URL using TinyURL',
	},
	'urls.list': {
		riskLevel: 'read',
		description: 'List available or archived TinyURLs',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof tinyurlEndpointsNested>;

export const tinyurlAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseTinyurlPlugin<T extends TinyurlPluginOptions> = CorsairPlugin<
	'tinyurl',
	typeof TinyurlSchema,
	typeof tinyurlEndpointsNested,
	typeof tinyurlWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalTinyurlPlugin = BaseTinyurlPlugin<TinyurlPluginOptions>;

export type ExternalTinyurlPlugin<T extends TinyurlPluginOptions> =
	BaseTinyurlPlugin<T>;

export function tinyurl<const T extends TinyurlPluginOptions>(
	incomingOptions: TinyurlPluginOptions & T = {} as TinyurlPluginOptions & T,
): ExternalTinyurlPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'tinyurl',
		authConfig: tinyurlAuthConfig,
		schema: TinyurlSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: tinyurlEndpointsNested,
		webhooks: tinyurlWebhooksNested,
		endpointMeta: tinyurlEndpointMeta,
		endpointSchemas: tinyurlEndpointSchemas,
		webhookSchemas: tinyurlWebhookSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TinyurlKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('tinyurl', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('tinyurl', 'api_key');
		},
	} satisfies InternalTinyurlPlugin;
}

export type {
	CreateUrlInput,
	CreateUrlResponse,
	ListUrlsInput,
	ListUrlsResponse,
	TinyurlEndpointInputs,
	TinyurlEndpointOutputs,
	TinyurlLink,
} from './endpoints/types';

export {
	CreateUrlInputSchema,
	CreateUrlResponseSchema,
	ListUrlsInputSchema,
	ListUrlsResponseSchema,
	TinyurlEndpointInputSchemas,
	TinyurlEndpointOutputSchemas,
} from './endpoints/types';

export { TinyurlSchema } from './schema';
