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
	lettaEndpointMeta as generatedEndpointMeta,
	lettaEndpointSchemas,
	lettaEndpointsNested,
} from './endpoints/catalog';
import type {
	LettaEndpointInputs,
	LettaEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { LettaSchema } from './schema';

export type LettaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** A Letta API key (app.letta.com, API keys). On a self-hosted server, its password. */
	key?: string;
	/**
	 * A self-hosted Letta server (`letta server` from Letta Code) or a proxy. Leave it out for https://api.letta.com.
	 */
	baseUrl?: string;
	hooks?: InternalLettaPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof lettaEndpointsNested>;
};

/** One API key per connected account, sent in the `Authorization` header. */
export const lettaAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type LettaContext = CorsairPluginContext<
	typeof LettaSchema,
	LettaPluginOptions,
	undefined,
	typeof lettaAuthConfig
>;

export type LettaKeyBuilderContext = KeyBuilderContext<
	LettaPluginOptions,
	typeof lettaAuthConfig
>;

export type LettaBoundEndpoints = BindEndpoints<typeof lettaEndpointsNested>;

export type LettaEndpoints = {
	[Id in keyof LettaEndpointOutputs]: CorsairEndpoint<
		LettaContext,
		LettaEndpointInputs[Id],
		LettaEndpointOutputs[Id]
	>;
};

export { lettaEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const lettaEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof lettaEndpointsNested
	>;

const defaultAuthType = 'api_key' as const;

export type BaseLettaPlugin<T extends LettaPluginOptions> = CorsairPlugin<
	'letta',
	typeof LettaSchema,
	typeof lettaEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof lettaAuthConfig
>;

export type InternalLettaPlugin = BaseLettaPlugin<LettaPluginOptions>;

export type ExternalLettaPlugin<T extends LettaPluginOptions> =
	BaseLettaPlugin<T>;

export function letta<const T extends LettaPluginOptions>(
	// Safe: every LettaPluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: LettaPluginOptions & T = {} as LettaPluginOptions & T,
): ExternalLettaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'letta',
		schema: LettaSchema,
		options: options,
		hooks: options.hooks,
		endpoints: lettaEndpointsNested,
		webhooks: {},
		authConfig: lettaAuthConfig,
		endpointMeta: lettaEndpointMeta,
		endpointSchemas: lettaEndpointSchemas,
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
		keyBuilder: async (ctx: LettaKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;

			// No key configured: AuthMissingError makes core ask the tenant to connect.
			const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
			if (!storedKey) throw new AuthMissingError('letta', 'api_key');
			return storedKey;
		},
	} satisfies InternalLettaPlugin;
}

export {
	createLettaOperation,
	getLettaInputSchema,
	getLettaOutputSchema,
	LETTA_OPERATION_IDS,
} from './endpoints';
export type {
	LettaEndpointInputs,
	LettaEndpointOutputs,
	LettaJsonValue,
	LettaOperationId,
} from './endpoints/types';
export {
	LettaEndpointInputSchemas,
	LettaEndpointOutputSchemas,
} from './endpoints/types';
