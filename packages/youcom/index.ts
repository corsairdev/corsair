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
import { YouSearch } from './endpoints';
import type {
	YoucomEndpointInputs,
	YoucomEndpointOutputs,
} from './endpoints/types';
import {
	YoucomEndpointInputSchemas,
	YoucomEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { YoucomSchema } from './schema';

export type YoucomPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalYoucomPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof youcomEndpointsNested>;
};

export type YoucomContext = CorsairPluginContext<
	typeof YoucomSchema,
	YoucomPluginOptions
>;

export type YoucomKeyBuilderContext = KeyBuilderContext<YoucomPluginOptions>;

export type YoucomBoundEndpoints = BindEndpoints<typeof youcomEndpointsNested>;

type YoucomEndpoint<K extends keyof YoucomEndpointOutputs> = CorsairEndpoint<
	YoucomContext,
	YoucomEndpointInputs[K],
	YoucomEndpointOutputs[K]
>;

export type YoucomEndpoints = {
	youSearch: YoucomEndpoint<'youSearch'>;
};

const youcomEndpointsNested = {
	yousearch: {
		youSearch: YouSearch.youSearch,
	},
} as const;

export const youcomEndpointSchemas = {
	'yousearch.youSearch': {
		input: YoucomEndpointInputSchemas.youSearch,
		output: YoucomEndpointOutputSchemas.youSearch,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof youcomEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const youcomEndpointMeta = {
	'yousearch.youSearch': {
		riskLevel: 'read',
		description:
			"Search the web using You.com's search API. Returns LLM-ready web results and news articles.",
	},
} as const satisfies RequiredPluginEndpointMeta<typeof youcomEndpointsNested>;

export const youcomAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseYoucomPlugin<T extends YoucomPluginOptions> = CorsairPlugin<
	'youcom',
	typeof YoucomSchema,
	typeof youcomEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalYoucomPlugin = BaseYoucomPlugin<YoucomPluginOptions>;

export type ExternalYoucomPlugin<T extends YoucomPluginOptions> =
	BaseYoucomPlugin<T>;

export function youcom<const T extends YoucomPluginOptions>(
	incomingOptions: YoucomPluginOptions & T = {} as YoucomPluginOptions & T,
): ExternalYoucomPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'youcom',
		authConfig: youcomAuthConfig,
		schema: YoucomSchema,
		options: options,
		hooks: options.hooks,
		endpoints: youcomEndpointsNested,
		webhooks: {},
		endpointMeta: youcomEndpointMeta,
		endpointSchemas: youcomEndpointSchemas,
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: () => null,
		oauthWebhookTenantLinkResolver: () => null,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: YoucomKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			throw new AuthMissingError('youcom', 'api_key');
		},
	} satisfies InternalYoucomPlugin;
}

export type {
	YoucomEndpointInputs,
	YoucomEndpointOutputs,
	YoucomNewsResult,
	YoucomSearchMetadata,
	YoucomWebResult,
	YouSearchRequest,
	YouSearchResponse,
} from './endpoints/types';
