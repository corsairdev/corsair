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
	moneybirdEndpointMeta as generatedEndpointMeta,
	moneybirdEndpointSchemas,
	moneybirdEndpointsNested,
} from './endpoints/catalog';
import type {
	MoneybirdEndpointInputs,
	MoneybirdEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { MoneybirdSchema } from './schema';

export type MoneybirdPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * A Moneybird bearer token: a personal API token (user menu > Developers)
	 * or an OAuth access token. Its scopes decide which operations work.
	 */
	key?: string;
	/**
	 * The administration the token should act on (the digits in
	 * moneybird.com/<administration_id>/...). A call's own `administration_id`
	 * overrides it.
	 */
	administrationId?: string;
	hooks?: InternalMoneybirdPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof moneybirdEndpointsNested>;
};

/**
 * The token travels in the Authorization header; the administration id is a
 * second account-level field: every route except administrations.list sits
 * under /api/v2/<administration_id>/.
 */
export const moneybirdAuthConfig = {
	api_key: {
		account: ['administration_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type MoneybirdContext = CorsairPluginContext<
	typeof MoneybirdSchema,
	MoneybirdPluginOptions,
	undefined,
	typeof moneybirdAuthConfig
>;

export type MoneybirdKeyBuilderContext = KeyBuilderContext<
	MoneybirdPluginOptions,
	typeof moneybirdAuthConfig
>;

export type MoneybirdBoundEndpoints = BindEndpoints<
	typeof moneybirdEndpointsNested
>;

export type MoneybirdEndpoints = {
	[Id in keyof MoneybirdEndpointOutputs]: CorsairEndpoint<
		MoneybirdContext,
		MoneybirdEndpointInputs[Id],
		MoneybirdEndpointOutputs[Id]
	>;
};

export { moneybirdEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const moneybirdEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof moneybirdEndpointsNested
	>;

const defaultAuthType = 'api_key' as const;

export type BaseMoneybirdPlugin<T extends MoneybirdPluginOptions> =
	CorsairPlugin<
		'moneybird',
		typeof MoneybirdSchema,
		typeof moneybirdEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof moneybirdAuthConfig
	>;

export type InternalMoneybirdPlugin =
	BaseMoneybirdPlugin<MoneybirdPluginOptions>;

export type ExternalMoneybirdPlugin<T extends MoneybirdPluginOptions> =
	BaseMoneybirdPlugin<T>;

export function moneybird<const T extends MoneybirdPluginOptions>(
	// Safe: every MoneybirdPluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: MoneybirdPluginOptions & T = {} as MoneybirdPluginOptions &
		T,
): ExternalMoneybirdPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'moneybird',
		schema: MoneybirdSchema,
		options: options,
		hooks: options.hooks,
		endpoints: moneybirdEndpointsNested,
		webhooks: {},
		authConfig: moneybirdAuthConfig,
		endpointMeta: moneybirdEndpointMeta,
		endpointSchemas: moneybirdEndpointSchemas,
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
		keyBuilder: async (ctx: MoneybirdKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;

			// No key configured: AuthMissingError makes core ask the tenant to connect.
			const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
			if (!storedKey) throw new AuthMissingError('moneybird', 'api_key');
			return storedKey;
		},
	} satisfies InternalMoneybirdPlugin;
}

export {
	createMoneybirdOperation,
	getMoneybirdInputSchema,
	getMoneybirdOutputSchema,
	MONEYBIRD_OPERATION_IDS,
} from './endpoints';
export type {
	MoneybirdEndpointInputs,
	MoneybirdEndpointOutputs,
	MoneybirdJsonValue,
	MoneybirdOperationId,
} from './endpoints/types';
export {
	MoneybirdEndpointInputSchemas,
	MoneybirdEndpointOutputSchemas,
} from './endpoints/types';
