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
	steelEndpointMeta as generatedEndpointMeta,
	steelEndpointSchemas,
	steelEndpointsNested,
} from './endpoints/catalog';
import type {
	SteelEndpointInputs,
	SteelEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SteelSchema } from './schema';

export type SteelPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** A Steel API key (app.steel.dev, API Keys). A project key reaches one project; an organization key reaches all of them. */
	key?: string;
	/**
	 * A self-hosted Steel browser server (github.com/steel-dev/steel-browser) or a proxy. Leave it out for https://api.steel.dev.
	 */
	baseUrl?: string;
	hooks?: InternalSteelPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof steelEndpointsNested>;
};

/** One API key per connected account, sent in the `steel-api-key` header. */
export const steelAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type SteelContext = CorsairPluginContext<
	typeof SteelSchema,
	SteelPluginOptions,
	undefined,
	typeof steelAuthConfig
>;

export type SteelKeyBuilderContext = KeyBuilderContext<
	SteelPluginOptions,
	typeof steelAuthConfig
>;

export type SteelBoundEndpoints = BindEndpoints<typeof steelEndpointsNested>;

export type SteelEndpoints = {
	[Id in keyof SteelEndpointOutputs]: CorsairEndpoint<
		SteelContext,
		SteelEndpointInputs[Id],
		SteelEndpointOutputs[Id]
	>;
};

export { steelEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const steelEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof steelEndpointsNested
	>;

const defaultAuthType = 'api_key' as const;

export type BaseSteelPlugin<T extends SteelPluginOptions> = CorsairPlugin<
	'steel',
	typeof SteelSchema,
	typeof steelEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof steelAuthConfig
>;

export type InternalSteelPlugin = BaseSteelPlugin<SteelPluginOptions>;

export type ExternalSteelPlugin<T extends SteelPluginOptions> =
	BaseSteelPlugin<T>;

export function steel<const T extends SteelPluginOptions>(
	// Safe: every SteelPluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: SteelPluginOptions & T = {} as SteelPluginOptions & T,
): ExternalSteelPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'steel',
		schema: SteelSchema,
		options: options,
		hooks: options.hooks,
		endpoints: steelEndpointsNested,
		webhooks: {},
		authConfig: steelAuthConfig,
		endpointMeta: steelEndpointMeta,
		endpointSchemas: steelEndpointSchemas,
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
		keyBuilder: async (ctx: SteelKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;

			// No key configured: AuthMissingError makes core ask the tenant to connect.
			const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
			if (!storedKey) throw new AuthMissingError('steel', 'api_key');
			return storedKey;
		},
	} satisfies InternalSteelPlugin;
}

export {
	createSteelOperation,
	getSteelInputSchema,
	getSteelOutputSchema,
	STEEL_OPERATION_IDS,
} from './endpoints';
export type {
	SteelEndpointInputs,
	SteelEndpointOutputs,
	SteelJsonValue,
	SteelOperationId,
} from './endpoints/types';
export {
	SteelEndpointInputSchemas,
	SteelEndpointOutputSchemas,
} from './endpoints/types';
