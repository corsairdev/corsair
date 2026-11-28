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
import type { N8nAuthOptions } from './auth';
import {
	checkN8nStoredPairing,
	n8nAccountFields,
	resolveN8nTarget,
} from './auth';
import { tryGetStoredKey } from './client';
import {
	n8nEndpointMeta as generatedEndpointMeta,
	n8nEndpointSchemas,
	n8nEndpointsNested,
} from './endpoints/catalog';
import type { N8nEndpointInputs, N8nEndpointOutputs } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { N8nSchema } from './schema';

export type N8nPluginOptions = N8nAuthOptions & {
	authType?: PickAuth<'api_key'>;
	/** An n8n API key (Settings > n8n API on the instance). Its scopes decide which operations work; n8n Cloud has the API on paid plans only. */
	key?: string;
	hooks?: InternalN8nPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof n8nEndpointsNested>;
};

/**
 * One API key per connected account. Each n8n instance has its own API and keys, at <instance>/api/v1, so the account stores it
 * beside the key (auth.ts reads it).
 */
export const n8nAuthConfig = {
	api_key: {
		account: n8nAccountFields,
	},
} as const satisfies PluginAuthConfig;

export type N8nContext = CorsairPluginContext<
	typeof N8nSchema,
	N8nPluginOptions,
	undefined,
	typeof n8nAuthConfig
>;

export type N8nKeyBuilderContext = KeyBuilderContext<
	N8nPluginOptions,
	typeof n8nAuthConfig
>;

export type N8nBoundEndpoints = BindEndpoints<typeof n8nEndpointsNested>;

export type N8nEndpoints = {
	[Id in keyof N8nEndpointOutputs]: CorsairEndpoint<
		N8nContext,
		N8nEndpointInputs[Id],
		N8nEndpointOutputs[Id]
	>;
};

export { n8nEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const n8nEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof n8nEndpointsNested
	>;

const defaultAuthType = 'api_key' as const;

export type BaseN8nPlugin<T extends N8nPluginOptions> = CorsairPlugin<
	'n8n',
	typeof N8nSchema,
	typeof n8nEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof n8nAuthConfig
>;

export type InternalN8nPlugin = BaseN8nPlugin<N8nPluginOptions>;

export type ExternalN8nPlugin<T extends N8nPluginOptions> = BaseN8nPlugin<T>;

export function n8n<const T extends N8nPluginOptions>(
	// Safe: every N8nPluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: N8nPluginOptions & T = {} as N8nPluginOptions & T,
): ExternalN8nPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'n8n',
		schema: N8nSchema,
		options: options,
		hooks: options.hooks,
		endpoints: n8nEndpointsNested,
		webhooks: {},
		authConfig: n8nAuthConfig,
		endpointMeta: n8nEndpointMeta,
		endpointSchemas: n8nEndpointSchemas,
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
		keyBuilder: async (ctx: N8nKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) {
				// Fails fast (AuthMissingError) when the site the key belongs to is not set.
				await resolveN8nTarget({ key: options.key, options, keys: ctx.keys });
				return options.key;
			}

			// No key configured: AuthMissingError makes core ask the tenant to connect.
			const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
			if (!storedKey) throw new AuthMissingError('n8n', 'api_key');
			// A stored key belongs to the stored site: a site option pointing
			// elsewhere would hand it to another host, so that needs its own key.
			await checkN8nStoredPairing(options, ctx.keys);
			await resolveN8nTarget({ key: storedKey, options, keys: ctx.keys });
			return storedKey;
		},
	} satisfies InternalN8nPlugin;
}

export {
	createN8nOperation,
	getN8nInputSchema,
	getN8nOutputSchema,
	N8N_OPERATION_IDS,
} from './endpoints';
export type {
	N8nEndpointInputs,
	N8nEndpointOutputs,
	N8nJsonValue,
	N8nOperationId,
} from './endpoints/types';
export {
	N8nEndpointInputSchemas,
	N8nEndpointOutputSchemas,
} from './endpoints/types';
