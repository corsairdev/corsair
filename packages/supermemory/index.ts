import type {
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
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { tryGetStoredKey } from './client';
import {
	supermemoryEndpointMeta as generatedEndpointMeta,
	supermemoryEndpointSchemas,
	supermemoryEndpointsNested,
} from './endpoints/catalog';
import type {
	SupermemoryEndpointInputs,
	SupermemoryEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SupermemorySchema } from './schema';

export type SupermemoryPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** A Supermemory API key (console.supermemory.ai, API Keys): an organization key reaches every namespace, a scoped key only its own. */
	key?: string;
	/**
	 * Another API base, such as a proxy in front of Supermemory. Leave it out for https://api.supermemory.ai.
	 */
	baseUrl?: string;
	hooks?: InternalSupermemoryPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof supermemoryEndpointsNested>;
};

/** One API key per connected account, sent in the `Authorization` header. */
export const supermemoryAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type SupermemoryContext = CorsairPluginContext<
	typeof SupermemorySchema,
	SupermemoryPluginOptions,
	undefined,
	typeof supermemoryAuthConfig
>;

export type SupermemoryKeyBuilderContext = KeyBuilderContext<
	SupermemoryPluginOptions,
	typeof supermemoryAuthConfig
>;

export type SupermemoryBoundEndpoints = BindEndpoints<
	typeof supermemoryEndpointsNested
>;

export type SupermemoryEndpoints = {
	[Id in keyof SupermemoryEndpointOutputs]: CorsairEndpoint<
		SupermemoryContext,
		SupermemoryEndpointInputs[Id],
		SupermemoryEndpointOutputs[Id]
	>;
};

export { supermemoryEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const supermemoryEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof supermemoryEndpointsNested
	>;

const defaultAuthType = 'api_key' as const;

export type BaseSupermemoryPlugin<T extends SupermemoryPluginOptions> =
	CorsairPlugin<
		'supermemory',
		typeof SupermemorySchema,
		typeof supermemoryEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof supermemoryAuthConfig
	>;

export type InternalSupermemoryPlugin =
	BaseSupermemoryPlugin<SupermemoryPluginOptions>;

export type ExternalSupermemoryPlugin<T extends SupermemoryPluginOptions> =
	BaseSupermemoryPlugin<T>;

export function supermemory<const T extends SupermemoryPluginOptions>(
	// Safe: every SupermemoryPluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: SupermemoryPluginOptions &
		T = {} as SupermemoryPluginOptions & T,
): ExternalSupermemoryPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'supermemory',
		schema: SupermemorySchema,
		options: options,
		hooks: options.hooks,
		endpoints: supermemoryEndpointsNested,
		webhooks: {},
		authConfig: supermemoryAuthConfig,
		endpointMeta: supermemoryEndpointMeta,
		endpointSchemas: supermemoryEndpointSchemas,
		pluginWebhookMatcher: () => false,
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
		keyBuilder: async (ctx: SupermemoryKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;

			// No key configured: AuthMissingError makes core ask the tenant to connect.
			const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
			if (!storedKey) throw new AuthMissingError('supermemory', 'api_key');
			return storedKey;
		},
	} satisfies InternalSupermemoryPlugin;
}

export {
	createSupermemoryOperation,
	getSupermemoryInputSchema,
	getSupermemoryOutputSchema,
	SUPERMEMORY_OPERATION_IDS,
} from './endpoints';
export type {
	SupermemoryEndpointInputs,
	SupermemoryEndpointOutputs,
	SupermemoryJsonValue,
	SupermemoryOperationId,
} from './endpoints/types';
export {
	SupermemoryEndpointInputSchemas,
	SupermemoryEndpointOutputSchemas,
} from './endpoints/types';
