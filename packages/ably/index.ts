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
import { Example } from './endpoints';
import type {
	AblyEndpointInputs,
	AblyEndpointOutputs,
} from './endpoints/types';
import {
	AblyEndpointInputSchemas,
	AblyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AblySchema } from './schema';

export type AblyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAblyPlugin['hooks'];
	webhookHooks?: InternalAblyPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ablyEndpointsNested>;
};

export type AblyContext = CorsairPluginContext<
	typeof AblySchema,
	AblyPluginOptions
>;

export type AblyKeyBuilderContext = KeyBuilderContext<AblyPluginOptions>;

export type AblyBoundEndpoints = BindEndpoints<typeof ablyEndpointsNested>;

type AblyEndpoint<K extends keyof AblyEndpointOutputs> = CorsairEndpoint<
	AblyContext,
	AblyEndpointInputs[K],
	AblyEndpointOutputs[K]
>;

export type AblyEndpoints = {
	exampleGet: AblyEndpoint<'exampleGet'>;
};

export type AblyWebhooks = Record<string, never>;
export type AblyBoundWebhooks = BindWebhooks<AblyWebhooks>;

const ablyEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const ablyWebhooksNested = {} as const;

export const ablyEndpointSchemas = {
	'example.get': {
		input: AblyEndpointInputSchemas.exampleGet,
		output: AblyEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof ablyEndpointsNested>;

const ablyWebhookSchemas = {} as const satisfies RequiredPluginWebhookSchemas<
	typeof ablyWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const ablyEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof ablyEndpointsNested>;

export const ablyAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAblyPlugin<T extends AblyPluginOptions> = CorsairPlugin<
	'ably',
	typeof AblySchema,
	typeof ablyEndpointsNested,
	typeof ablyWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAblyPlugin = BaseAblyPlugin<AblyPluginOptions>;

export type ExternalAblyPlugin<T extends AblyPluginOptions> = BaseAblyPlugin<T>;

export function ably<const T extends AblyPluginOptions>(
	incomingOptions: AblyPluginOptions & T = {} as AblyPluginOptions & T,
): ExternalAblyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'ably',
		authConfig: ablyAuthConfig,
		schema: AblySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: ablyEndpointsNested,
		webhooks: ablyWebhooksNested,
		endpointMeta: ablyEndpointMeta,
		endpointSchemas: ablyEndpointSchemas,
		webhookSchemas: ablyWebhookSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AblyKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalAblyPlugin;
}

export type {
	AblyEndpointInputs,
	AblyEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
