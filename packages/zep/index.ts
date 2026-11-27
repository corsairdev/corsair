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
	zepEndpointMeta as generatedEndpointMeta,
	zepEndpointSchemas,
	zepEndpointsNested,
} from './endpoints/catalog';
import type { ZepEndpointInputs, ZepEndpointOutputs } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ZepSchema } from './schema';

export type ZepPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** A Zep project API key (Zep dashboard, Project settings, API Keys). Every call acts on that project. */
	key?: string;
	/**
	 * Another API base, such as a proxy in front of Zep. Leave it out for https://api.getzep.com/api/v4.
	 */
	baseUrl?: string;
	hooks?: InternalZepPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof zepEndpointsNested>;
};

/** One API key per connected account, sent in the `Authorization` header. */
export const zepAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type ZepContext = CorsairPluginContext<
	typeof ZepSchema,
	ZepPluginOptions,
	undefined,
	typeof zepAuthConfig
>;

export type ZepKeyBuilderContext = KeyBuilderContext<
	ZepPluginOptions,
	typeof zepAuthConfig
>;

export type ZepBoundEndpoints = BindEndpoints<typeof zepEndpointsNested>;

export type ZepEndpoints = {
	[Id in keyof ZepEndpointOutputs]: CorsairEndpoint<
		ZepContext,
		ZepEndpointInputs[Id],
		ZepEndpointOutputs[Id]
	>;
};

export { zepEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const zepEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof zepEndpointsNested
	>;

const defaultAuthType = 'api_key' as const;

export type BaseZepPlugin<T extends ZepPluginOptions> = CorsairPlugin<
	'zep',
	typeof ZepSchema,
	typeof zepEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof zepAuthConfig
>;

export type InternalZepPlugin = BaseZepPlugin<ZepPluginOptions>;

export type ExternalZepPlugin<T extends ZepPluginOptions> = BaseZepPlugin<T>;

export function zep<const T extends ZepPluginOptions>(
	// Safe: every ZepPluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: ZepPluginOptions & T = {} as ZepPluginOptions & T,
): ExternalZepPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'zep',
		schema: ZepSchema,
		options: options,
		hooks: options.hooks,
		endpoints: zepEndpointsNested,
		webhooks: {},
		authConfig: zepAuthConfig,
		endpointMeta: zepEndpointMeta,
		endpointSchemas: zepEndpointSchemas,
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
		keyBuilder: async (ctx: ZepKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;

			// No key configured: AuthMissingError makes core ask the tenant to connect.
			const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
			if (!storedKey) throw new AuthMissingError('zep', 'api_key');
			return storedKey;
		},
	} satisfies InternalZepPlugin;
}

export {
	createZepOperation,
	getZepInputSchema,
	getZepOutputSchema,
	ZEP_OPERATION_IDS,
} from './endpoints';
export type {
	ZepEndpointInputs,
	ZepEndpointOutputs,
	ZepJsonValue,
	ZepOperationId,
} from './endpoints/types';
export {
	ZepEndpointInputSchemas,
	ZepEndpointOutputSchemas,
} from './endpoints/types';
