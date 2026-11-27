import type {
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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { tryGetStoredKey } from './client';
import {
	defillamaEndpointSchemas,
	defillamaEndpointsNested,
	defillamaEndpointMeta as generatedEndpointMeta,
} from './endpoints/catalog';
import type {
	DefillamaEndpointInputs,
	DefillamaEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DefillamaSchema } from './schema';

export type DefillamaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * A DefiLlama Pro API key. Optional: 73 routes are free without one; the
	 * Pro-only ones (yields earn and borrow, unlocks, bridges, equities, ETFs,
	 * RWA ...) need it. Overrides the account's stored key.
	 */
	key?: string;
	hooks?: InternalDefillamaPlugin['hooks'];
	webhookHooks?: InternalDefillamaPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof defillamaEndpointsNested>;
};

// The key is optional: free routes need none.
export const defillamaAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type DefillamaContext = CorsairPluginContext<
	typeof DefillamaSchema,
	DefillamaPluginOptions,
	undefined,
	typeof defillamaAuthConfig
>;

export type DefillamaKeyBuilderContext = KeyBuilderContext<
	DefillamaPluginOptions,
	typeof defillamaAuthConfig
>;

export type DefillamaBoundEndpoints = BindEndpoints<
	typeof defillamaEndpointsNested
>;

// DefiLlama sends no webhooks.
const defillamaWebhooksNested = {} as const;

export type DefillamaBoundWebhooks = BindWebhooks<
	typeof defillamaWebhooksNested
>;

export type DefillamaEndpoints = {
	[Id in keyof DefillamaEndpointOutputs]: CorsairEndpoint<
		DefillamaContext,
		DefillamaEndpointInputs[Id],
		DefillamaEndpointOutputs[Id]
	>;
};

export { defillamaEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const defillamaEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof defillamaEndpointsNested
	>;

const defillamaWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof defillamaWebhooksNested
	>;

const defaultAuthType = 'api_key' as const;

export type BaseDefillamaPlugin<T extends DefillamaPluginOptions> =
	CorsairPlugin<
		'defillama',
		typeof DefillamaSchema,
		typeof defillamaEndpointsNested,
		typeof defillamaWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof defillamaAuthConfig
	>;

export type InternalDefillamaPlugin =
	BaseDefillamaPlugin<DefillamaPluginOptions>;

export type ExternalDefillamaPlugin<T extends DefillamaPluginOptions> =
	BaseDefillamaPlugin<T>;

export function defillama<const T extends DefillamaPluginOptions>(
	// Safe: every DefillamaPluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: DefillamaPluginOptions & T = {} as DefillamaPluginOptions &
		T,
): ExternalDefillamaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'defillama',
		authConfig: defillamaAuthConfig,
		schema: DefillamaSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: defillamaEndpointsNested,
		webhooks: defillamaWebhooksNested,
		endpointMeta: defillamaEndpointMeta,
		endpointSchemas: defillamaEndpointSchemas,
		webhookSchemas: defillamaWebhookSchemas,
		pluginWebhookMatcher: (_request) => false,
		errorHandlers: (() => {
			// Core uses the first handler whose matcher accepts the error, and
			// DEFAULT matches everything, so DEFAULT always goes last; otherwise
			// it would shadow a handler a caller adds through options.
			const { DEFAULT: builtInDefault, ...specificDefaults } = errorHandlers;
			const { DEFAULT: callerDefault, ...callerHandlers } =
				options.errorHandlers || {};
			return {
				...specificDefaults,
				...callerHandlers,
				DEFAULT: callerDefault || builtInDefault,
			};
		})(),
		keyBuilder: async (ctx: DefillamaKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			// No key: free routes still run; Pro-only ones raise
			// AuthMissingError when they're called (see client.ts).
			return (await tryGetStoredKey(() => ctx.keys?.get_api_key())) ?? '';
		},
	} satisfies InternalDefillamaPlugin;
}

export type { DefillamaRequest } from './client';
export { DEFILLAMA_PRO_URL } from './client';
export {
	createDefillamaOperation,
	DEFILLAMA_OPERATION_IDS,
	getDefillamaInputSchema,
	getDefillamaOutputSchema,
} from './endpoints';
export type {
	DefillamaEndpointInputs,
	DefillamaEndpointOutputs,
	DefillamaJsonValue,
	DefillamaOperationId,
} from './endpoints/types';
export {
	DefillamaEndpointInputSchemas,
	DefillamaEndpointOutputSchemas,
} from './endpoints/types';
