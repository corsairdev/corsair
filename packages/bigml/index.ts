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
	BigmlEndpointInputs,
	BigmlEndpointOutputs,
} from './endpoints/types';
import {
	BigmlEndpointInputSchemas,
	BigmlEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BigmlSchema } from './schema';
import type { BigmlWebhookOutputs } from './webhooks/types';

export type BigmlPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** BigML API key. */
	key?: string;
	/** BigML username - BigML auth is a `username`+`api_key` pair, not a single value (see `client.ts`). */
	username?: string;
	hooks?: InternalBigmlPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof bigmlEndpointsNested>;
};

export type BigmlContext = CorsairPluginContext<
	typeof BigmlSchema,
	BigmlPluginOptions,
	undefined,
	typeof bigmlAuthConfig
>;

export type BigmlKeyBuilderContext = KeyBuilderContext<
	BigmlPluginOptions,
	typeof bigmlAuthConfig
>;

export type BigmlBoundEndpoints = BindEndpoints<typeof bigmlEndpointsNested>;

type BigmlEndpoint<K extends keyof BigmlEndpointOutputs> = CorsairEndpoint<
	BigmlContext,
	BigmlEndpointInputs[K],
	BigmlEndpointOutputs[K]
>;

export type BigmlEndpoints = {
	exampleGet: BigmlEndpoint<'exampleGet'>;
};

/** BigML has no webhook, callback, or streaming mechanism - see `webhooks/types.ts`. */
export type BigmlWebhooks = Record<string, never>;

export type BigmlBoundWebhooks = BindWebhooks<BigmlWebhooks>;

const bigmlEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const bigmlWebhooksNested = {} as const;

export const bigmlEndpointSchemas = {
	'example.get': {
		input: BigmlEndpointInputSchemas.exampleGet,
		output: BigmlEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof bigmlEndpointsNested>;

const bigmlWebhookSchemas = {} as const satisfies RequiredPluginWebhookSchemas<
	typeof bigmlWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const bigmlEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof bigmlEndpointsNested>;

/**
 * `username` travels as an `account`-level field alongside the primary
 * `api_key`, the same two-value shape Twilio's `accountSid` uses - confirmed
 * from BigML's own SDK: every request needs both `username` and `api_key` as
 * query parameters, there is no single-value auth mode.
 */
export const bigmlAuthConfig = {
	api_key: {
		account: ['username'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBigmlPlugin<T extends BigmlPluginOptions> = CorsairPlugin<
	'bigml',
	typeof BigmlSchema,
	typeof bigmlEndpointsNested,
	typeof bigmlWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof bigmlAuthConfig
>;

export type InternalBigmlPlugin = BaseBigmlPlugin<BigmlPluginOptions>;

export type ExternalBigmlPlugin<T extends BigmlPluginOptions> =
	BaseBigmlPlugin<T>;

export function bigml<const T extends BigmlPluginOptions>(
	incomingOptions: BigmlPluginOptions & T = {} as BigmlPluginOptions & T,
): ExternalBigmlPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'bigml',
		authConfig: bigmlAuthConfig,
		schema: BigmlSchema,
		options: options,
		hooks: options.hooks,
		endpoints: bigmlEndpointsNested,
		webhooks: bigmlWebhooksNested,
		endpointMeta: bigmlEndpointMeta,
		endpointSchemas: bigmlEndpointSchemas,
		webhookSchemas: bigmlWebhookSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BigmlKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalBigmlPlugin;
}

export type {
	BigmlEndpointInputs,
	BigmlEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type { BigmlWebhookOutputs } from './webhooks/types';
