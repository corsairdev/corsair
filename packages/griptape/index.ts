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

import { Assistant } from './endpoints';
import type {
	GriptapeEndpointInputs,
	GriptapeEndpointOutputs,
} from './endpoints/types';
import {
	GriptapeEndpointInputSchemas,
	GriptapeEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GriptapeSchema } from './schema';

export type GriptapePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalGriptapePlugin['hooks'];
	webhookHooks?: InternalGriptapePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof griptapeEndpointsNested>;
};

export type GriptapeContext = CorsairPluginContext<
	typeof GriptapeSchema,
	GriptapePluginOptions
>;

export type GriptapeKeyBuilderContext =
	KeyBuilderContext<GriptapePluginOptions>;

export type GriptapeBoundEndpoints = BindEndpoints<
	typeof griptapeEndpointsNested
>;

type GriptapeEndpoint<K extends keyof GriptapeEndpointOutputs> =
	CorsairEndpoint<
		GriptapeContext,
		GriptapeEndpointInputs[K],
		GriptapeEndpointOutputs[K]
	>;

export type GriptapeEndpoints = {
	assistantList: GriptapeEndpoint<'assistantList'>;
	assistantGet: GriptapeEndpoint<'assistantGet'>;
};

export type GriptapeWebhooks = Record<string, never>;

export type GriptapeBoundWebhooks = Record<string, never>;

const griptapeEndpointsNested = {
	assistant: {
		list: Assistant.list,
		get: Assistant.get,
	},
} as const;

const griptapeWebhooksNested = {} as const;

export const griptapeEndpointSchemas = {
	'assistant.list': {
		input: GriptapeEndpointInputSchemas.assistantList,
		output: GriptapeEndpointOutputSchemas.assistantList,
	},
	'assistant.get': {
		input: GriptapeEndpointInputSchemas.assistantGet,
		output: GriptapeEndpointOutputSchemas.assistantGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof griptapeEndpointsNested
>;

const griptapeWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof griptapeWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const griptapeEndpointMeta = {
	'assistant.list': {
		riskLevel: 'read',
		description: 'List assistants',
	},
	'assistant.get': {
		riskLevel: 'read',
		description: 'Get an assistant',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof griptapeEndpointsNested>;

export const griptapeAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseGriptapePlugin<T extends GriptapePluginOptions> = CorsairPlugin<
	'griptape',
	typeof GriptapeSchema,
	typeof griptapeEndpointsNested,
	typeof griptapeWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalGriptapePlugin = BaseGriptapePlugin<GriptapePluginOptions>;

export type ExternalGriptapePlugin<T extends GriptapePluginOptions> =
	BaseGriptapePlugin<T>;

export function griptape<const T extends GriptapePluginOptions>(
	incomingOptions: GriptapePluginOptions & T = {} as GriptapePluginOptions & T,
): ExternalGriptapePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'griptape',
		authConfig: griptapeAuthConfig,
		schema: GriptapeSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: griptapeEndpointsNested,
		webhooks: griptapeWebhooksNested,
		endpointMeta: griptapeEndpointMeta,
		endpointSchemas: griptapeEndpointSchemas,
		webhookSchemas: griptapeWebhookSchemas,
		pluginWebhookMatcher: () => false,

		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},

		keyBuilder: async (ctx: GriptapeKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalGriptapePlugin;
}

export type {
	AssistantListInput,
	AssistantListResponse,
	GriptapeEndpointInputs,
	GriptapeEndpointOutputs,
} from './endpoints/types';
