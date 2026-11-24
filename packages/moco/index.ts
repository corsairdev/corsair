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
	mocoEndpointMeta as generatedEndpointMeta,
	mocoEndpointSchemas,
	mocoEndpointsNested,
} from './endpoints/catalog';
import type {
	MocoEndpointInputs,
	MocoEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { MocoSchema } from './schema';

export type MocoPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * A MOCO API key: a user key (profile > Integrations) or an account key
	 * (Settings > Extensions > API & Webhooks, read-only or full access).
	 */
	key?: string;
	/** The account subdomain: `acme` for `acme.mocoapp.com`. */
	subdomain?: string;
	hooks?: InternalMocoPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof mocoEndpointsNested>;
};

/**
 * The API key travels in the Authorization header; the account subdomain is
 * a second account-level field the request needs for its host.
 */
export const mocoAuthConfig = {
	api_key: {
		account: ['subdomain'] as const,
	},
} as const satisfies PluginAuthConfig;

export type MocoContext = CorsairPluginContext<
	typeof MocoSchema,
	MocoPluginOptions,
	undefined,
	typeof mocoAuthConfig
>;

export type MocoKeyBuilderContext = KeyBuilderContext<
	MocoPluginOptions,
	typeof mocoAuthConfig
>;

export type MocoBoundEndpoints = BindEndpoints<typeof mocoEndpointsNested>;

export type MocoEndpoints = {
	[Id in keyof MocoEndpointOutputs]: CorsairEndpoint<
		MocoContext,
		MocoEndpointInputs[Id],
		MocoEndpointOutputs[Id]
	>;
};

export { mocoEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const mocoEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof mocoEndpointsNested
	>;

const defaultAuthType = 'api_key' as const;

export type BaseMocoPlugin<T extends MocoPluginOptions> = CorsairPlugin<
	'moco',
	typeof MocoSchema,
	typeof mocoEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof mocoAuthConfig
>;

export type InternalMocoPlugin = BaseMocoPlugin<MocoPluginOptions>;

export type ExternalMocoPlugin<T extends MocoPluginOptions> = BaseMocoPlugin<T>;

export function moco<const T extends MocoPluginOptions>(
	// Safe: every MocoPluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: MocoPluginOptions & T = {} as MocoPluginOptions & T,
): ExternalMocoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'moco',
		schema: MocoSchema,
		options: options,
		hooks: options.hooks,
		endpoints: mocoEndpointsNested,
		webhooks: {},
		authConfig: mocoAuthConfig,
		endpointMeta: mocoEndpointMeta,
		endpointSchemas: mocoEndpointSchemas,
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
		keyBuilder: async (ctx: MocoKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;

			// No key configured: AuthMissingError makes core ask the tenant to connect.
			const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
			if (!storedKey) throw new AuthMissingError('moco', 'api_key');
			return storedKey;
		},
	} satisfies InternalMocoPlugin;
}

export {
	createMocoOperation,
	getMocoInputSchema,
	getMocoOutputSchema,
	MOCO_OPERATION_IDS,
} from './endpoints';
export type {
	MocoEndpointInputs,
	MocoEndpointOutputs,
	MocoJsonValue,
	MocoOperationId,
} from './endpoints/types';
export {
	MocoEndpointInputSchemas,
	MocoEndpointOutputSchemas,
} from './endpoints/types';
